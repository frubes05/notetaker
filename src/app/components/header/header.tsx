"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: sessionData } = useSession();

  if (!sessionData?.user) {
    return  (
      <div className="flex justify-center items-center">
        <button className="bg-green-200 p-4 text-white" type="button" onClick={() => signIn()}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <header>
        <div className="navbar bg-base-300 text-primary-content">
            <div className="w-full flex-1 px-5 text-3xl font-bold">
                <div className="w-full flex justify-between items-center">
                    <p className="text-neutral">Notes for {sessionData.user.name}</p>
                    <div className="flex gap-4 items-center">
                      <button className="bg-red-200 p-4 text-white" type="button" onClick={() => signOut()}>Sign out</button>
                      <Image className="rounded-full" width={80} height={80} src={sessionData.user.image!} alt={sessionData.user.name!} />
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
}
