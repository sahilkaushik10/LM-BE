// In models/user.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  name: string;
  username: string;
  password: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<User>('User', userSchema);
