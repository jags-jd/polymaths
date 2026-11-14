import type { PixelArt } from "@/components/icons/pixel/PixelIcon";

/**
 * Super Mario World icon set — original pixel art (license "original").
 * Converted from the mockup (docs/design/source/super-mario-world.dc.html);
 * see the table in docs/themes.md. Each icon has an outline (not done) and a
 * filled (done) state.
 */

const OUTLINE = "#8C7A4A";
const OUTLINE_HINT = "#C9B88A";
const NAVY = "#1B1F4A";

export type SmwIconPair = { outline: PixelArt; filled: PixelArt };

/** Rounded tile shared by the exit and castle icons (outline state). */
const tileOutline = (inner: string[]): PixelArt => ({
  map: ["..############..", ".#............#.", "#..............#", "#..............#", ...inner, "#..............#", "#..............#", ".#............#.", "..############.."],
  palette: { "#": OUTLINE, o: OUTLINE_HINT },
});

const EXIT: SmwIconPair = {
  outline: tileOutline(["#..oo......oo..#", "#..ooo....ooo..#", "#..oooo..oooo..#", "#..oo.oooo.oo..#", "#..oo..oo..oo..#", "#..oo......oo..#", "#..oo......oo..#", "#..oo......oo..#"]),
  filled: {
    map: ["..llllllllllll..", ".loooooooooohhl.", "lo############hl", "lo############hl", "lo#dd######dd#hl", "lo#ddd####dddshl", "lo#dddd##ddddshl", "lo#ddsddddsddshl", "lo#dds#ddssddshl", "lo#dds##ss#ddshl", "lo#dds#####ddshl", "lo#dds#####ddshl", "lh##ss######sshl", "lh############hl", ".lhhhhhhhhhhhhl.", "..llllllllllll.."],
    palette: { "#": "#E0302A", o: "#FF8A7E", h: "#A4161A", s: "#7A0E12", d: "#FFFFFF", l: NAVY },
  },
};

const CASTLE: SmwIconPair = {
  outline: tileOutline(["#..o.o.oo.o.o..#", "#..oooooooooo..#", "#..oo.oooo.oo..#", "#..oo.oooo.oo..#", "#..oooooooooo..#", "#..oooo..oooo..#", "#..ooo....ooo..#", "#..ooo....ooo..#"]),
  filled: {
    map: ["..llllllllllll..", ".loooooooooohhl.", "lo############hl", "lo############hl", "lo#d#d#dd#d#d#hl", "lo#ddddddddddshl", "lo#ddsddddsddshl", "lo#ddsddddsddshl", "lo#ddddddddddshl", "lo#ddddssddddshl", "lo#dddss##dddshl", "lo#ddds###dddshl", "lh##sss####ssshl", "lh############hl", ".lhhhhhhhhhhhhl.", "..llllllllllll.."],
    palette: { "#": "#6A35A8", o: "#A47BE0", h: "#43207A", s: "#2E1458", d: "#FFFFFF", l: NAVY },
  },
};

const KEY: SmwIconPair = {
  outline: {
    map: ["................", "..####..........", ".#....#.........", "#......#........", "#..##..#........", "#.#..#.#........", "#.#..#.########.", "#.#..#.........#", "#.#..#.........#", "#.#..#.........#", "#.#..#.####...#.", "#..##..#..#...#.", "#......#..#..#..", ".#....#...####..", "..####..........", "................"],
    palette: { "#": OUTLINE },
  },
  filled: {
    map: ["................", "..dddd..........", ".doo##d.........", "doo####d........", "do#dd#hd........", "dodssdhd........", "dodssdhdddddddd.", "dodssd#ooooooood", "d#dssd#########d", "d#dssdhhhhhhhhhd", "d#dssdhddddhhhd.", "d#hddhhd..dhhhd.", "d##hhhhd..dhhd..", ".dhhhhd...dddd..", "..dddd..........", "................"],
    palette: { "#": "#FFC81E", o: "#FFF09A", h: "#D68A00", s: "#FFFBEA", d: NAVY },
  },
};

const DRAGON_COIN: SmwIconPair = {
  outline: {
    map: ["....####....", "...#....#...", "..#..oo..#..", ".#..o..o..#.", ".#.o....o.#.", "#..o....o..#", "#..o....o..#", "#.o......o.#", "#.o......o.#", "#..o....o..#", "#..o....o..#", ".#.o....o.#.", ".#..o..o..#.", "..#..oo..#..", "...#....#...", "....####...."],
    palette: { "#": OUTLINE, o: OUTLINE_HINT },
  },
  filled: {
    map: ["....dddd....", "...doo#hd...", "..do#ss#hd..", ".do#s##s#hd.", ".dos####shd.", "do#s#oh#s#hd", "do#s#oh#s#hd", "dos##oh.#shd", "dos##oh##shd", "do#s#oh#s#hd", "do#s#oh.s#hd", ".dos####shd.", ".do#s##s#hd.", "..do#ss#hd..", "...do#hhd...", "....dddd...."],
    palette: { "#": "#FFD21A", o: "#FFF6B0", h: "#F08A00", s: "#E0A000", d: NAVY },
  },
};

const MOON: SmwIconPair = {
  outline: {
    map: [".......##.......", ".......#.###....", ".......#....#...", "........#....#..", "........#.....#.", ".......#..o.o.#.", ".......#..o.o.#.", ".......#.......#", "......#........#", "....##.....o..#.", ".###.o....o...#.", ".#....oooo....#.", "..#..........#..", "...#........#...", "....###..###....", ".......##......."],
    palette: { "#": OUTLINE, o: OUTLINE_HINT },
  },
  filled: {
    map: [".......hh.......", ".......hohhh....", ".......ho###h...", "........ho###h..", "........ho####h.", ".......ho#h#h#h.", ".......ho#h#h#h.", ".......ho######h", "......h########h", "....hh#####h##h.", ".hhh#h####h###h.", ".h####hhhh####h.", "..h##########h..", "...h########h...", "....hhh##hhh....", ".......hh......."],
    palette: { "#": "#FFD21A", o: "#FFF2A8", h: NAVY },
  },
};

const SWITCH_OUTLINE: PixelArt = {
  map: ["....########....", "..##...##...##..", ".#....#..#....#.", "#.....#..#.....#", "#.....#..#.....#", "#.....#..#.....#", "#.....#..#.....#", "#......##......#", "#.....#..#.....#", "#......##......#", "################", "#..............#", "#..............#", "#..............#", "################", "................"],
  palette: { "#": OUTLINE },
};

const SWITCH_FILLED_MAP = ["....dddddddd....", "..ddcccddcccdd..", ".dccccd##dccccd.", "dcccccd##dcccccd", "dcccccd##dcccccd", "dcccccd##dcccccd", "dcccccd##dcccccd", "dccccccddccccccd", "dcccccd##dcccccd", "dccccccddccccccd", "dddddddddddddddd", "dsoooh#hooooossd", "dsoooh#hooooossd", "dsoooh#hooooossd", "dddddddddddddddd", "................"];

const switchIcon = (color: string): SmwIconPair => ({
  outline: SWITCH_OUTLINE,
  filled: {
    map: SWITCH_FILLED_MAP,
    palette: { c: color, "#": "#FFFFFF", o: "#D49A2A", h: "#F2C55C", s: "#8A5A10", d: NAVY },
  },
});

/**
 * Bowser's castle door — new for Polymaths (the mockup only had placeholder
 * squares): an arched wooden door with a gold knob in a stone frame.
 */
const BOWSER_DOOR_MAP = ["....llllllll....", "..llssssssssll..", ".lsssddddddsssl.", ".lssddwwwwddssl.", "lssdwwwwwwwwdssl", "lssdwwwwwwwwdssl", "lsdwwwwddwwwwdsl", "lsdwwwwddwwwwdsl", "lsdwwwwddwwwwdsl", "lsdwwwwddwwkwdsl", "lsdwwwwddwwwwdsl", "lsdwwwwddwwwwdsl", "lsdwwwwddwwwwdsl", "lsdwwwwddwwwwdsl", "lsddddddddddddsl", "llllllllllllllll"];

const BOWSER_DOOR: SmwIconPair = {
  outline: {
    // Outer frame and door outline only, with the knob as a faint hint.
    map: BOWSER_DOOR_MAP.map((row) => row.replace(/[ld]/g, "#").replace(/[sw]/g, ".").replace(/k/g, "o")),
    palette: { "#": OUTLINE, o: OUTLINE_HINT },
  },
  filled: {
    map: BOWSER_DOOR_MAP,
    palette: { l: NAVY, s: "#6B6F87", d: "#5A2A0A", w: "#B4532A", k: "#FFD21A" },
  },
};

/** Icon keys used by trackables in data/games/super-mario-world. */
export const SMW_ICONS = {
  exit: EXIT,
  key: KEY,
  castle: CASTLE,
  "dragon-coin": DRAGON_COIN,
  moon: MOON,
  "switch-yellow": switchIcon("#FFD21A"),
  "switch-green": switchIcon("#2EBF4A"),
  "switch-red": switchIcon("#E5245E"),
  "switch-blue": switchIcon("#5A6FD8"),
  "bowser-door": BOWSER_DOOR,
} as const satisfies Record<string, SmwIconPair>;

export type SmwIconKey = keyof typeof SMW_ICONS;

export function isSmwIconKey(key: string): key is SmwIconKey {
  return Object.hasOwn(SMW_ICONS, key);
}
