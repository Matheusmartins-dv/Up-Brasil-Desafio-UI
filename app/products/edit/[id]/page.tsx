"use client";

import React, { use } from "react";
import ProductFormPage from "../../create/page";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  return <ProductFormPage initialProductId={productId} />;
}
