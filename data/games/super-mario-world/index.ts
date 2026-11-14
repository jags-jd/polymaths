import type { Game } from "@/lib/games/schema";

/**
 * Super Mario World (SNES, 1990): the original release, not the GBA remake.
 * Sources, counts per world, single-source items and open questions are in
 * docs/games/super-mario-world.md. IDs are permanent: never rename or reuse.
 */
const game = {
  slug: "super-mario-world",
  title: "Super Mario World",
  idPrefix: "smw-",
  publisher: "Nintendo",
  platforms: ["SNES", "Nintendo Switch Online"],
  theme: "nintendo",
  skin: "smw-save-file",
  sections: [
    {
      id: "smw-yoshis-island",
      title: "Yoshi's Island",
      label: "World 1",
      layout: "rows",
      entries: [
        {
          id: "smw-yoshis-island-1",
          name: "Yoshi's Island 1",
          kind: "course",
          trackables: [
            { id: "smw-yoshis-island-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-yoshis-island-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
            { id: "smw-yoshis-island-1-moon", kind: "check", label: "3-Up Moon", icon: "moon" },
          ],
        },
        {
          id: "smw-yellow-switch-palace",
          name: "Yellow Switch Palace",
          kind: "switch-palace",
          trackables: [
            { id: "smw-yellow-switch-palace-exit", kind: "check", label: "Press the yellow switch", icon: "switch-yellow" },
          ],
        },
        {
          id: "smw-yoshis-island-2",
          name: "Yoshi's Island 2",
          kind: "course",
          trackables: [
            { id: "smw-yoshis-island-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-yoshis-island-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-yoshis-island-3",
          name: "Yoshi's Island 3",
          kind: "course",
          trackables: [
            { id: "smw-yoshis-island-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-yoshis-island-3-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-yoshis-island-4",
          name: "Yoshi's Island 4",
          kind: "course",
          trackables: [
            { id: "smw-yoshis-island-4-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-yoshis-island-4-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-iggys-castle",
          name: "#1 Iggy's Castle",
          kind: "castle",
          trackables: [
            { id: "smw-iggys-castle-exit", kind: "check", label: "Beat Iggy", icon: "castle" },
          ],
        },
      ],
    },
    {
      id: "smw-donut-plains",
      title: "Donut Plains",
      label: "World 2",
      layout: "rows",
      entries: [
        {
          id: "smw-donut-plains-1",
          name: "Donut Plains 1",
          kind: "course",
          trackables: [
            { id: "smw-donut-plains-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-plains-1-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-donut-plains-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-donut-plains-2",
          name: "Donut Plains 2",
          kind: "course",
          trackables: [
            { id: "smw-donut-plains-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-plains-2-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-donut-plains-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-green-switch-palace",
          name: "Green Switch Palace",
          kind: "switch-palace",
          trackables: [
            { id: "smw-green-switch-palace-exit", kind: "check", label: "Press the green switch", icon: "switch-green" },
          ],
        },
        {
          id: "smw-donut-ghost-house",
          name: "Donut Ghost House",
          kind: "ghost-house",
          trackables: [
            { id: "smw-donut-ghost-house-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-ghost-house-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-donut-secret-1",
          name: "Donut Secret 1",
          kind: "course",
          trackables: [
            { id: "smw-donut-secret-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-secret-1-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-donut-secret-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 6 },
          ],
        },
        {
          id: "smw-donut-secret-house",
          name: "Donut Secret House",
          kind: "ghost-house",
          trackables: [
            { id: "smw-donut-secret-house-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-secret-house-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-donut-secret-2",
          name: "Donut Secret 2",
          kind: "course",
          trackables: [
            { id: "smw-donut-secret-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-secret-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-donut-plains-3",
          name: "Donut Plains 3",
          kind: "course",
          trackables: [
            { id: "smw-donut-plains-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-plains-3-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-donut-plains-4",
          name: "Donut Plains 4",
          kind: "course",
          trackables: [
            { id: "smw-donut-plains-4-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-donut-plains-4-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
            { id: "smw-donut-plains-4-moon", kind: "check", label: "3-Up Moon", icon: "moon" },
          ],
        },
        {
          id: "smw-mortons-castle",
          name: "#2 Morton's Castle",
          kind: "castle",
          trackables: [
            { id: "smw-mortons-castle-exit", kind: "check", label: "Beat Morton", icon: "castle" },
          ],
        },
      ],
    },
    {
      id: "smw-vanilla-dome",
      title: "Vanilla Dome",
      label: "World 3",
      layout: "rows",
      entries: [
        {
          id: "smw-vanilla-dome-1",
          name: "Vanilla Dome 1",
          kind: "course",
          trackables: [
            { id: "smw-vanilla-dome-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-dome-1-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-vanilla-dome-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-vanilla-secret-1",
          name: "Vanilla Secret 1",
          kind: "course",
          trackables: [
            { id: "smw-vanilla-secret-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-secret-1-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-vanilla-secret-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-vanilla-dome-2",
          name: "Vanilla Dome 2",
          kind: "course",
          trackables: [
            { id: "smw-vanilla-dome-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-dome-2-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-vanilla-dome-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-red-switch-palace",
          name: "Red Switch Palace",
          kind: "switch-palace",
          trackables: [
            { id: "smw-red-switch-palace-exit", kind: "check", label: "Press the red switch", icon: "switch-red" },
          ],
        },
        {
          id: "smw-vanilla-ghost-house",
          name: "Vanilla Ghost House",
          kind: "ghost-house",
          trackables: [
            { id: "smw-vanilla-ghost-house-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-ghost-house-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-vanilla-dome-3",
          name: "Vanilla Dome 3",
          kind: "course",
          trackables: [
            { id: "smw-vanilla-dome-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-dome-3-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 6 },
            { id: "smw-vanilla-dome-3-moon", kind: "check", label: "3-Up Moon", icon: "moon" },
          ],
        },
        {
          id: "smw-vanilla-dome-4",
          name: "Vanilla Dome 4",
          kind: "course",
          trackables: [
            { id: "smw-vanilla-dome-4-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-dome-4-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-vanilla-secret-2",
          name: "Vanilla Secret 2",
          kind: "course",
          trackables: [
            { id: "smw-vanilla-secret-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-secret-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-vanilla-secret-3",
          name: "Vanilla Secret 3",
          kind: "course",
          trackables: [
            { id: "smw-vanilla-secret-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-vanilla-secret-3-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-vanilla-fortress",
          name: "Vanilla Fortress",
          kind: "fortress",
          trackables: [
            { id: "smw-vanilla-fortress-exit", kind: "check", label: "Beat Reznor", icon: "castle" },
          ],
        },
        {
          id: "smw-lemmys-castle",
          name: "#3 Lemmy's Castle",
          kind: "castle",
          trackables: [
            { id: "smw-lemmys-castle-exit", kind: "check", label: "Beat Lemmy", icon: "castle" },
          ],
        },
      ],
    },
    {
      id: "smw-twin-bridges",
      title: "Twin Bridges",
      label: "World 4",
      layout: "rows",
      entries: [
        {
          id: "smw-cheese-bridge-area",
          name: "Cheese Bridge Area",
          kind: "course",
          trackables: [
            { id: "smw-cheese-bridge-area-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-cheese-bridge-area-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-cheese-bridge-area-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
            { id: "smw-cheese-bridge-area-moon", kind: "check", label: "3-Up Moon", icon: "moon" },
          ],
        },
        {
          id: "smw-soda-lake",
          name: "Soda Lake",
          kind: "course",
          trackables: [
            { id: "smw-soda-lake-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-soda-lake-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-cookie-mountain",
          name: "Cookie Mountain",
          kind: "course",
          trackables: [
            { id: "smw-cookie-mountain-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-cookie-mountain-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-butter-bridge-1",
          name: "Butter Bridge 1",
          kind: "course",
          trackables: [
            { id: "smw-butter-bridge-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-butter-bridge-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-butter-bridge-2",
          name: "Butter Bridge 2",
          kind: "course",
          trackables: [
            { id: "smw-butter-bridge-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-butter-bridge-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-ludwigs-castle",
          name: "#4 Ludwig's Castle",
          kind: "castle",
          trackables: [
            { id: "smw-ludwigs-castle-exit", kind: "check", label: "Beat Ludwig", icon: "castle" },
          ],
        },
      ],
    },
    {
      id: "smw-forest-of-illusion",
      title: "Forest of Illusion",
      label: "World 5",
      layout: "rows",
      entries: [
        {
          id: "smw-forest-of-illusion-1",
          name: "Forest of Illusion 1",
          kind: "course",
          trackables: [
            { id: "smw-forest-of-illusion-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-forest-of-illusion-1-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-forest-of-illusion-2",
          name: "Forest of Illusion 2",
          kind: "course",
          trackables: [
            { id: "smw-forest-of-illusion-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-forest-of-illusion-2-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-forest-of-illusion-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-blue-switch-palace",
          name: "Blue Switch Palace",
          kind: "switch-palace",
          trackables: [
            { id: "smw-blue-switch-palace-exit", kind: "check", label: "Press the blue switch", icon: "switch-blue" },
          ],
        },
        {
          id: "smw-forest-of-illusion-3",
          name: "Forest of Illusion 3",
          kind: "course",
          trackables: [
            { id: "smw-forest-of-illusion-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-forest-of-illusion-3-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-forest-of-illusion-3-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-forest-ghost-house",
          name: "Forest Ghost House",
          kind: "ghost-house",
          trackables: [
            { id: "smw-forest-ghost-house-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-forest-ghost-house-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-forest-ghost-house-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
            { id: "smw-forest-ghost-house-moon", kind: "check", label: "3-Up Moon", icon: "moon" },
          ],
        },
        {
          id: "smw-forest-of-illusion-4",
          name: "Forest of Illusion 4",
          kind: "course",
          trackables: [
            { id: "smw-forest-of-illusion-4-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-forest-of-illusion-4-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-forest-of-illusion-4-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-forest-secret-area",
          name: "Forest Secret Area",
          kind: "course",
          trackables: [
            { id: "smw-forest-secret-area-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-forest-secret-area-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-forest-fortress",
          name: "Forest Fortress",
          kind: "fortress",
          trackables: [
            { id: "smw-forest-fortress-exit", kind: "check", label: "Beat Reznor", icon: "castle" },
          ],
        },
        {
          id: "smw-roys-castle",
          name: "#5 Roy's Castle",
          kind: "castle",
          trackables: [
            { id: "smw-roys-castle-exit", kind: "check", label: "Beat Roy", icon: "castle" },
            { id: "smw-roys-castle-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
      ],
    },
    {
      id: "smw-chocolate-island",
      title: "Chocolate Island",
      label: "World 6",
      layout: "rows",
      entries: [
        {
          id: "smw-chocolate-island-1",
          name: "Chocolate Island 1",
          kind: "course",
          trackables: [
            { id: "smw-chocolate-island-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-chocolate-island-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
            { id: "smw-chocolate-island-1-moon", kind: "check", label: "3-Up Moon", icon: "moon" },
          ],
        },
        {
          id: "smw-choco-ghost-house",
          name: "Choco-Ghost House",
          kind: "ghost-house",
          trackables: [
            { id: "smw-choco-ghost-house-exit", kind: "check", label: "Normal exit", icon: "exit" },
          ],
        },
        {
          id: "smw-chocolate-island-2",
          name: "Chocolate Island 2",
          kind: "course",
          trackables: [
            { id: "smw-chocolate-island-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-chocolate-island-2-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-chocolate-island-2-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-chocolate-secret",
          name: "Chocolate Secret",
          kind: "course",
          trackables: [
            { id: "smw-chocolate-secret-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-chocolate-secret-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 1, singlePip: true },
          ],
        },
        {
          id: "smw-chocolate-island-3",
          name: "Chocolate Island 3",
          kind: "course",
          trackables: [
            { id: "smw-chocolate-island-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-chocolate-island-3-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-chocolate-island-3-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-chocolate-fortress",
          name: "Chocolate Fortress",
          kind: "fortress",
          trackables: [
            { id: "smw-chocolate-fortress-exit", kind: "check", label: "Beat Reznor", icon: "castle" },
          ],
        },
        {
          id: "smw-chocolate-island-4",
          name: "Chocolate Island 4",
          kind: "course",
          trackables: [
            { id: "smw-chocolate-island-4-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-chocolate-island-4-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-chocolate-island-5",
          name: "Chocolate Island 5",
          kind: "course",
          trackables: [
            { id: "smw-chocolate-island-5-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-chocolate-island-5-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 7 },
          ],
        },
        {
          id: "smw-wendys-castle",
          name: "#6 Wendy's Castle",
          kind: "castle",
          trackables: [
            { id: "smw-wendys-castle-exit", kind: "check", label: "Beat Wendy", icon: "castle" },
          ],
        },
      ],
    },
    {
      id: "smw-valley-of-bowser",
      title: "Valley of Bowser",
      label: "World 7",
      layout: "rows",
      entries: [
        {
          id: "smw-sunken-ghost-ship",
          name: "Sunken Ghost Ship",
          kind: "ghost-ship",
          trackables: [
            { id: "smw-sunken-ghost-ship-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-sunken-ghost-ship-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-valley-of-bowser-1",
          name: "Valley of Bowser 1",
          kind: "course",
          trackables: [
            { id: "smw-valley-of-bowser-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-valley-of-bowser-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
            { id: "smw-valley-of-bowser-1-moon", kind: "check", label: "3-Up Moon", icon: "moon" },
          ],
        },
        {
          id: "smw-valley-of-bowser-2",
          name: "Valley of Bowser 2",
          kind: "course",
          trackables: [
            { id: "smw-valley-of-bowser-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-valley-of-bowser-2-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-valley-ghost-house",
          name: "Valley Ghost House",
          kind: "ghost-house",
          trackables: [
            { id: "smw-valley-ghost-house-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-valley-ghost-house-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-valley-ghost-house-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 6 },
          ],
        },
        {
          id: "smw-valley-of-bowser-3",
          name: "Valley of Bowser 3",
          kind: "course",
          trackables: [
            { id: "smw-valley-of-bowser-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-valley-of-bowser-3-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-valley-of-bowser-4",
          name: "Valley of Bowser 4",
          kind: "course",
          trackables: [
            { id: "smw-valley-of-bowser-4-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-valley-of-bowser-4-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-valley-fortress",
          name: "Valley Fortress",
          kind: "fortress",
          trackables: [
            { id: "smw-valley-fortress-exit", kind: "check", label: "Beat Reznor", icon: "castle" },
          ],
        },
        {
          id: "smw-larrys-castle",
          name: "#7 Larry's Castle",
          kind: "castle",
          trackables: [
            { id: "smw-larrys-castle-exit", kind: "check", label: "Beat Larry", icon: "castle" },
            { id: "smw-larrys-castle-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-bowsers-castle",
          name: "Bowser's Castle",
          kind: "bowser",
          trackables: [
            { id: "smw-bowsers-castle-front-door", kind: "check", label: "Beat Bowser (Front Door)", icon: "bowser-door" },
            { id: "smw-bowsers-castle-back-door", kind: "check", label: "Beat Bowser (Back Door)", icon: "bowser-door" },
          ],
        },
      ],
    },
    {
      id: "smw-star-world",
      title: "Star World",
      label: "Star Road",
      layout: "rows",
      entries: [
        {
          id: "smw-star-world-1",
          name: "Star World 1",
          kind: "course",
          trackables: [
            { id: "smw-star-world-1-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-star-world-1-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
            { id: "smw-star-world-1-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-star-world-2",
          name: "Star World 2",
          kind: "course",
          trackables: [
            { id: "smw-star-world-2-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-star-world-2-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-star-world-3",
          name: "Star World 3",
          kind: "course",
          trackables: [
            { id: "smw-star-world-3-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-star-world-3-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-star-world-4",
          name: "Star World 4",
          kind: "course",
          trackables: [
            { id: "smw-star-world-4-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-star-world-4-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
        {
          id: "smw-star-world-5",
          name: "Star World 5",
          kind: "course",
          trackables: [
            { id: "smw-star-world-5-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-star-world-5-secret-exit", kind: "check", label: "Secret exit", icon: "key" },
          ],
        },
      ],
    },
    {
      id: "smw-special-zone",
      title: "Special Zone",
      label: "Bonus",
      layout: "rows",
      entries: [
        {
          id: "smw-gnarly",
          name: "Gnarly",
          kind: "course",
          trackables: [
            { id: "smw-gnarly-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-gnarly-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-tubular",
          name: "Tubular",
          kind: "course",
          trackables: [
            { id: "smw-tubular-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-tubular-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 6 },
          ],
        },
        {
          id: "smw-way-cool",
          name: "Way Cool",
          kind: "course",
          trackables: [
            { id: "smw-way-cool-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-way-cool-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 8 },
          ],
        },
        {
          id: "smw-awesome",
          name: "Awesome",
          kind: "course",
          trackables: [
            { id: "smw-awesome-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-awesome-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-groovy",
          name: "Groovy",
          kind: "course",
          trackables: [
            { id: "smw-groovy-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-groovy-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-mondo",
          name: "Mondo",
          kind: "course",
          trackables: [
            { id: "smw-mondo-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-mondo-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-outrageous",
          name: "Outrageous",
          kind: "course",
          trackables: [
            { id: "smw-outrageous-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-outrageous-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
        {
          id: "smw-funky",
          name: "Funky",
          kind: "course",
          trackables: [
            { id: "smw-funky-exit", kind: "check", label: "Normal exit", icon: "exit" },
            { id: "smw-funky-dragon-coins", kind: "pips", label: "Dragon Coins", icon: "dragon-coin", count: 5 },
          ],
        },
      ],
    },
  ],
  goals: [
    { id: "smw-goal-96-exits", name: "Find all 96 exits", kind: "goal", trackables: [{ id: "smw-goal-96-exits-done", kind: "check", label: "Find all 96 exits", icon: "star" }] },
    { id: "smw-goal-all-switches", name: "Press all four switches", kind: "goal", trackables: [{ id: "smw-goal-all-switches-done", kind: "check", label: "Press all four switches", icon: "star" }] },
    { id: "smw-goal-special-zone", name: "Clear the Special Zone", kind: "goal", trackables: [{ id: "smw-goal-special-zone-done", kind: "check", label: "Clear the Special Zone", icon: "star" }] },
  ],
  stats: [
    { label: "Exits", match: { idSuffix: "-exit" }, count: "completed" },
    { label: "Dragon Coins", match: { trackableKind: "pips" }, count: "units" },
    { label: "Coin sets", match: { trackableKind: "pips" }, count: "completed" },
    { label: "3-Up Moons", match: { icon: "moon" }, count: "completed" },
    // The castle exit only: Roy's and Larry's castles also have Dragon Coins.
    { label: "Koopalings", match: { entryKind: "castle", idSuffix: "-exit" }, count: "completed" },
    { label: "Worlds", match: { section: true }, count: "completed" },
  ],
} satisfies Game;

export default game;
