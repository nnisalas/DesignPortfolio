export const PAL = { blue: "#5fa8e0", green: "#b6d24a", orange: "#ec5a2e", pink: "#ec5a9c", yellow: "#f0c63a" };

export const BP: Record<"A" | "B" | "C", string[][]> = {
  A: [
    ["  .  "],
    [" ___ ", " |o| ", " |_| "],
    [" ___ ", " |o| ", " |o| ", " |_| "],
    ["  !  ", " ___ ", " |o| ", " |o| ", " |o| ", " |_| "],
  ],
  B: [
    ["   .   "],
    [" _____ ", " |o o| ", " |   | ", " |___| "],
    [" _____ ", " |o o| ", " |o o| ", " |   | ", " |o o| ", " |___| "],
    ["   !   ", "  _|_  ", " |o o| ", " |o o| ", " |o o| ", " |o o| ", " |___| "],
  ],
  C: [
    ["    .    "],
    [" _______ ", " |o   o| ", " |_____| "],
    [" _______ ", " |o o o| ", " |     | ", " |_____| "],
    ["  __!__  ", " _______ ", " |o o o| ", " |o o o| ", " |_____| "],
  ],
};

export const BP_BOX: Record<"A" | "B" | "C", string[][]> = {
  A: [
    ["  .  "],
    [" |≡| ", " |─| ", " |≡| "],
    [" |≡| ", " |─| ", " |≡| ", " |─| ", " |≡| "],
    ["  !  ", " |≡| ", " |─| ", " |≡| ", " |─| ", " |≡| ", " |≡| "],
  ],
  B: [
    ["   .   "],
    ["|[] []|", "|[] []|", "|[] []|"],
    ["|[] []|", "|[] []|", "|[] []|", "|[] []|", "|[] []|"],
    ["   !   ", "|[] []|", "|[] []|", "|[] []|", "|[] []|", "|[] []|", "|[] []|"],
  ],
  C: [
    ["  .  "],
    ["|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|"],
    ["|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|"],
    ["  !  ", "|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|", "|⊞⊞⊞|"],
  ],
};

export type Building = { id: string; left: number; bottom: number; bp: "A" | "B" | "C"; c: string; fs: number; s0: number };

export const CITY: Building[] = [
  { id: "b0", left: 4, bottom: 4, bp: "B", c: PAL.blue, fs: 20, s0: 1 },
  { id: "b1", left: 11, bottom: 7, bp: "A", c: PAL.green, fs: 15, s0: 0 },
  { id: "b2", left: 17, bottom: 3, bp: "C", c: PAL.orange, fs: 18, s0: 2 },
  { id: "b3", left: 24, bottom: 8, bp: "A", c: PAL.yellow, fs: 14, s0: 1 },
  { id: "b4", left: 31, bottom: 4, bp: "B", c: PAL.pink, fs: 21, s0: 0 },
  { id: "b5", left: 39, bottom: 6, bp: "A", c: PAL.blue, fs: 15, s0: 1 },
  { id: "b6", left: 46, bottom: 3, bp: "C", c: PAL.green, fs: 19, s0: 1 },
  { id: "b7", left: 54, bottom: 9, bp: "B", c: PAL.orange, fs: 14, s0: 0 },
  { id: "b8", left: 61, bottom: 4, bp: "A", c: PAL.pink, fs: 17, s0: 2 },
  { id: "b9", left: 69, bottom: 3, bp: "B", c: PAL.yellow, fs: 20, s0: 1 },
  { id: "b10", left: 80, bottom: 5, bp: "C", c: PAL.blue, fs: 16, s0: 0 },
  { id: "b11", left: 88, bottom: 4, bp: "A", c: PAL.green, fs: 18, s0: 1 },
  { id: "b12", left: 95, bottom: 7, bp: "B", c: PAL.orange, fs: 15, s0: 1 },
  { id: "b13", left: 7, bottom: 26, bp: "A", c: PAL.pink, fs: 13, s0: 0 },
  { id: "b14", left: 15, bottom: 31, bp: "C", c: PAL.blue, fs: 12, s0: 1 },
  { id: "b15", left: 23, bottom: 28, bp: "A", c: PAL.yellow, fs: 12, s0: 0 },
  { id: "b16", left: 34, bottom: 34, bp: "B", c: PAL.green, fs: 13, s0: 1 },
  { id: "b17", left: 43, bottom: 29, bp: "A", c: PAL.orange, fs: 12, s0: 0 },
  { id: "b18", left: 52, bottom: 33, bp: "C", c: PAL.pink, fs: 13, s0: 1 },
  { id: "b19", left: 60, bottom: 27, bp: "A", c: PAL.blue, fs: 12, s0: 0 },
  { id: "b20", left: 68, bottom: 32, bp: "B", c: PAL.yellow, fs: 13, s0: 1 },
  { id: "b21", left: 77, bottom: 29, bp: "A", c: PAL.green, fs: 12, s0: 0 },
  { id: "b22", left: 86, bottom: 34, bp: "C", c: PAL.orange, fs: 12, s0: 1 },
  { id: "b23", left: 5, bottom: 48, bp: "A", c: PAL.blue, fs: 10, s0: 0 },
  { id: "b24", left: 13, bottom: 54, bp: "A", c: PAL.green, fs: 9, s0: 0 },
  { id: "b25", left: 21, bottom: 50, bp: "C", c: PAL.yellow, fs: 9, s0: 1 },
  { id: "b26", left: 30, bottom: 57, bp: "A", c: PAL.pink, fs: 10, s0: 0 },
  { id: "b27", left: 38, bottom: 49, bp: "A", c: PAL.blue, fs: 9, s0: 0 },
  { id: "b28", left: 47, bottom: 55, bp: "B", c: PAL.green, fs: 10, s0: 1 },
  { id: "b29", left: 56, bottom: 51, bp: "A", c: PAL.orange, fs: 9, s0: 0 },
  { id: "b30", left: 64, bottom: 58, bp: "A", c: PAL.yellow, fs: 9, s0: 0 },
  { id: "b31", left: 72, bottom: 50, bp: "C", c: PAL.blue, fs: 10, s0: 1 },
  { id: "b32", left: 81, bottom: 56, bp: "A", c: PAL.pink, fs: 9, s0: 0 },
  { id: "b33", left: 90, bottom: 52, bp: "A", c: PAL.green, fs: 10, s0: 0 },
  { id: "b34", left: 96, bottom: 60, bp: "A", c: PAL.orange, fs: 9, s0: 0 },
];

export type Cloud = { id: string; left: number; top: number; fs: number; dur: number; delay: number; c: string; art: string[] };

export const CLOUDS: Cloud[] = [
  { id: "cl0", left: 9, top: 49, fs: 12, dur: 13, delay: 0, c: "rgba(74,80,90,.62)", art: ["   .--.", ".-(    ).", "(___.__)__)"] },
  { id: "cl1", left: 58, top: 47, fs: 11, dur: 17, delay: 2.5, c: "rgba(74,80,90,.56)", art: ["  .-.", " (   ).", "(__(___)"] },
  { id: "cl2", left: 37, top: 56, fs: 10, dur: 15, delay: 5, c: "rgba(74,80,90,.5)", art: ["  .--.", ".(    ).", "(___.__)"] },
  { id: "cl3", left: 74, top: 53, fs: 10, dur: 19, delay: 1.5, c: "rgba(74,80,90,.52)", art: [" .-.", "(   ).", "(_(__)"] },
];

export const SUN = { left: 45, top: 46, fs: 15, c: PAL.orange };

export type Star = { id: string; left: number; top: number; fs: number; c: string; ch: string; dur: number; delay: number };

export function generateStars(): Star[] {
  const glyphs = ["*", "+", ".", "'", "*", "`"];
  const cols = [PAL.yellow, PAL.blue, PAL.pink, PAL.green, PAL.orange];
  return Array.from({ length: 32 }, (_, i) => ({
    id: "star" + i,
    left: +(Math.random() * 95 + 2).toFixed(2),
    top: +(Math.random() * 44 + 48).toFixed(2),
    fs: [9, 10, 11, 12, 13, 14][Math.floor(Math.random() * 6)],
    c: cols[Math.floor(Math.random() * cols.length)],
    ch: glyphs[Math.floor(Math.random() * glyphs.length)],
    dur: +(Math.random() * 2.6 + 2.4).toFixed(2),
    delay: +(Math.random() * 3.4).toFixed(2),
  }));
}
