"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSound from "use-sound";

export default function Jumpscare() {
  const router = useRouter();

  const [play] = useSound("/scare.mp3", {
    playbackRate: 1,
    volume: 0.9,
    loop: true,
  });

  useEffect(() => {
    const goFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if ((elem as any).msRequestFullscreen)
        (elem as any).msRequestFullscreen();
      else if ((elem as any).mozRequestFullScreen)
        (elem as any).mozRequestFullScreen();
      else if ((elem as any).webkitRequestFullscreen)
        (elem as any).webkitRequestFullscreen();
    };

    const attiva = () => {
      goFullScreen();
      play();
    };

    attiva();
  }, [router, play]);

  return (
    <div
      id="jumpscare"
      className="relative flex items-center justify-center h-screen w-screen bg-white overflow-hidden text-center"
    >
      <Image
        src="/jamp.gif"
        alt="Jumpscare"
        width={1920}
        height={1080}
        className="object-contain animate-pulse z-50"
      />
    </div>
  );
}
