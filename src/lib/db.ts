import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

//what is hot reload ? 
// Hot reload is a development feature that allows code changes to be applied in real-time without needing to restart the entire application. This is particularly useful in development environments, as it speeds up the testing and debugging process by automatically updating the running application with the latest code changes. In the context of this Prisma client setup, hot reload ensures that a new instance of PrismaClient is not created every time the code is reloaded, which helps maintain a single database connection during development.

//npx prisma migrate reset
// to del all the data and make sure you use this in development not in production