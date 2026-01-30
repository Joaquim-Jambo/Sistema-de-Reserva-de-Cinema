
import { Category, Movie, Session, User, UserRole } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Ação' },
  { id: '2', name: 'Comédia' },
  { id: '3', name: 'Drama' },
  { id: '4', name: 'Ficção Científica' },
  { id: '5', name: 'Terror' }
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Interstellar',
    description: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço em uma tentativa de garantir a sobrevivência da humanidade.',
    categoryIds: ['4'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    duration: 169,
    rating: 4.9,
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
  },
  {
    id: 'm2',
    title: 'The Dark Knight',
    description: 'Quando a ameaça conhecida como o Coringa emerge de seu passado misterioso, ele causa estragos e caos nas pessoas de Gotham.',
    categoryIds: ['1'],
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop',
    duration: 152,
    rating: 4.8,
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY'
  },
  {
    id: 'm3',
    title: 'Parasite',
    description: 'A ganância e a discriminação de classe ameaçam o relacionamento simbiótico recém-formado entre a rica família Park e o clã Kim.',
    categoryIds: ['3'],
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop',
    duration: 132,
    rating: 4.7,
    trailerUrl: 'https://www.youtube.com/embed/5xH0HfJHsaY'
  },
  {
    id: 'm4',
    title: 'Dune: Part Two',
    description: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.',
    categoryIds: ['4'],
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1000&auto=format&fit=crop',
    duration: 166,
    rating: 4.9,
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w'
  }
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_SESSIONS: Session[] = [
  { id: 's1', movieId: 'm1', date: today, time: '14:00', room: 'IMAX 01', price: 45 },
  { id: 's2', movieId: 'm1', date: today, time: '19:30', room: 'IMAX 01', price: 45 },
  { id: 's3', movieId: 'm2', date: today, time: '21:00', room: 'Sala 04', price: 35 },
  { id: 's4', movieId: 'm3', date: tomorrow, time: '16:00', room: 'Sala 02', price: 30 },
  { id: 's5', movieId: 'm4', date: today, time: '18:00', room: 'Sala VIP', price: 60 },
  { id: 's6', movieId: 'm4', date: tomorrow, time: '20:00', room: 'Sala VIP', price: 60 },
  { id: 's7', movieId: 'm2', date: tomorrow, time: '14:00', room: 'Sala 04', price: 35 },
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@cine.com', role: UserRole.ADMIN },
  { id: 'u2', name: 'Jane Doe', email: 'jane@test.com', role: UserRole.CLIENT }
];
