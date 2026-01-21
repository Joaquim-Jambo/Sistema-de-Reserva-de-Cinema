import bcrypt from 'bcrypt';
import prisma from './config/prismaClient';

type NewUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  preferredGenres: string[];
};

const CLIENT_ROLE_ID = 'f7ff722c-4a6b-4cc9-9630-97147f4d1e61';
const ADMIN_ROLE_ID = 'cf68d3c4-61d2-40e8-8576-d23ef5c4676f';

const users: NewUser[] = [
  {
    name: 'Alice Silva',
    email: 'alice@example.com',
    password: 'password123',
    phone: '+5511999000001',
    dateOfBirth: '1990-05-15',
    preferredGenres: ['Comédia', 'Ação']
  },
  {
    name: 'Bruno Costa',
    email: 'bruno@example.com',
    password: 'password123',
    phone: '+5511999000002',
    dateOfBirth: '1985-09-20',
    preferredGenres: ['Drama', 'Suspense']
  },
  {
    name: 'Camila Rocha',
    email: 'camila@example.com',
    password: 'password123',
    phone: '+5511999000003',
    dateOfBirth: '1995-12-01',
    preferredGenres: ['Animação', 'Família']
  },
  {
    name: 'Diego Martins',
    email: 'diego@example.com',
    password: 'password123',
    phone: '+5511999000004',
    dateOfBirth: '1992-03-10',
    preferredGenres: ['Ficção científica', 'Aventura']
  },
  {
    name: 'Eva Gomes',
    email: 'eva@example.com',
    password: 'password123',
    phone: '+5511999000005',
    dateOfBirth: '1988-07-22',
    preferredGenres: ['Romance', 'Comédia']
  }
];

async function main() {
  console.log('Iniciando seed...');

  // 1) Roles (create if not exists)
  let clientRole = await prisma.role.findUnique({ where: { id: CLIENT_ROLE_ID } });
  if (!clientRole) {
    clientRole = await prisma.role.create({ data: { id: CLIENT_ROLE_ID, role: 'CLIENT' } });
    console.log('Role CLIENT criada');
  }
  let adminRole = await prisma.role.findUnique({ where: { id: ADMIN_ROLE_ID } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { id: ADMIN_ROLE_ID, role: 'ADMIN' } });
    console.log('Role ADMIN criada');
  }

  // 2) Admin user
  const adminEmail = 'admin@example.com';
  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const hashed = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashed,
        roleId: adminRole.id
      }
    });
    console.log(`Usuário admin criado: ${adminUser.email}`);
  }

  // 3) Clients (regular users)
  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (exists) {
      console.log(`Usuário já existe, pulando: ${u.email}`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, 10);

    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashed,
        roleId: clientRole.id,
        client: {
          create: {
            phone: u.phone,
            dateOfBirth: new Date(u.dateOfBirth),
            preferredGenres: u.preferredGenres
          }
        }
      },
      include: { client: true }
    });

    console.log(`Criado usuário: ${created.email} (id: ${created.id})`);
  }

  // 4) Categories
  const categoryNames = ['Ação', 'Comédia', 'Drama', 'Animação', 'Romance', 'Suspense', 'Ficção científica', 'Aventura', 'Família'];
  const categories: Record<string, any> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    categories[name] = cat;
  }
  console.log('Categorias garantidas:', Object.keys(categories).length);

  // 5) Rooms + Seats
  const roomsData = [
    { number: 1, capacity: 30 },
    { number: 2, capacity: 20 },
    { number: 3, capacity: 50 }
  ];
  const rooms: any[] = [];
  for (const r of roomsData) {
    let room = await prisma.room.findFirst({ where: { number: r.number } });
    if (!room) {
      room = await prisma.room.create({ data: { number: r.number, capacity: r.capacity } });
      console.log(`Sala criada: ${room.number}`);
    }
    rooms.push(room);

    const seatCount = await prisma.seat.count({ where: { roomId: room.id } });
    if (seatCount === 0) {
      const seats = [];
      for (let i = 1; i <= r.capacity; i++) seats.push({ roomId: room.id, numberSeat: i });
      await prisma.seat.createMany({ data: seats });
      console.log(`Assentos criados para sala ${room.number}: ${r.capacity}`);
    }
  }

  // 6) Movies
  const moviesData = [
    {
      title: 'Spider-Man: No Way Home',
      description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
      coverImageUrl: '/images/spiderman.jpg',
      categories: ['Ação', 'Aventura']
    },
    {
      title: 'Inside Out',
      description: 'As the emotions inside a young girl guide her through life changes.',
      coverImageUrl: '/images/insideout.jpg',
      categories: ['Animação', 'Família']
    },
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through use of dream-sharing technology.',
      coverImageUrl: '/images/inception.jpg',
      categories: ['Ficção científica', 'Suspense']
    }
  ];
  const movies: any[] = [];
  for (const m of moviesData) {
    const movie = await prisma.movie.upsert({
      where: { title: m.title },
      update: {},
      create: {
        title: m.title,
        description: m.description,
        coverImageUrl: m.coverImageUrl,
        movieCategories: {
          create: m.categories.map((catName) => ({ category: { connect: { id: categories[catName].id } } }))
        }
      },
      include: { movieCategories: { include: { category: true } } }
    });
    movies.push(movie);
    console.log(`Filme garantido: ${movie.title}`);
  }

  // 7) Sessions (create a few per movie)
  const now = new Date();
  const sessions: any[] = [];
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    for (let s = 0; s < 2; s++) {
      const room = rooms[(i + s) % rooms.length];
      const date = new Date(now.getTime() + (i * 24 + s) * 60 * 60 * 1000);
      const exists = await prisma.session.findFirst({ where: { roomId: room.id, data: date } });
      if (exists) {
        sessions.push(exists);
        continue;
      }
      const created = await prisma.session.create({ data: { movieId: movie.id, roomId: room.id, data: date } });
      sessions.push(created);
      console.log(`Sessão criada: filme=${movie.title} sala=${room.number} data=${date.toISOString()}`);
    }
  }

  // 8) Reservations + ReservationSeats (example for some clients)
  const clients = await prisma.client.findMany({ include: { user: true } });
  if (clients.length > 0 && sessions.length > 0) {
    const firstClient = clients[0];
    const firstSession = sessions[0];
    const availableSeats = await prisma.seat.findMany({ where: { roomId: firstSession.roomId }, take: 2, orderBy: { numberSeat: 'asc' } });
    if (availableSeats.length > 0) {
      const reservation = await prisma.reservation.create({
        data: {
          sessionId: firstSession.id,
          userId: firstClient.userId,
          status: 'CONFIRMED'
        }
      });
      const rsData = availableSeats.map((s) => ({ seatId: s.id, reservationId: reservation.id }));
      await prisma.reservationSeat.createMany({ data: rsData });
      console.log(`Reserva criada para cliente ${firstClient.user.email} na sessão ${firstSession.id}`);
    }
  }

  console.log('Seed finalizado.');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


