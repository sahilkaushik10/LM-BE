// server.ts
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import connectDB from './db-config/db';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createServer = async () => {
  await connectDB();

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      let user = null;
      if (token) {
        try {
          const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || '');
          console.log("decoded: ",decoded)
          user = decoded;
        } catch (e) {
          console.error(e);
        }
      }
      return { user };
    },
  });

  await server.start();

  server.applyMiddleware({ app });

  return app;
};
