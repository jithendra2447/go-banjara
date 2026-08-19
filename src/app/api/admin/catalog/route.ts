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

    let dbPackages = await prisma.travelPackage.findMany();

    // Auto-seed TravelPackage collection if empty or incomplete
    if (!dbPackages || dbPackages.length < HOLIDAY_PACKAGES.length) {
      const initialPackages = (dbState?.packages && Array.isArray(dbState.packages) && (dbState.packages as any[]).length >= HOLIDAY_PACKAGES.length)
        ? (dbState.packages as any[])
        : HOLIDAY_PACKAGES;

      for (const pkg of initialPackages) {
        try {
          const pkgPayload = {
            name: pkg.name,
            price: pkg.price,
            originalPrice: pkg.originalPrice,
            duration: pkg.duration,
            durationDays: pkg.durationDays || 1,
            rating: pkg.rating || 5.0,
            ratingCount: pkg.ratingCount || 0,
            hotelStars: pkg.hotelStars,
            hotelClass: pkg.hotelClass,
            route: pkg.route,
            routeList: pkg.routeList || [],
            description: pkg.description,
            inclusions: pkg.inclusions || [],
            highlights: pkg.highlights || [],
            image: pkg.image,
            themes: pkg.themes || [],
            destination: pkg.destination,
            detailsAvailable: pkg.detailsAvailable ?? true,
            link: pkg.link,
            category: pkg.category,
            difficulty: pkg.difficulty,
            groupType: pkg.groupType,
            nextDeparture: pkg.nextDeparture,
            startPoint: pkg.startPoint,
            isBestSeller: pkg.isBestSeller ?? false,
            showOnHome: pkg.showOnHome ?? false,
            hidden: pkg.hidden ?? false,
            homeShowcaseSection: pkg.homeShowcaseSection,
            images: pkg.images || [],
            exclusions: pkg.exclusions || [],
            packingList: pkg.packingList || [],
            faqs: pkg.faqs || null,
            reviews: pkg.reviews || null,
            guide: pkg.guide || null,
            departures: pkg.departures || null,
            itinerary: pkg.itinerary || null,
          };
          await prisma.travelPackage.upsert({
            where: { id: pkg.id },
            update: pkgPayload,
            create: {
              id: pkg.id,
              ...pkgPayload,
            },
          });
        } catch (e) {
          console.error(`Failed to seed travel package ${pkg.id}:`, e);
        }
      }
      dbPackages = await prisma.travelPackage.findMany();
    }

    let packages = dbPackages.length > 0 ? dbPackages : HOLIDAY_PACKAGES;
    let products = PRODUCTS;
    let cms = null;
    let blogs = null;

    if (dbState) {
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

    // Save travel packages directly into TravelPackage collection
    if (packages && Array.isArray(packages)) {
      const activeIds = packages.map((p: any) => p.id).filter(Boolean);

      // Remove deleted packages from database collection
      if (activeIds.length > 0) {
        try {
          await prisma.travelPackage.deleteMany({
            where: { id: { notIn: activeIds } }
          });
        } catch (e) {
          console.error('Failed to cleanup deleted travel packages:', e);
        }
      }

      for (const pkg of packages) {
        try {
          await prisma.travelPackage.upsert({
            where: { id: pkg.id },
            update: {
              name: pkg.name,
              price: pkg.price,
              originalPrice: pkg.originalPrice,
              duration: pkg.duration,
              durationDays: pkg.durationDays || 1,
              rating: pkg.rating || 5.0,
              ratingCount: pkg.ratingCount || 0,
              hotelStars: pkg.hotelStars,
              hotelClass: pkg.hotelClass,
              route: pkg.route,
              routeList: pkg.routeList || [],
              description: pkg.description,
              inclusions: pkg.inclusions || [],
              highlights: pkg.highlights || [],
              image: pkg.image,
              themes: pkg.themes || [],
              destination: pkg.destination,
              detailsAvailable: pkg.detailsAvailable ?? true,
              link: pkg.link,
              category: pkg.category,
              difficulty: pkg.difficulty,
              groupType: pkg.groupType,
              nextDeparture: pkg.nextDeparture,
              startPoint: pkg.startPoint,
              isBestSeller: pkg.isBestSeller ?? false,
              showOnHome: pkg.showOnHome ?? false,
              hidden: pkg.hidden ?? false,
              homeShowcaseSection: pkg.homeShowcaseSection,
              images: pkg.images || [],
              exclusions: pkg.exclusions || [],
              packingList: pkg.packingList || [],
              faqs: pkg.faqs || null,
              reviews: pkg.reviews || null,
              guide: pkg.guide || null,
              departures: pkg.departures || null,
              itinerary: pkg.itinerary || null,
            },
            create: {
              id: pkg.id,
              name: pkg.name,
              price: pkg.price,
              originalPrice: pkg.originalPrice,
              duration: pkg.duration,
              durationDays: pkg.durationDays || 1,
              rating: pkg.rating || 5.0,
              ratingCount: pkg.ratingCount || 0,
              hotelStars: pkg.hotelStars,
              hotelClass: pkg.hotelClass,
              route: pkg.route,
              routeList: pkg.routeList || [],
              description: pkg.description,
              inclusions: pkg.inclusions || [],
              highlights: pkg.highlights || [],
              image: pkg.image,
              themes: pkg.themes || [],
              destination: pkg.destination,
              detailsAvailable: pkg.detailsAvailable ?? true,
              link: pkg.link,
              category: pkg.category,
              difficulty: pkg.difficulty,
              groupType: pkg.groupType,
              nextDeparture: pkg.nextDeparture,
              startPoint: pkg.startPoint,
              isBestSeller: pkg.isBestSeller ?? false,
              showOnHome: pkg.showOnHome ?? false,
              hidden: pkg.hidden ?? false,
              homeShowcaseSection: pkg.homeShowcaseSection,
              images: pkg.images || [],
              exclusions: pkg.exclusions || [],
              packingList: pkg.packingList || [],
              faqs: pkg.faqs || null,
              reviews: pkg.reviews || null,
              guide: pkg.guide || null,
              departures: pkg.departures || null,
              itinerary: pkg.itinerary || null,
            },
          });
        } catch (e) {
          console.error(`Failed to upsert travel package ${pkg.id}:`, e);
        }
      }
    }

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

    const savedPackages = await prisma.travelPackage.findMany();

    return NextResponse.json({
      success: true,
      message: 'Catalog updated and permanently saved in MongoDB Atlas database.',
      products: savedState.products,
      packages: savedPackages.length > 0 ? savedPackages : savedState.packages,
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
