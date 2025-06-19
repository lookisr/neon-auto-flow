import { User, IUser } from '../models/User';
import bcrypt from 'bcryptjs';

export async function createUser(email: string, password: string): Promise<IUser> {
  const user = new User({ email, password });
  await user.save();
  return user;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}

export async function comparePassword(user: IUser, password: string): Promise<boolean> {
  return user.comparePassword(password);
} 