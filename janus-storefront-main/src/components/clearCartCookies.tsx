"use client";

import { removeCartCookies } from "@/lib/bff/cart";
import { useEffect } from "react";

export function ClearCartCookies() {
  useEffect(() => {
    removeCartCookies();
  }, []);

  return null;
}
