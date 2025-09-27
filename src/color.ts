import { getRandomInt } from "./random";

/**
 * 根据背景颜色参数计算随机的字体颜色，确保对比度足够
 * @param color 背景颜色，支持 HEX、RGB 格式
 * @returns 计算得到的字体颜色，RGB 格式
 */
export function calculateFontColor(bgColor: string) {
  let r: number, g: number, b: number;
  if (bgColor.startsWith("#")) {
    [r, g, b] = hexToRgb(bgColor);
  } else if (bgColor.startsWith("rgb")) {
    [r, g, b] = parseRgbString(bgColor);
  } else {
    throw new Error("Unsupported color format. Use HEX or RGB.");
  }

  // 计算亮度
  const bgHSL = rgbToHsl(r, g, b);
  const bgLightness = bgHSL[2];
  let minLightness: number, maxLightness: number;
  if (bgLightness < 50) {
    minLightness = bgLightness + 30;
    maxLightness = Math.min(100, bgLightness + 60);
  } else {
    minLightness = Math.max(0, bgLightness - 60);
    maxLightness = bgLightness - 30;
  }
  const lightness = getRandomInt(minLightness, maxLightness);
  const hue = getRandomInt(0, 360);
  const saturation = getRandomInt(70, 100);
  const [fr, fg, fb] = hslToRgb(hue, saturation, lightness);
  return `rgb(${fr}, ${fg}, ${fb})`;
}

/**
 * 获取随机的背景颜色，HSL 色彩空间
 */
export function getRandomBackgroundColor() {
  const hue = getRandomInt(0, 360);
  const saturation = getRandomInt(30, 80);
  const lightness = getRandomInt(50, 80);
  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * HSL 转 RGB
 * @param h Hue (0 - 360)
 * @param s Saturation (0 - 100)
 * @param l Lightness (0 - 100)
 * @returns RGB color as [r, g, b] (0 - 255)
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  h = h % 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/**
 * RGB 转 HSL
 * @param r Red (0 - 255)
 * @param g Green (0 - 255)
 * @param b Blue (0 - 255)
 * @returns HSL color as [h, s, l] (h: 0 - 360, s: 0 - 100, l: 0 - 100)
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return [h, s, l];
}

/**
 * HEX 转 RGB
 * @param hex HEX color string (#RRGGBB or #RGB)
 * @returns RGB color as [r, g, b] (0 - 255)
 */
export function hexToRgb(hex: string): [number, number, number] {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * 解析 rgb 字符串
 * @param rgbStr RGB color string (e.g., "rgb(255, 0, 0)")
 * @returns RGB color as [r, g, b] (0 - 255)
 */
export function parseRgbString(rgbStr: string): [number, number, number] {
  const match = rgbStr.match(
    /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/
  );
  if (!match) {
    throw new Error("Invalid RGB color string.");
  }
  const r = Math.min(255, Math.max(0, parseInt(match[1], 10)));
  const g = Math.min(255, Math.max(0, parseInt(match[2], 10)));
  const b = Math.min(255, Math.max(0, parseInt(match[3], 10)));
  return [r, g, b];
}
