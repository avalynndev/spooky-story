"use client";

import { Icon } from "@/components/icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TextGenerateEffect } from "@/components/textgen";
import useSound from "use-sound";
import Image from "next/image";

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
  const params = useSearchParams();
  const nameParam = params?.get("name") ?? "ravenshade";

  const [story, setStory] = useState<StoryJSON | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [play] = useSound("/background-music.mp3", { playbackRate: 0.75 });

  useEffect(() => {
    play();
  }, [play]);

  useEffect(() => {
    let cancelled = false;
    async function loadStory() {
      setLoading(true);
      try {
        const path = `/stories/${nameParam}.json`;
        const res = await fetch(path);
        if (!res.ok) throw new Error("Story not found");
        const json: StoryJSON = await res.json();
        if (cancelled) return;
        setStory(json);
        setCurrentPage(0);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          try {
            const res2 = await fetch(`/stories/ravenshade.json`);
            const fallback = await res2.json();
            setStory(fallback);
            setCurrentPage(0);
          } catch {
            setStory(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadStory();
    return () => {
      cancelled = true;
    };
  }, [nameParam]);

  const handleChoice = (next: number | string | null) => {
    if (next === null) return setCurrentPage(0); 
    if (next === "jumpscare") return router.push("/jumpscare");

    const nextIndex = Number(next);
    if (
      isNaN(nextIndex) ||
      !story?.pages.find((p) => p.id === nextIndex && p !== undefined)
    ) {
      setCurrentPage(0);
    } else {
      setCurrentPage(nextIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
        <p>Loading story...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
        <p>
          Could not load story. Make sure <code>/stories/{nameParam}.json</code>{" "}
          exists.
        </p>
      </div>
    );
  }

  const scene = story.pages.find((p) => p.id === currentPage) ?? story.pages[0];
  if (!scene) return null;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <motion.img
        width={1920}
        height={1080}
        src={scene.image}
        sizes="100vw"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 0.2 }}
      />
      <div className="absolute inset-0 bg-black/60">
        <div className="relative mx-auto max-w-2xl space-y-10 px-4 pb-16 pt-14 sm:px-6 lg:max-w-5xl lg:px-8">
          <span className="text-3xl font-bold mb-6 text-white flex flex-row items-center vhs-effect">
            {story.title} <Icon name="play" size={24} />
          </span>

          <div className="flex mb-6">
            <div className="w-full pl-6">
              <TextGenerateEffect
                key={`text-${nameParam}-${currentPage}`}
                duration={2}
                filter={false}
                words={scene.text}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center absolute bottom-12 w-full">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col justify-center items-center gap-2 mb-2"
            >
              {scene.options && scene.options.length > 0 ? (
                scene.options.map((choice, index) => (
                  <Button key={index} onClick={() => handleChoice(choice.next)}>
                    {choice.text}
                  </Button>
                ))
              ) : (
                <Button onClick={() => handleChoice(null)}>Finish</Button>
              )}
            </motion.div>
          </AnimatePresence>

          <Image
            width={80}
            height={80}
            src="/vercel.png"
            alt="avatar"
            className="rounded-full mt-6"
          />
        </div>
      </div>
    </div>
  );
}
