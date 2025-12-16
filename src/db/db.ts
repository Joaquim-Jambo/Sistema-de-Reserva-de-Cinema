import { Movie } from "../models/movie.model";
import { User } from "../models/user.model";

const users: User[] = [
  {
    id: "1",
    email: "admin@system.com",
    name: "Admin Root",
    password: "hashed_password_admin",
    role: "Admin",
  },
  {
    id: "2",
    email: "manager@system.com",
    name: "Manager User",
    password: "hashed_password_manager",
    role: "Manager",
  },
  {
    id: "3",
    email: "user@system.com",
    name: "Normal User",
    password: "hashed_password_user",
    role: "User",
  },
];

const movies: Movie[] = [];
export const db = {
    users,
    movies
}