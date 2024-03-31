"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: sessionData } = useSession();

  if (!sessionData?.user) {
    return null;
  }

  return (
    <header>
        <div className="navbar bg-base-300 text-primary-content">
            <div className="w-full flex-1 px-5 text-3xl font-bold">
                <div className="w-full flex justify-between items-center">
                    <p className="text-neutral">Notes for {sessionData.user.name}</p>
                    <Image className="rounded-full" width={80} height={80} src={sessionData.user.image!} alt={sessionData.user.name!} />
                </div>
            </div>
        </div>
    </header>
  );
}
