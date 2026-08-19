export type WallItem = {
  left: number;
  top: number;
  width: number;
  height?: number;
  rotate?: number;
  label: string;
  file: string;
};

export const LAYER_BACK: WallItem[] = [
  { left: 1655, top: 240, width: 300, rotate: -3, label: "#Include sticker sheet", file: "include-sticker-sheet.webp" },
  { left: 1950, top: 340, width: 250, label: "#Include project receipt", file: "include-project-receipt.webp" },
  { left: 2210, top: 415, width: 130, rotate: 5, label: "#Include lanyard badge", file: "include-lanyard-badge.webp" },
  { left: 1750, top: 555, width: 195, label: "#Include computer mascot", file: "include-computer-mascot.webp" },
  { left: 2045, top: 710, width: 230, rotate: -4, label: "#Include VIP pass ticket", file: "include-vip-pass-ticket.webp" },
];

export const LAYER_MID: WallItem[] = [
  { left: 1437, top: 1409, width: 220, rotate: -3, label: "The Lavender Field brand board", file: "lavender-field-brand-board.webp" },
  { left: 1657, top: 1573, width: 270, rotate: 4, label: "Lavender Field project receipt", file: "lavender-field-project-receipt.webp" },
  { left: 1929, top: 860, width: 260, rotate: -2, label: "SacHacks VII project receipt", file: "sachacks-project-receipt.webp" },
  { left: 2214, top: 890, width: 210, height: 350, rotate: 2, label: "SacHacks quarter-zip jacket back", file: "sachacks-quarter-zip-back.webp" },
  { left: 1885, top: 1237, width: 351, height: 270, rotate: -4, label: "SacHacks t-shirt design", file: "sachacks-tshirt-back.webp" },
  { left: 2134, top: 1359, width: 230, height: 230, label: "SacHacks round sticker", file: "sachacks-round-sticker.webp" },
];

export const LAYER_FRONT: WallItem[] = [
  { left: 1478, top: 840, width: 300, label: "Welcome to my design cafe", file: "welcome-polaroid.webp" },
  { left: 879, top: 263, width: 300, label: "DOZE milk carton mockups", file: "doze-milk-carton-mockups.webp" },
  { left: 1196, top: 351, width: 317, label: "DOZE festival logo", file: "doze-festival-logo.webp" },
  { left: 909, top: 417, width: 300, rotate: -2, label: "DOZE project receipt", file: "doze-project-receipt.webp" },
  { left: 852, top: 1178, width: 208, rotate: -5, label: "Snapshoot Frame Theme screen", file: "snapshoot-frame-theme.webp" },
  { left: 1215, top: 1338, width: 205, rotate: 6, label: "Snapshoot home screen", file: "snapshoot-home-screen.webp" },
];

// small accent pieces tucked next to the "welcome" polaroid
export const WELCOME_ACCENTS: WallItem[] = [
  { left: 1783, top: 837, width: 88, label: "", file: "welcome-accent-1.webp" },
  { left: 1763, top: 897, width: 56, label: "", file: "welcome-accent-2.webp" },
];

// hint text + arrow pointing at the Snapshoot receipt card
export const SNAPSHOOT_ACCENTS: WallItem[] = [
  { left: 1097, top: 928, width: 240, label: "pssst, hover over the receipt!", file: "snapshoot-hover-hint.webp" },
  { left: 1057, top: 968, width: 58, label: "", file: "snapshoot-arrow.webp" },
];

export const DOZE_VIDEO_FILE = "doze-video.mp4";
