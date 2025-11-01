"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Jumpscare() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/end");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-black overflow-hidden">
      <Image
        src="/jumpscare.png"
        alt="Jumpscare"
        width={1920}
        height={1080}
        className="object-cover absolute inset-0 w-full h-full animate-pulse"
      />
      jumpscare
      <audio autoPlay>
        <source src="/jumpscare-sound.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
