import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES } from '@/data/packages';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch persisted catalog state from MongoDB Atlas database
    const dbState = await prisma.catalogState.findUnique({
      where: { id: 'global_catalog' },
    });

    let packages = HOLIDAY_PACKAGES;
    let products = PRODUCTS;
    let cms = null;
    let blogs = null;

    if (dbState) {
      if (dbState.packages && Array.isArray(dbState.packages) && (dbState.packages as any[]).length > 0) {
        packages = dbState.packages as any[];
      }
      if (dbState.products && Array.isArray(dbState.products) && (dbState.products as any[]).length > 0) {
        products = dbState.products as any[];
      }
      if (dbState.cms) {
        cms = dbState.cms;
      }
      if (dbState.blogs && Array.isArray(dbState.blogs)) {
        blogs = dbState.blogs as any[];
      }
    }

    return NextResponse.json({
      success: true,
      products,
      packages,
      cms,
      blogs,
    });
  } catch (error: any) {
    console.error('Failed to fetch catalog from MongoDB Atlas:', error);
    return NextResponse.json({
      success: true,
      products: PRODUCTS,
      packages: HOLIDAY_PACKAGES,
      cms: null,
      blogs: null,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { products, packages, cms, blogs } = body;

    // Fetch existing state from MongoDB Atlas
    const existing = await prisma.catalogState.findUnique({
      where: { id: 'global_catalog' },
    });

    const updateData: any = {};

    if (packages && Array.isArray(packages) && packages.length > 0) {
      updateData.packages = packages;
    }
    if (products && Array.isArray(products) && products.length > 0) {
      updateData.products = products;
    }
    if (cms) {
      updateData.cms = cms;
    }
    if (blogs && Array.isArray(blogs) && blogs.length > 0) {
      updateData.blogs = blogs;
    }

    // Upsert into MongoDB Atlas CatalogState table
    const savedState = await prisma.catalogState.upsert({
      where: { id: 'global_catalog' },
      update: updateData,
      create: {
        id: 'global_catalog',
        packages: updateData.packages || existing?.packages || HOLIDAY_PACKAGES,
        products: updateData.products || existing?.products || PRODUCTS,
        cms: updateData.cms || existing?.cms || null,
        blogs: updateData.blogs || existing?.blogs || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Catalog updated and permanently saved in MongoDB Atlas database.',
      products: savedState.products,
      packages: savedState.packages,
      cms: savedState.cms,
      blogs: savedState.blogs,
    });
  } catch (error: any) {
    console.error('Catalog POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update catalog in MongoDB Atlas.' },
      { status: 500 }
    );
  }
}
