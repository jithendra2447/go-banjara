/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const mockPrisma = {
  user: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-user-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-user-id', ...args?.data }),
    upsert: async (args: any) => ({ id: args?.where?.id || 'mock-user-id', ...args?.create }),
    delete: async () => ({ id: 'mock-user-id' }),
    count: async () => 0,
  },
  product: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-product-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-product-id', ...args?.data }),
    count: async () => 0,
  },
  booking: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-booking-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-booking-id', ...args?.data }),
    count: async () => 0,
  },
  order: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-order-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-order-id', ...args?.data }),
    count: async () => 0,
  },
  contactSubmission: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-contact-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-contact-id', ...args?.data }),
    count: async () => 0,
  },
  newsletterSubscriber: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-sub-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-sub-id', ...args?.data }),
    count: async () => 0,
  }
};

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

let prismaInstance: any;

try {
  if (!process.env.DATABASE_URL) {
    console.warn("[DB WARNING] DATABASE_URL environment variable is missing. Database writes will fallback to mock.");
    prismaInstance = mockPrisma;
  } else {
    prismaInstance =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} catch (e) {
  console.error("[DB ERROR] Prisma Client initialization failed:", e);
  prismaInstance = mockPrisma;
}

export const prisma = prismaInstance;
export default prisma;

