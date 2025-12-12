"use client";

import React, { use } from "react";
import CategoryFormPage from "../../create/page";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  return <CategoryFormPage initialCategoryId={categoryId} />;
}
