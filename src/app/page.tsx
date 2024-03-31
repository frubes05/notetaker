"use client";

import { unstable_noStore as noStore } from "next/cache";

import Header from "./components/header/header";
import { SessionProvider } from "next-auth/react";
import Content from "./features/content/content/content";

export default async function Home() {
  noStore();
  return (
    <SessionProvider>
      <Header />
      <Content />
    </SessionProvider>
  );
}
