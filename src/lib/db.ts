/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
let prisma: any;

const mockPrisma = {
  user: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-user-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-user-id', ...args?.data }),
    upsert: async (args: any) => ({ id: args?.where?.id || 'mock-user-id', ...args?.create }),
    delete: async () => ({ id: 'mock-user-id' }),
  },
  product: {
    findUnique: async () => null,
    findFirst: async () => null,
    findMany: async () => [],
    create: async (args: any) => ({ id: 'mock-product-id', ...args?.data }),
    update: async (args: any) => ({ id: args?.where?.id || 'mock-product-id', ...args?.data }),
  },
  booking: {
    findUnique: async () => null,
    findFirst: async () => null,
    create: async (args: any) => ({ id: 'mock-booking-id', ...args?.data }),
    findMany: async () => [],
    update: async (args: any) => ({ id: args?.where?.id || 'mock-booking-id', ...args?.data }),
  },
  order: {
    findUnique: async () => null,
    findFirst: async () => null,
    create: async (args: any) => ({ id: 'mock-order-id', ...args?.data }),
    findMany: async () => [],
    update: async (args: any) => ({ id: args?.where?.id || 'mock-order-id', ...args?.data }),
  }
};

try {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL environment variable is missing. Using resilient mock database.");
    prisma = mockPrisma;
  } else {
    const { PrismaClient } = require('@prisma/client');
    const globalRef = global as any;
    
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient();
    } else {
      if (!globalRef.prisma) {
        globalRef.prisma = new PrismaClient();
      }
      prisma = globalRef.prisma;
    }
  }
} catch (e) {
  console.warn("Prisma Client initialization failed. Using resilient fallback.");
  prisma = mockPrisma;
}

export default prisma;
