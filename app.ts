import { createServer } from './server';
import dotenv from 'dotenv';
dotenv.config();

const startServer = async () => {
  try {
    const app = await createServer();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();


// Query: {
//   users: async () => {
//     return await User.find();
//   },
//   user: async (_: any, { id }: { id: string }) => {
//     return await User.findById(id);
//   },
// },