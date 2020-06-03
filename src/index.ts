interface Codes {
  [code: string]: boolean;
}

interface ConfigInit {
  count?: number;
  length?: number;
  charset?: string;
  prefix?: string;
  postfix?: string;
  pattern?: string;
}

function charset(name: string): string {
  if (name === "numbers") {
    return "0123456789";
  }

  if (name === "alphabetic") {
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (name === "alphanumeric") {
    return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (name === "alphanumericUppercase") {
    return "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  throw new Error(`invalid charset "${name}"`);
}

function repeat(str: string, count: number): string {
  let res = "";
  for (let i = 0; i < count; i++) {
    res += str;
  }
  return res;
}

class Config {
  public count: number;

  public length: number;

  public charset: string;

  public prefix: string;

  public postfix: string;

  public pattern: string;

  constructor(config: ConfigInit = {}) {
    this.count = config.count || 1;
    this.length = config.length || 8;
    this.charset = config.charset || charset("alphanumericUppercase");
    this.prefix = config.prefix || "";
    this.postfix = config.postfix || "";
    this.pattern = config.pattern || repeat("#", this.length);
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElem(arr: string): string {
  return arr[randomInt(0, arr.length - 1)];
}

function generateOne(config: Config): string {
  const code = config.pattern
    .split("")
    .map(function(char) {
      if (char === "#") {
        return randomElem(config.charset);
      } else {
        return char;
      }
    })
    .join("");
  return config.prefix + code + config.postfix;
}

function isFeasible(charset: string, pattern: string, count: number): boolean {
  return Math.pow(charset.length, (pattern.match(/#/g) || []).length) >= count;
}

export function generate(configInit?: ConfigInit): string[] {
  const config = new Config(configInit);
  let count = config.count;
  if (!isFeasible(config.charset, config.pattern, config.count)) {
    throw new Error("Not possible to generate requested number of codes.");
  }

  const codes: Codes = {};
  while (count > 0) {
    const code = generateOne(config);
    if (codes[code] === undefined) {
      codes[code] = true;
      count--;
    }
  }
  return Object.keys(codes);
}
