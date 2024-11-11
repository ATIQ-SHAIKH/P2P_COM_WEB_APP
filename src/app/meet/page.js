"use client";

import { useEffect } from "react";
import { logout } from "@/utils/auth";



export default function meet() {

  useEffect(() => {
    // logout();

    return () => {};
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      MEET SCREEN
    </div>
  );
}
