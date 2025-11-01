"use client";

import { Icon } from "@/components/icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TextGenerateEffect } from "@/components/textgen";
import useSound from "use-sound";
import Image from "next/image";

const pages = [
  { //0
    text: `Halloween night. You find the ancient gate afar. Beyond, Ravenshade Manor stands dark, a flicker of light in a window is seen. Your phone dies suddenly.`,
    image: "0.jpg",
    options: [
      { text: "Step through the gate", next: 1 },
      { text: "Circle around the house to the back", next: 2 },
      { text: "Call out into the darkness", next: 3 }
    ]
  },
  { //1
    text: `As you approach. Silence presses in. The air smells faintly of smoke and something old.`,
    image: "1.png",
    options: [
      { text: "Enter the foyer", next: 4 },
      { text: "Knock loudly on the door", next: 5 },
      { text: "Step back and wait", next: 6 }
    ]
  },
  { //2
    text: `Around back, moonlight reveals strange symbols carved into the walls. A faint noise comes from the basement door.`,
    image: "2.png",
    options: [
      { text: "Open the basement door", next: 7 },
      { text: "Circle back to front gate", next: 0 },
      { text: "Trace the symbols on the wall", next: 8 }
    ]
  },
  { //3
    text: `Your voice fades quickly. No answer, but faint footsteps echo from the woods nearby.`,
    image: "3.jpg",
    options: [
      { text: "Follow the footsteps", next: 9 },
      { text: "Run back to the gate", next: 1 },
      { text: "Hide behind a tree", next: 10 }
    ]
  },
  { //4
    text: `Inside, shadows cling to the walls. A faint melody plays from somewhere unseen, slow and haunting.`,
    image: "4.png",
    options: [
      { text: "Follow the melody", next: 11 },
      { text: "Search the dark hallway", next: 12 },
      { text: "Ascend the grand staircase", next: 13 }
    ]
  },
  { //5
    text: `Your knocking echoes, but no response.`,
    image: "5.jpg",
    options: [
      { text: "Try the side windows", next: 14 },
      { text: "Wait and listen carefully", next: 15 }
    ]
  },
  { //6
    text: `Waiting only deepens the silence. Suddenly your heart races as a whisper moves past your ear. unnoticeable  but sudden.`,
    image: "1.png",
    options: [
      { text: "Spin around and confront", next: 16 },
      { text: "Flee back through the gate", next: 17 }
    ]
  },
  { //7
    text: `The basement door creaks as it opens. Darkness covers everything; faint breathing noises from within.`,
    image: "7.webp",
    options: [
      { text: "Descend carefully", next: 18 },
      { text: "Shut the door and step away", next: 2 }
    ]
  },
  { //8
    text: `The symbols glow faintly under your touch. The ground trembles. The walls seem to pulse like a heartbeat.`,
    image: "8.jpg",
    options: [
      { text: "Step back quickly", next: 3 },
      { text: "Press deeper into the garden", next: 19 }
    ]
  },
  { //9
    text: `Following the footsteps leads to a clearing with a broken doll half-buried in leaves. A chill runs through your spine.`,
    image: "9.webp",
    options: [
      { text: "Pick up the doll", next: 20 },
      { text: "Run back to the gate", next: 1 }
    ]
  },
  { //10
    text: `You crouch as shadows dance in the moonlit forest. Eyes appear briefly, watching.`,
    image: "10.jpg",
    options: [
      { text: "Hold still and breathe softly", next: 21 },
      { text: "Sprint toward the house", next: 1 }
    ]
  },
  { //11
    text: `The melody draws you to an old piano. Keys press down themselves in a slow, chilling tune.`,
    image: "11.webp",
    options: [
      { text: "Play a key and wait", next: 22 },
      { text: "Step away quietly", next: 13 }
    ]
  },
  { //12
    text: `The hallway narrows, the walls moist and smelling of earth. Drops of water echo somewhere ahead.`,
    image: "12.jpg",
    options: [
      { text: "Keep walking forward", next: 23 },
      { text: "Go back to the foyer", next: 4 }
    ]
  },
  { //13
    text: `Upstairs, doors creak under a cold breath trembling the wood. You hear a child's laughter faintly.`,
    image: "13.jpg",
    options: [
      { text: "Find the source of laughter", next: 24 },
      { text: "Head to the attic door", next: 25 },
      { text: "Descend the stairs quickly", next: 4 }
    ]
  },
  { //14
    text: `Windows rattle, but none will open. The house settles with a low groan.`,
    image: "14.jpg",
    options: [
      { text: "Check for a cellar hatch", next: 7 },
      { text: "Circle back to door", next: 5 }
    ]
  },
  { //15
    text: `Listening carefully, you hear faint scratching from inside the walls.`,
    image: "5.jpg",
    options: [
      { text: "Knock on the wall", next: 26 },
      { text: "Step back slowly", next: 4 }
    ]
  },
  { //16
    text: `You whirl but see only empty air. Yet the hair on your neck rises as a cold hand brushes past.`,
    image: "16.jpg",
    options: [
      { text: "Run toward the gate", next: 17 },
      { text: "Stand frozen", next: 27 }
    ]
  },
  { //17
    text: `You escape the manor grounds, heart pounding. The gate slams shut behind you. You are safe, for now.`,
    image: "17.jpg",
    options: [
      { text: "RESTART", next: null }
    ]
  },
  { //18
    text: `The basement stairs creak under faint footsteps. Darkness nearly swallows you whole.`,
    image: "22.webp",
    options: [
      { text: "Keep going down", next: 34 },
      { text: "Flee back up", next: 2 }
    ]
  },
  { //19
    text: `The garden path twists, the air thickens. A distant bell tolls—somewhere beyond the trees.`,
    image: "2.png",
    options: [
      { text: "Follow the bell", next: 29 },
    ]
  },
  { //20
    text: `The doll’s button eyes seem to glint. Touching it makes faint giggling fill the air.`,
    image: "20.png",
    options: [
      { text: "Keep the doll", next: 30 },
      { text: "Throw the doll away", next: 3 }
    ]
  },
  { //21
    text: `You wait as the forest falls into silence. Then a distant scream shatters the calm.`,
    image: "10.jpg",
    options: [
      { text: "Run towards the scream", next: 'jumpscare' },
      { text: "Run to the manor", next: 1 }
    ]
  },
  { //22
    text: `Playing the key unlocks a hidden door behind the piano, revealing cold stairs going down.`,
    image: "22.webp",
    options: [
      { text: "Descend stairs", next: 28 },
      { text: "Leave the room", next: 4 }
    ]
  },
  { //23
    text: `The hallway opens into the servant’s quarters, empty but disturbed. A chair rocks slowly.`,
    image: "23.jpg",
    options: [
      { text: "Investigate the rocking chair", next: 33 },
      { text: "Return to hallway", next: 12 }
    ]
  },
  { //24
    text: `The laughter stops when you enter the room, replaced by a cold silence. The window blinds flutter, though no wind blows.`,
    image: "24.jpg",
    options: [
      { text: "Search the room", next: 2 },
      { text: "Flee downstairs", next: 4 }
    ]
  },
  { //25
    text: `The attic door creaks open meagerly to a frozen room filled with dust and cobwebs. Something moves in the corner.`,
    image: "25.jpg",
    options: [
      { text: "Approach the movement", next: 'jumpscare' },
      { text: "Leave the attic", next: 13 }
    ]
  },
  { //26
    text: `Knocking causes tapping in reply. A rhythm, slow and deliberate.`,
    image: "26.jpg",
    options: [
      { text: "Go back", next: 1 }
    ]
  },
  { //27
    text: `You whirl—but see only empty air. Yet the hair on your neck rises as a cold hand brushes past.`,
    image: "16.jpg",
    options: [
      { text: "Run toward the gate", next: 17 },
    ]
  },
  { //28
    text: `Frozen in place, you sense breath on your neck. Slowly, the unseen presence loosens its grip.`,
    image: "28.jpg",
    options: [
      { text: "Gather courage and explore other rooms", next: 4 },
      { text: "Run away", next: 17 }
    ]
  },
  { //29
    text: `The bell’s toll fades as you reach a graveyard where no one rests. A cold hand grips yours.`,
    image: "30.jpg",
    options: [
      { text: "Pull free and run", next: 17 },
      { text: "Accept your fate", next: 'jumpscare' }
    ]
  },
  { //30
    text: `With the doll in hand, you feel a shiver run down your spine.`,
    image: "31.jpg",
    options: [
      { text: "Stay and face whatever comes", next: 'jumpscare' },
      { text: "Drop the doll and run", next: 17 }
    ]
  },
  { //31
    text: `The rocking chair abruptly stops. A sudden gust slams the door shut behind you.`,
    image: "33.jpg",
    options: [
      { text: "Panic and try to open door", next: 'jumpscare' },
      { text: "Stand still and breathe", next: 34 }
    ]
  },
  { //32
    text: `The room feels colder. An old diary lies open on a dusty desk, its pages blank but for one word: 'RUN'.`,
    image: "34.jpg",
    options: [
      { text: "Grab the diary", next: 33 },
    ]
  },
  { //33
    text: `The tapping turns to frantic scratching. Suddenly, silence.`,
    image: "34.jpg",
    options: [
      { text: "Explore deeper", next: 4 },
      { text: "Exit quickly", next: 17 }
    ]
  },
  { //34
    text: `The basement door slowly opens to a cold room covered in dust and cobwebs. Something moves in the corner.`,
    image: "36.jpg",
    options: [
      { text: "Approach the movement", next: 'jumpscare' },
      { text: "Exit quickly", next: 2 }
    ]
  },
]

export default function Story() {
  const router = useRouter();
  const [play] = useSound("/background-music.mp3", { playbackRate: 0.75 });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    play();
  }, [play]);

  const handleChoice = (next: number | string | null) => {
    if (next === null) return router.push("/end");
    if (next === "jumpscare") return router.push("/jumpscare");

    const nextIndex = Number(next);
    if (isNaN(nextIndex) || !pages[nextIndex]) {
      router.push("/end");
    } else {
      setCurrentPage(nextIndex);
    }
  };

  const scene = pages[currentPage];
  if (!scene) return null;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <motion.img
        src={scene.image}
        alt="background"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.3 }}
      />

      <div className="absolute inset-0 bg-black/60 flex flex-col justify-between">
        <div className="relative mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:max-w-5xl lg:px-8">
          <h1 className="text-3xl font-bold mb-6 text-white flex items-center">
            Ravenshade Manor <Icon name="play" size={24} />
          </h1>

          <TextGenerateEffect
            key={`scene-${currentPage}`}
            duration={2}
            filter={false}
            words={scene.text}
          />
        </div>

        <div className="flex flex-col items-center justify-center mb-12 w-full">
          <AnimatePresence>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-3"
            >
              {scene.options.map((choice, i) => (
                <Button key={i} onClick={() => handleChoice(choice.next)}>
                  {choice.text}
                </Button>
              ))}
            </motion.div>
          </AnimatePresence>

          <Image
            src="/vercel.png"
            alt="avatar"
            width={80}
            height={80}
            className="mt-6 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
