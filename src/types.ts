/**
 * 验证码选项
 */
export interface CaptchaOptions {
  /** 字体文件路径，支持 ttf */
  fontPath?: string;
  /** 验证码类型，分别是数字、字母、混合和公式，默认数字 */
  type?: "number" | "letter" | "mix" | "formula";
  /** 验证码长度，默认 4，如果验证码类型是公式，表示公式中数字的个数 */
  length?: number;
  /** 验证码图片宽度，默认按字体的实际宽度 */
  width?: number;
  /** 验证码图片高度，默认按字体的实际高度 */
  height?: number;
  /** 干扰线数量，默认 1 */
  noise?: number;
  /** 干扰线宽度 */
  noiseWidth?: number;
  /** 字符集 */
  chars?: string;
  /** 想忽略的字符集 */
  ignoreChars?: string;
  /** 背景颜色 */
  backgroundColor?: string;
}

/**
 * 验证码结果
 */
export interface CaptchaResult {
  /** 验证码的值 */
  value: string;
  /** 验证码的 SVG 字符串 */
  svg: string;
  /** 背景颜色 */
  backgroundColor: string;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 缩放 */
  scale: { width: number; height: number };
}
