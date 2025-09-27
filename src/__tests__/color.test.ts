import { describe, expect, it } from "vitest";
import { hslToRgb, rgbToHsl, hexToRgb, parseRgbString } from "../color";

describe("hslToRgb", () => {
  it("should convert HSL to RGB correctly", () => {
    expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
    expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
    expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
    expect(hslToRgb(60, 100, 50)).toEqual([255, 255, 0]);
    expect(hslToRgb(300, 100, 50)).toEqual([255, 0, 255]);
  });
});

describe("rgbToHsl", () => {
  it("should convert RGB to HSL correctly", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
    expect(rgbToHsl(0, 255, 0)).toEqual([120, 100, 50]);
    expect(rgbToHsl(0, 0, 255)).toEqual([240, 100, 50]);
    expect(rgbToHsl(255, 255, 0)).toEqual([60, 100, 50]);
    expect(rgbToHsl(255, 0, 255)).toEqual([300, 100, 50]);
  });
});

describe("hexToRgb", () => {
  it("should convert HEX to RGB correctly", () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
    expect(hexToRgb("#00ff00")).toEqual([0, 255, 0]);
    expect(hexToRgb("#0000ff")).toEqual([0, 0, 255]);
    expect(hexToRgb("#ffff00")).toEqual([255, 255, 0]);
    expect(hexToRgb("#ff00ff")).toEqual([255, 0, 255]);
  });
});

describe("parseRgbString", () => {
  it("should parse rgb string correctly", () => {
    expect(parseRgbString("rgb(255, 0, 0)")).toEqual([255, 0, 0]);
    expect(parseRgbString("rgb(0, 255, 0)")).toEqual([0, 255, 0]);
    expect(parseRgbString("rgb(0, 0, 255)")).toEqual([0, 0, 255]);
    expect(parseRgbString("rgb(255, 255, 0)")).toEqual([255, 255, 0]);
    expect(parseRgbString("rgb(255, 0, 255)")).toEqual([255, 0, 255]);
  });
});
