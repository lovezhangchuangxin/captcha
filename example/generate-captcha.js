// 运行此文件以生成一个验证码 SVG 文件
// 在此之前，请确保已经运行 `pnpm build` 来构建项目

const fs = require("fs");
const { Captcha } = require("../");

const captcha = new Captcha({ type: "formula", noise: 2 });
captcha.generate().then(({ value, svg }) => {
  fs.writeFileSync("./captcha.svg", svg);
});

const captcha2 = new Captcha({ noise: 3 });
captcha2.generate("@kq/captcha").then(({ value, svg }) => {
  fs.writeFileSync("./icon.svg", svg);
});
