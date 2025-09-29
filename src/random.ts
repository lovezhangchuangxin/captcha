/**
 * 数字集合
 */
export const numberSet = "0123456789";

/**
 * 字母集合
 */
export const letterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * 数字和字母集合
 */
export const mixSet = numberSet + letterSet;

/**
 * 运算符集合
 */
export const operatorSet = "+-x";

/**
 * 获取随机整数，包含 min 和 max
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度
 * @param chars 可选字符集合
 * @returns 随机字符串
 */
export function generateRandomString(length: number, chars: string): string {
  return Array.from({ length }, () =>
    chars.charAt(getRandomInt(0, chars.length - 1))
  ).join("");
}

/**
 * 生成指定数字个数的随机公式
 * @param length 数字个数
 * @returns 随机公式字符串
 */
export function generateRandomFormula(length: number): string {
  let formula = "";
  for (let i = 0; i < length; i++) {
    formula += getRandomInt(1, 9).toString();
    if (i < length - 1) {
      formula += operatorSet.charAt(getRandomInt(0, operatorSet.length - 1));
    }
  }
  return formula;
}

/**
 * 生成指定数字个数的随机公式（答案为正数）
 */
export function generatePositiveFormula(length: number): string {
  let formula = "-1";
  while (evaluateFormula(formula) < 0) {
    formula = generateRandomFormula(length);
  }
  return formula;
}

/**
 * 计算数学公式
 * @param formula 数学公式字符串
 * @returns 计算结果
 */
export function evaluateFormula(formula: string): number {
  formula = formula.replace(/x/g, "*");
  return new Function(`return (${formula})`)();
}

/**
 * 对 command 的参数做轻微的扰动
 */
export function perturbCommand(args: number[]): number[] {
  const degree = 0.2; // 扰动幅度
  return args.map((arg) => arg + Math.random() * degree - degree / 2);
}
