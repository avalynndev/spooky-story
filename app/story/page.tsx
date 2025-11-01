"use client";

import { Icon } from "@/components/icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TextGenerateEffect } from "@/components/textgen";
import useSound from "use-sound";
import Image from "next/image";

interface Scene {
  background: string;
  text: string;
  choices: { text: string; nextScene: string }[];
}

interface StoryType {
  title: string;
  scenes: Record<string, Scene>;
}

const Story = () => {
  const router = useRouter();
  const playbackRate = 0.75;

  const [name] = useState("Hero");
  const [image] = useState("/avatar.png");
  const [currentScene, setCurrentScene] = useState<string>("intro");

  const story: StoryType = {
    title: "keerthi",
    scenes: {
      intro: {
        background: "/blurhouse.png",
        text: "cc",
        choices: [
          { text: "a", nextScene: "a" },
          { text: "v", nextScene: "a" },
        ],
      },
    },
  };

  const [play] = useSound("./background-music.mp3", { playbackRate });

  useEffect(() => {
    play();
  }, [play]);

  const handleChoice = (nextScene: string) => {
    if (nextScene === "end" || !story.scenes[nextScene]) {
      router.push("/end");
    } else {
      setCurrentScene(nextScene);
    }
  };

  const scene = story.scenes[currentScene];

  if (!scene) return null;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <motion.img
        width={1920}
        height={1080}
        src={scene.background}
        sizes="100vw"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.2 }}
      />
      <div className="absolute inset-0 bg-black opacity-50">
        <div className="relative mx-auto max-w-2xl space-y-10 px-4 pb-16 pt-14 sm:px-6 lg:max-w-5xl lg:px-8">
          <span className="text-3xl font-bold mb-6 text-white flex flex-row items-center vhs-effect">
            {story.title} <Icon name="play" size={24} />
          </span>

          <div className="flex mb-6">
            <div className="w-full pl-6">
              <TextGenerateEffect
                key={`text-${currentScene}`}
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
              {scene.choices.length > 0 ? (
                scene.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice.nextScene)}
                  >
                    {choice.text}
                  </Button>
                ))
              ) : (
                <Button onClick={() => handleChoice("end")}>Finish</Button>
              )}
            </motion.div>
          </AnimatePresence>

          <Image
            width={100}
            height={100}
            src={image}
            alt={`${name}'s avatar`}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Story;
