"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VasteLastenRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/uitgaves");
  }, [router]);
  return null;
}
