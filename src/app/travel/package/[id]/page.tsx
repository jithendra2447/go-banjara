'use client';

import React from 'react';
// Next.js dynamic routing parameters hook
import { useParams } from 'next/navigation';
import PackageDetails from '@/components/PackageDetails';

export default function DynamicPackageDetailsPage() {
  const params = useParams() as { id?: string };
  const id = params?.id;

  if (!id) return null;

  return <PackageDetails customId={id} />;
}
