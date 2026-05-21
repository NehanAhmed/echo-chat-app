import { createServer } from 'http';
import app from './app';
import dotenv from 'dotenv';
import { initSocket } from './socket';
import connectDB from './db/db';
dotenv.config();

const PORT = process.env.PORT || 5000

const httpServer = createServer(app);

const start = async () => {
  await connectDB();
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();