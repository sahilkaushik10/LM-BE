import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel as User } from '../models/user';
import dotenv from 'dotenv';
dotenv.config();

interface UserInput {
  name: string;
  username: string;
  password: string;
}

interface LoginInput {
  username: string;
  password: string;
}

const generateTokens = (user: any) => {
  console.log("jwt secret", process.env.JWT_SECRET)
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
  console.log("token", accessToken)
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const resolvers = {
  Query: {
    users: async (_: any, __: any, { user }: { user: any }) => {
      console.log("users", __, user)
      if (!user) {
        throw new Error('Not authenticated');  
      }
      return await User.find(); 
    },
    user: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user) {
        throw new Error('Not authenticated');  
      }
      return await User.findById(id);  
    },
  },
  
  Mutation: {
    register: async (_: any, { name, username, password }: UserInput) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, username, password: hashedPassword });
      return await newUser.save();
    },

    login: async (_: any, { username, password }: LoginInput) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const { accessToken, refreshToken } = generateTokens(user);
      return { accessToken, refreshToken, user };
    },

    // refreshToken: async (_: any, { refreshToken }: { refreshToken: string }) => {
    //   try {
    //     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || '');
    //     const user = await User.findById(decoded.id);
    //     if (!user) throw new Error('User not found');

    //     const { accessToken, newRefreshToken } = generateTokens(user);
    //     return { accessToken, refreshToken: newRefreshToken, user };
    //   } catch (error) {
    //     throw new Error('Invalid refresh token');
    //   }
    // },
  },
};

export default resolvers;
