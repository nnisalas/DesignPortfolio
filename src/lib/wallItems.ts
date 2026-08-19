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
  { left: 1640, top: 330, width: 300, rotate: -3, label: "#Include sticker sheet", file: "include-sticker-sheet.webp" },
  { left: 1935, top: 430, width: 250, label: "#Include project receipt", file: "include-project-receipt.webp" },
  { left: 2195, top: 505, width: 130, rotate: 5, label: "#Include lanyard badge", file: "include-lanyard-badge.webp" },
  { left: 1735, top: 645, width: 195, label: "#Include computer mascot", file: "include-computer-mascot.webp" },
  { left: 2030, top: 800, width: 230, rotate: -4, label: "#Include VIP pass ticket", file: "include-vip-pass-ticket.webp" },
];

export const LAYER_MID: WallItem[] = [
  { left: 930, top: 376, width: 220, rotate: -3, label: "The Lavender Field brand board", file: "lavender-field-brand-board.webp" },
  { left: 1150, top: 540, width: 270, rotate: 4, label: "Lavender Field project receipt", file: "lavender-field-project-receipt.webp" },
  { left: 1845, top: 1180, width: 260, rotate: -2, label: "SacHacks VII project receipt", file: "sachacks-project-receipt.webp" },
  { left: 2130, top: 1210, width: 210, height: 350, rotate: 2, label: "SacHacks quarter-zip jacket back", file: "sachacks-quarter-zip-back.webp" },
  { left: 1801, top: 1557, width: 351, height: 270, rotate: -4, label: "SacHacks t-shirt design", file: "sachacks-tshirt-back.webp" },
  { left: 2050, top: 1679, width: 230, height: 230, label: "SacHacks round sticker", file: "sachacks-round-sticker.webp" },
];

export const LAYER_FRONT: WallItem[] = [
  { left: 1450, top: 865, width: 300, label: "Welcome to my design cafe", file: "welcome-polaroid.webp" },
  { left: 930, top: 1166, width: 300, label: "DOZE milk carton mockups", file: "doze-milk-carton-mockups.webp" },
  { left: 1247, top: 1254, width: 317, label: "DOZE festival logo", file: "doze-festival-logo.webp" },
  { left: 960, top: 1320, width: 300, rotate: -2, label: "DOZE project receipt", file: "doze-project-receipt.webp" },
];

// small accent pieces tucked next to the "welcome" polaroid
export const WELCOME_ACCENTS: WallItem[] = [
  { left: 1755, top: 862, width: 88, label: "", file: "welcome-accent-1.webp" },
  { left: 1735, top: 922, width: 56, label: "", file: "welcome-accent-2.webp" },
];

export const DOZE_VIDEO_FILE = "doze-video.mp4";
