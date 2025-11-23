import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' }, // Par défaut, un nouvel utilisateur est "editor"
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', userSchema);