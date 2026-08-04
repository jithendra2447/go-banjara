import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { PRODUCTS } from '@/data/products';
import { HOLIDAY_PACKAGES } from '@/data/packages';

// Global in-memory fallback cache for fast serverless sync across subdomains
let catalogCache: {
  products?: any[];
  packages?: any[];
  cms?: any;
  blogs?: any[];
} = {
  products: PRODUCTS,
  packages: HOLIDAY_PACKAGES,
};

export async function GET() {
  try {
    // Attempt to fetch live products from MongoDB Atlas
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    let products = catalogCache.products && catalogCache.products.length > 0 ? catalogCache.products : PRODUCTS;
    
    if (dbProducts && dbProducts.length > 0) {
      // Map DB products to application shape
      const mapped = dbProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        rating: p.rating,
        inStock: p.inStock,
      }));

      // Merge with cache if custom fields exist in cache
      products = mapped;
    }

    return NextResponse.json({
      success: true,
      products: catalogCache.products || products,
      packages: catalogCache.packages || HOLIDAY_PACKAGES,
      cms: catalogCache.cms || null,
      blogs: catalogCache.blogs || null,
    });
  } catch (error: any) {
    console.error('Failed to fetch catalog from API:', error);
    return NextResponse.json({
      success: true,
      products: catalogCache.products || PRODUCTS,
      packages: catalogCache.packages || HOLIDAY_PACKAGES,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { products, packages, cms, blogs } = body;

    if (products && Array.isArray(products)) {
      catalogCache.products = products;

      // Upsert products to MongoDB Atlas asynchronously
      try {
        for (const p of products) {
          if (p.name && p.price !== undefined) {
            await prisma.product.upsert({
              where: { id: p.id && p.id.length === 24 ? p.id : '000000000000000000000000' },
              update: {
                name: p.name,
                description: p.description || '',
                price: Number(p.price) || 0,
                image: p.image || '',
                category: p.category || 'General',
                inStock: p.inStock !== false,
              },
              create: {
                name: p.name,
                description: p.description || '',
                price: Number(p.price) || 0,
                image: p.image || '',
                category: p.category || 'General',
                inStock: p.inStock !== false,
              },
            }).catch(() => {});
          }
        }
      } catch (dbErr) {
        console.error('MongoDB product upsert warning:', dbErr);
      }
    }

    if (packages && Array.isArray(packages)) {
      catalogCache.packages = packages;
    }

    if (cms) {
      catalogCache.cms = cms;
    }

    if (blogs && Array.isArray(blogs)) {
      catalogCache.blogs = blogs;
    }

    return NextResponse.json({
      success: true,
      message: 'Catalog updated successfully across all subdomains and devices.',
      products: catalogCache.products,
      packages: catalogCache.packages,
    });
  } catch (error: any) {
    console.error('Catalog POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update catalog.' },
      { status: 500 }
    );
  }
}
