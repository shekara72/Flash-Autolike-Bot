"use client";

import { use } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AccountInfoModule from "@/components/account-info-module";

export default function PlayerAccountDetailsPage({ params }: { params: Promise<{ uid: string }> }) {
  const resolvedParams = use(params);
  const uid = resolvedParams.uid;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 space-y-8">
        <AccountInfoModule initialUid={uid} showSearchHeader={true} />
      </main>
      <Footer />
    </div>
  );
}
