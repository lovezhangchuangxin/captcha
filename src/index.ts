import fontkit from "fontkit";
import { resolve } from "path";
import { calculateFontColor, getRandomBackgroundColor } from "./color";
import { getTextPath, loadFont } from "./font";
import {
  evaluateFormula,
  generateRandomFormula,
  generateRandomString,
  getRandomInt,
  letterSet,
  numberSet,
} from "./random";
import { CaptchaOptions, CaptchaResult } from "./types";

const DEFAULT_FONT_PATH = resolve(
  __dirname,
  "../assets/Tagesschrift-Regular.ttf"
);

/**
 * 验证码生成器
 */
export class Captcha {
  /** 选项 */
  options: Required<CaptchaOptions>;

  /** 字体对象 */
  font: fontkit.Font | null = null;
  /** 字体文件加载状态 */
  #status: Promise<void>;
  /** 宽高缩放 */
  #scale: { width: number; height: number } = { width: 1, height: 1 };

  constructor(options: CaptchaOptions = {}) {
    this.options = {
      fontPath: options.fontPath || DEFAULT_FONT_PATH,
      type: options.type || "number",
      backgroundColor: options.backgroundColor || "",
      length: options.length || options.type === "formula" ? 2 : 4,
      // 这里先占位，后面会根据字符长度计算实际宽度和高度
      width: options.width || 0,
      height: options.height || 0,
      noise: options.noise || 1,
      noiseWidth: options.noiseWidth || 5,
      chars: options.chars || this.#getDefaultChars(options),
      ignoreChars: options.ignoreChars || "",
    };

    this.#status = loadFont(this.options.fontPath).then((font) => {
      this.font = font;
    });
  }

  /**
   * 生成验证码，返回值包含验证码的值和 SVG 字符串
   * @param content 自定义验证码文本，如果不传则随机生成
   * @return 验证码结果
   */
  async generate(content?: string): Promise<CaptchaResult> {
    if (!this.font) {
      await this.#status;
    }

    const { backgroundColor, type } = this.options;
    const bgColor = backgroundColor || getRandomBackgroundColor();
    const { text, value } = content
      ? {
          text: content,
          value:
            type === "formula" ? evaluateFormula(content).toString() : content,
        }
      : this.#generateText();
    let svg = "<svg xmlns='http://www.w3.org/2000/svg' ";
    // 计算文本的 path 以及实际宽高
    const {
      width: actualWidth,
      height: actualHeight,
      paths,
    } = getTextPath(this.font!, text, bgColor);
    if (this.options.width === 0) {
      this.options.width = actualWidth;
    }
    if (this.options.height === 0) {
      this.options.height = actualHeight;
    }

    // 计算缩放比例
    this.#scale.width = this.options.width / actualWidth;
    this.#scale.height = this.options.height / actualHeight;

    svg += `viewBox="0 0 ${this.options.width} ${this.options.height}">`;

    // 生成背景
    svg += this.#generateBackground(bgColor);

    // 添加文本 path
    svg += `<g transform="scale(${this.#scale.width},${this.#scale.height})">`;
    svg += paths.join("\n");
    svg += "</g>";

    // 生成干扰线
    if (this.options.noise > 0) {
      svg += this.#getNoiseLines(bgColor);
    }

    svg += "</svg>";
    return {
      value,
      svg,
      backgroundColor: bgColor,
      width: this.options.width,
      height: this.options.height,
      scale: { ...this.#scale },
    };
  }

  /**
   * 生成验证码文案和答案的值
   */
  #generateText(): { text: string; value: string } {
    const { type, length, chars, ignoreChars } = this.options;
    let text = "";
    let value = "";

    // 过滤掉忽略的字符
    const effectiveChars = chars
      .split("")
      .filter((char) => !ignoreChars.includes(char))
      .join("");
    if (effectiveChars.length === 0 && type !== "formula") {
      throw new Error("有效字符集不能为空");
    }

    if (type === "formula") {
      // 公式类型
      text = generateRandomFormula(length);
      value = evaluateFormula(text).toString();
    } else {
      text = generateRandomString(length, effectiveChars);
      value = text;
    }
    return { text, value };
  }

  /**
   * 生成背景
   */
  #generateBackground(bgColor: string): string {
    const { width, height } = this.options;
    const w = width * this.#scale.width;
    const h = height * this.#scale.height;
    return `<rect width="${w}" height="${h}" fill="${bgColor}" />`;
  }

  /**
   * 生成干扰线
   * @return 干扰线 SVG 字符串
   */
  #getNoiseLines(bgColor: string): string {
    const { width, height, noiseWidth } = this.options;
    const w = width * this.#scale.width;
    const h = height * this.#scale.height;

    // 所有的干扰线
    const lines: string[] = [];
    // 生成位置随机的范围间隔
    const widthGap = w * 0.1;

    // 生成 noise 条干扰线
    for (let i = 0; i < this.options.noise; i++) {
      const color = calculateFontColor(bgColor);
      const startX = getRandomInt(1, widthGap);
      const startY = getRandomInt(1, h);
      const endX = getRandomInt(w - widthGap, w);
      const endY = getRandomInt(1, h);
      // 控制点，生成两个随机点
      const cp1X = getRandomInt(widthGap, w / 2);
      const cp1Y = getRandomInt(1, h);
      const cp2X = getRandomInt(w / 2, w - widthGap);
      const cp2Y = getRandomInt(1, h);
      // 贝塞尔曲线 path
      const d = `M${startX},${startY} C${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
      lines.push(
        `<path d="${d}" stroke="${color}" stroke-width="${noiseWidth}" fill="none"/>`
      );
    }

    return lines.join("\n");
  }

  /**
   * 根据验证码类型选择对应的默认字符集
   */
  #getDefaultChars(options: CaptchaOptions): string {
    switch (options.type) {
      case "number":
        return numberSet;
      case "letter":
        return letterSet;
      case "mix":
        return numberSet + letterSet;
      case "formula":
        return ""; // 公式类型不需要字符集
      default:
        return numberSet;
    }
  }
}

export * from "./types";
