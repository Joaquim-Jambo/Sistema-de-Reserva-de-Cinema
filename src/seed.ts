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

  // Verificar se as roles existem (não criamos roles neste seed)
  const clientRole = await prisma.role.findUnique({ where: { id: CLIENT_ROLE_ID } });
  const adminRole = await prisma.role.findUnique({ where: { id: ADMIN_ROLE_ID } });

  if (!clientRole || !adminRole) {
    console.error('Uma ou mais roles esperadas não foram encontradas na base. Verifique se as roles foram criadas:');
    console.error(`Client role (${CLIENT_ROLE_ID}) presente? ${!!clientRole}`);
    console.error(`Admin role (${ADMIN_ROLE_ID}) presente? ${!!adminRole}`);
    process.exit(1);
  }

  // Criar um usuário admin, caso não exista
  const adminEmail = 'admin@example.com';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10);
    const adminCreated = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashed,
        roleId: adminRole.id
      }
    });
    console.log(`Usuário admin criado: ${adminCreated.email} (id: ${adminCreated.id})`);
  } else {
    console.log(`Usuário admin já existe, pulando: ${adminEmail}`);
  }

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
