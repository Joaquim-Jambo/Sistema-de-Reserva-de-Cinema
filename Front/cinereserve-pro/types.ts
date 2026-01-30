
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  posterUrl: string;
  duration: number; // in minutes
  rating: number; // 0-5
  trailerUrl?: string; // YouTube or Vimeo embed URL
  cast?: string;
  countryOfOrigin?: string;
  director?: string;
  distribuitor?: string;
}

export interface Session {
  id: string;
  movieId: string;
  date: string; // ISO string
  time: string; // e.g., "19:30"
  room: string;
  price: number;
}

export interface Reservation {
  id: string;
  userId: string;
  sessionId: string;
  seats: string[]; // e.g., ["A1", "A2"]
  totalPrice: number;
  createdAt: string;
  isScanned?: boolean;
}

export interface SeatStatus {
  id: string; // e.g., "A1"
  status: 'available' | 'reserved' | 'selected';
}
