export type WallItem = {
  left: number;
  top: number;
  width: number;
  height?: number;
  rotate?: number;
  label: string;
  file: string;
};

// Canvas: 4150 x 2800. Clusters are spaced generously apart (verified via
// bounding-box math -- no two clusters' extents overlap, ~40-200px margin
// between every pair) so the wall reads as separated project groups
// rather than one cramped collage, even though items *within* a cluster
// intentionally overlap each other (the stacked collage look).
export const LAYER_BACK: WallItem[] = [
  { left: 1769, top: 200, width: 300, rotate: -3, label: "#Include sticker sheet", file: "include-sticker-sheet.webp" },
  { left: 2188, top: 342, width: 250, label: "#Include project receipt", file: "include-project-receipt.webp" },
  { left: 2557, top: 448, width: 130, rotate: 5, label: "#Include lanyard badge", file: "include-lanyard-badge.webp" },
  { left: 1904, top: 647, width: 195, label: "#Include computer mascot", file: "include-computer-mascot.webp" },
  { left: 2323, top: 867, width: 230, rotate: -4, label: "#Include VIP pass ticket", file: "include-vip-pass-ticket.webp" },
];

export const LAYER_MID: WallItem[] = [
  { left: 1460, top: 1860, width: 220, rotate: -3, label: "The Lavender Field brand board", file: "lavender-field-brand-board.webp" },
  { left: 1772, top: 2093, width: 270, rotate: 4, label: "Lavender Field project receipt", file: "lavender-field-project-receipt.webp" },
  { left: 2158, top: 1080, width: 260, rotate: -2, label: "SacHacks VII project receipt", file: "sachacks-project-receipt.webp" },
  { left: 2563, top: 1123, width: 210, height: 350, rotate: 2, label: "SacHacks quarter-zip jacket back", file: "sachacks-quarter-zip-back.webp" },
  { left: 2096, top: 1616, width: 351, height: 270, rotate: -4, label: "SacHacks t-shirt design", file: "sachacks-tshirt-back.webp" },
  { left: 2449, top: 1789, width: 230, height: 230, label: "SacHacks round sticker", file: "sachacks-round-sticker.webp" },
];

export const LAYER_FRONT: WallItem[] = [
  { left: 1518, top: 1052, width: 300, label: "Welcome to my design cafe", file: "welcome-polaroid.webp" },
  { left: 667, top: 232, width: 300, label: "DOZE milk carton mockups", file: "doze-milk-carton-mockups.webp" },
  { left: 1117, top: 357, width: 317, label: "DOZE festival logo", file: "doze-festival-logo.webp" },
  { left: 710, top: 451, width: 300, rotate: -2, label: "DOZE project receipt", file: "doze-project-receipt.webp" },
  { left: 629, top: 1532, width: 208, rotate: -5, label: "Snapshoot Frame Theme screen", file: "snapshoot-frame-theme.webp" },
  { left: 1144, top: 1759, width: 205, rotate: 6, label: "Snapshoot home screen", file: "snapshoot-home-screen.webp" },
  { left: 512, top: 2262, width: 220, label: "Video Editing project receipt", file: "video-editing-receipt.webp" },
  { left: 3608, top: 2301, width: 320, rotate: 3, label: "ASMR Keyboard 3D render", file: "asmr-keyboard-render.webp" },
];

// small accent pieces tucked next to the "welcome" polaroid
export const WELCOME_ACCENTS: WallItem[] = [
  { left: 1951, top: 1048, width: 88, label: "", file: "welcome-accent-1.webp" },
  { left: 1922, top: 1133, width: 56, label: "", file: "welcome-accent-2.webp" },
];

// hint text + arrow pointing at the Snapshoot receipt card
export const SNAPSHOOT_ACCENTS: WallItem[] = [
  { left: 977, top: 1177, width: 240, label: "pssst, hover over the receipt!", file: "snapshoot-hover-hint.webp" },
  { left: 920, top: 1234, width: 58, label: "", file: "snapshoot-arrow.webp" },
];

export const DOZE_VIDEO_FILE = "doze-video.mp4";
