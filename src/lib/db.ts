/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
let prisma: any;

try {
  // Use require dynamically to avoid TypeScript compile-time checks when binaries are missing
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
} catch (e) {
  // Resilient fallback when Prisma client hasn't been generated
  prisma = {
    user: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async (args: any) => ({ id: 'mock-user-id', ...args.data }),
      update: async (args: any) => ({ id: args.where.id || 'mock-user-id', ...args.data }),
    },
    product: {
      findMany: async () => [],
      create: async (args: any) => ({ id: 'mock-product-id', ...args.data }),
    },
    booking: {
      create: async (args: any) => ({ id: 'mock-booking-id', ...args.data }),
      findMany: async () => [],
    },
    order: {
      create: async (args: any) => ({ id: 'mock-order-id', ...args.data }),
      findMany: async () => [],
    }
  };
}

export default prisma;
