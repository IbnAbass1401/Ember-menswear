"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

export default function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}