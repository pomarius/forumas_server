import * as http from 'http';
import expressConfig from './config/express';
import { prisma } from './config/prisma';
import { NODE_ENV, PORT } from './constants';

const run = async () => {
  const app = expressConfig();
  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`ENV: ${NODE_ENV}`);
    console.log(`PORT: ${PORT}`);
    console.log(`=================================`);
  });
};

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
