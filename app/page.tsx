"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icon } from "@/components/icons";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/blurhouse.png"
          alt="Horror House"
          objectFit="cover"
          layout="fill"
          className="mask-[radial-gradient(circle,#000_10%,transparent_80%)] blur-sm"
        />
      </div>

      <div className="absolute inset-0 z-50 pointer-events-none">
        <div className="animate-float w-64 h-64 rounded-full bg-purple-500/30 blur-3xl absolute top-20 left-10" />
        <div className="animate-float w-48 h-48 rounded-full bg-teal-300/20 blur-2xl absolute bottom-32 right-16" />
        <div className="animate-float w-48 h-48 rounded-full bg-rose-300/20 blur-2xl absolute top-11 right-45" />
      </div>

      <div className="w-[500px] bg-black text-white border-none relative z-10 flex items-center justify-center h-full px-6 md:px-0">
        <div className="p-10 md:p-20 rounded-3xl text-center">
          <h1 className="text-5xl md:text-5xl font-bold horror-title text-white mb-8 tracking-wide vhs-effect">
            Night at <br /> Ravenshade Manor
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-lg mx-auto">
            Venture into the manor where secrets linger and the unknown awaits.
          </p>
          <Link href="/story">
            <Button className="relative px-10 py-4 text-lg font-bold neon-btn">
              Begin <Icon name="play" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 z-5">
        <Image
          src="/forest-black.svg"
          alt="Forest"
          objectFit="cover"
          layout="fill"
          className="-bottom-2"
        />
      </div>
    </div>
  );
}
