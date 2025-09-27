import { describe, expect, it } from "vitest";
import {
  getRandomInt,
  generateRandomString,
  generateRandomFormula,
  evaluateFormula,
} from "../random";

describe("getRandomInt", () => {
  it("should return a random integer between min and max", () => {
    const values = Array.from({ length: 100 }, () => getRandomInt(1, 10));
    const min = Math.min(...values);
    const max = Math.max(...values);
    expect(min).toBeGreaterThanOrEqual(1);
    expect(max).toBeLessThanOrEqual(10);
  });
});

describe("generateRandomString", () => {
  it("should return a random string of specified length", () => {
    const str = generateRandomString(10, "abc");
    expect(str).toHaveLength(10);
    for (const char of str) {
      expect("abc").toContain(char);
    }
  });
});

describe("generateRandomFormula", () => {
  it("should return a random formula string with specified number of digits", () => {
    const formula = generateRandomFormula(3);
    expect(formula).toMatch(/^\d+[+\-*x]\d+[+\-*x]\d+$/);
  });
});

describe("evaluateFormula", () => {
  it("should correctly evaluate a formula string", () => {
    expect(evaluateFormula("3+5*2-4")).toBe(9);
    expect(evaluateFormula("10-2*3+1")).toBe(5);
    expect(evaluateFormula("8/2+6*3")).toBe(22);
  });
});
