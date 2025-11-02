"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path
        d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z"
        fill="currentColor"
      />
    </svg>
  );
}

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
            Choose Your Nightmare
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-lg mx-auto">
            Two tales await. Which darkness will you face tonight?
          </p>

          <div className="flex flex-col gap-4 items-center">
            <Link href="/story?name=ravenshade">
              <Button className="relative px-10 py-4 text-lg font-bold neon-btn mb-2">
                Ravenshade Manor <PlayIcon />
              </Button>
            </Link>

            <Button
              className="relative px-10 py-4 text-lg font-bold neon-btn"
              disabled
            >
              The Thing in the Drain <PlayIcon />
            </Button>
          </div>
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
