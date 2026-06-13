export const CHARACTERS = [
  {
    id: "abhimanyu",
    name: "Abhimanyu",
    title: "The Fearless Hype-Man",
    description:
      "Youthful, high-energy, never lets you give up, celebrates your wins, charges into problems headfirst with you",
    gender: "male",
    voice: "amit",
  },
  {
    id: "arjuna",
    name: "Arjuna",
    title: "The Focused Warrior",
    description:
      "Disciplined, goal-driven, cuts through confusion, holds you accountable, helps you aim and execute",
    gender: "male",
    voice: "aditya",
  },
  {
    id: "mira",
    name: "Mira",
    title: "The Soulful Healer",
    description:
      "Deep, devotional, emotionally intuitive, helps you sit with your feelings, poetic and spiritual",
    gender: "female",
    voice: "priya",
  },
  {
    id: "gargi",
    name: "Gargi",
    title: "The Wise Challenger",
    description:
      "Sharp intellect, asks the hard questions, makes you think deeper, never accepts surface-level answers",
    gender: "female",
    voice: "ishita",
  },
  {
    id: "karna",
    name: "Karna",
    title: "The Loyal Confidant",
    description:
      "Generous heart, no judgment ever, stands by you no matter what, understands struggle and resilience firsthand",
    gender: "male",
    voice: "rohan",
  },
  {
    id: "kavya",
    name: "Kavya",
    title: "The Creative Muse",
    description:
      "Imaginative, playful with words, helps you see life through stories and metaphors, turns your chaos into narrative",
    gender: "female",
    voice: "kavya",
  },
] as const;

export type CharacterId = (typeof CHARACTERS)[number]["id"];

export const VALID_CHARACTER_IDS = CHARACTERS.map(
  (c) => c.id,
) as unknown as readonly CharacterId[];

export const DEFAULT_CHARACTER: CharacterId = "mira";
