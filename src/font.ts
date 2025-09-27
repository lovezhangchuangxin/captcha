import fontkit from "fontkit";
import { getRandomInt, perturbCommand } from "./random";
import { calculateFontColor } from "./color";

/**
 * 加载字体文件
 * @param path 字体文件路径
 */
export async function loadFont(path: string) {
  const font = (await fontkit.open(path)) as fontkit.Font;
  return font;
}

/**
 * 获取要渲染的文本的路径对象
 */
export function getTextPath(font: fontkit.Font, text: string, bgColor: string) {
  if (!font) {
    throw new Error("Font not loaded. Please call loadFont() first.");
  }

  const run = font.layout(text);
  // 左右各留 20px 边距
  let width = 20;
  const paths = run.glyphs.map((glyph) => {
    glyph.path.commands.forEach((cmd) => {
      cmd.args = perturbCommand(cmd.args);
    });

    const pathStr = glyph.path.toSVG();
    const color = calculateFontColor(bgColor);
    const halfFontWidth = glyph.advanceWidth / 2;
    // 对平移、缩放和旋转参数做轻微扰动
    const scaleX = 1 + (Math.random() - 0.5) * 0.04; // 0.98~1.02
    const scaleY = -1 + (Math.random() - 0.5) * 0.04; // -1.02~-0.98
    const dx = width + getRandomInt(-halfFontWidth / 3, halfFontWidth / 3);
    const dy = -font!.ascent;
    const rotate = getRandomInt(-20, 20);
    const path = `<path d="${pathStr}" fill="${color}" transform="scale(${scaleX},${scaleY}) translate(${dx},${dy}) rotate(${rotate})"/>`;
    width = dx + glyph.advanceWidth;
    return path;
  });
  width += 20;
  return { paths, width, height: font.ascent - font.descent };
}
