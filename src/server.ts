import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import AppError from './app/errors/AppError';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  const mongoUrl = config.db_url;
  if (!mongoUrl) {
    throw new AppError(404, 'Mongodb url environment variable is not defined');
  }
  await mongoose.connect(mongoUrl as string);
  seedSuperAdmin();
  server = app.listen(config.port, () => {
    console.log(`The app listening on port ${config.port}`);
  });
}
main().catch(err => console.log(err));

process.on('unhandledRejection', () => {
  console.log("UnhandledRejection detected!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
})

process.on('uncaughtException', () => {
  console.log("Uncaught Exception detected!");
  process.exit(1);
})