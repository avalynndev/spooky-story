"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TextGenerateEffect } from "@/components/textgen";
import useSound from "use-sound";

type Option = { text: string; next: number | string | null };
type Scene = {
  id: number | string;
  text: string;
  image: string;
  options: Option[];
};
type StoryJSON = { title: string; description?: string; pages: Scene[] };

export default function Story() {
  const router = useRouter();
  const [story, setStory] = useState<StoryJSON | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [play] = useSound("/background-music.mp3", {
    playbackRate: 0.75,
    volume: 0.45,
    loop: true,
  });

  const [growl] = useSound("/growl.mp3", { volume: 0.2 });
  const [heartbeat] = useSound("/heartbeat.mp3", { volume: 0.3 });

  useEffect(() => {
    play();
    const growlTimer = setInterval(
      () => growl(),
      15000 + Math.random() * 10000
    );
    const heartTimer = setInterval(() => heartbeat(), 12000);
    return () => {
      clearInterval(growlTimer);
      clearInterval(heartTimer);
    };
  }, [play, growl, heartbeat]);

  useEffect(() => {
    let cancelled = false;
    async function loadStory() {
      setLoading(true);
      try {
        const res = await fetch(`/stories/ravenshade.json`);
        if (!res.ok) throw new Error("Story not found");
        const json: StoryJSON = await res.json();
        if (!cancelled) {
          setStory(json);
          setCurrentPage(0);
        }
      } catch {
        if (!cancelled) {
          const res2 = await fetch(`/stories/ravenshade.json`);
          const fallback = await res2.json();
          setStory(fallback);
          setCurrentPage(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadStory();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChoice = (next: number | string | null) => {
    if (next === null) return setCurrentPage(0);
    if (next === "jumpscare") return router.push("/jumpscare");
    const nextIndex = Number(next);
    if (isNaN(nextIndex) || !story?.pages.find((p) => p.id === nextIndex))
      setCurrentPage(0);
    else setCurrentPage(nextIndex);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-red-600 animate-pulse text-lg font-mono">
        <p>Summoning darkness...</p>
      </div>
    );

  if (!story)
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-gray-400 text-center">
        <p>
          Could not load story.
          <br />
          The shadows whisper that <code>/stories/ravenshade.json</code> is
          missing.
        </p>
      </div>
    );

  const scene = story.pages.find((p) => p.id === currentPage) ?? story.pages[0];
  if (!scene) return null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-mono">
      <motion.img
        width={1920}
        height={1080}
        src={scene.image}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-65 pointer-events-none"
        animate={{ opacity: [0.4, 0.55, 0.35, 0.5, 0.45] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 bg-[url('/fog.jpg')] bg-cover opacity-25 mix-blend-lighten z-50 pointer-events-none"
        animate={{ backgroundPositionX: ["0%", "100%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute inset-0 bg-[url('/shadow.jpg')] bg-cover pointer-events-none"
        animate={{ opacity: [0.1, 0.25, 0.15, 0.3, 0.18] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-0 bg-[url('/blood.jpg')] bg-cover opacity-10 mix-blend-screen pointer-events-none"
        animate={{ opacity: [0.08, 0.15, 0.12] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <motion.h1
        className="relative z-10 text-center mt-16 text-5xl font-extrabold tracking-[0.4em] text-transparent bg-clip-text pointer-events-none bg-linear-to-r from-red-800 via-red-500 to-red-800 drop-shadow-[0_0_25px_#ff0000]"
        animate={{
          opacity: [1, 0.95, 1],
          y: [0, -1, 1, 0],
          filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(0deg)"],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {story.title.toUpperCase()}
      </motion.h1>

      <div className="relative z-10 mx-auto max-w-2xl text-center mt-10 text-gray-200 text-lg tracking-wide leading-relaxed">
        <motion.div
          key={`text-ravenshade-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <TextGenerateEffect
            duration={2.8}
            filter={false}
            words={scene.text}
          />
        </motion.div>
      </div>

      <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center z-20">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="flex flex-col gap-3"
          >
            {scene.options?.length ? (
              scene.options.map((choice, i) => (
                <Button
                  key={i}
                  onClick={() => handleChoice(choice.next)}
                  className="px-10 py-4 bg-red-900/80 hover:bg-red-700/90 text-white tracking-[0.2em] uppercase text-sm shadow-[0_0_30px_#ff000060] hover:shadow-[0_0_60px_#ff0000aa]"
                >
                  {choice.text}
                </Button>
              ))
            ) : (
              <Button
                onClick={() => handleChoice(null)}
                className="px-10 py-4 bg-gray-800/80 hover:bg-gray-600 text-white uppercase tracking-widest"
              >
                Return
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute inset-0 bg-red-900/10 pointer-events-none"
        animate={{ opacity: [0, 0.2, 0, 0.3, 0, 0.1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: [0, -1, 1, 0],
          y: [0, 1, -1, 0],
          rotate: [0, 0.1, -0.1, 0],
        }}
        transition={{ duration: 0.25, repeat: Infinity }}
      />
    </div>
  );
}
