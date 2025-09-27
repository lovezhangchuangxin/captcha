// 运行此文件以生成一个验证码 SVG 文件
// 在此之前，请确保已经运行 `pnpm build` 来构建项目

const fs = require("fs");
const { resolve } = require("path");
const { Captcha } = require("../");

const captcha = new Captcha({ type: "formula", noise: 2 });
captcha.generate().then(({ value, svg }) => {
  const filename = resolve(__dirname, `./captcha.svg`);
  fs.writeFileSync(filename, svg);
  console.log("验证码值为：", value);
});

const captcha2 = new Captcha({ noise: 3 });
captcha2.generate("lovekeqing").then(({ value, svg }) => {
  const filename = resolve(__dirname, `./icon.svg`);
  fs.writeFileSync(filename, svg);
});
