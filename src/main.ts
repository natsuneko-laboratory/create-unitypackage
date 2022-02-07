import { getInput, setFailed } from "@actions/core";
import fs from "fs";

import { archive } from "@natsuneko-laboratory/unitypackage";

async function readFileAsync(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

async function collect(path: string): Promise<string[]> {
  const content = await readFileAsync(path);
  const lines = content.split("\n");

  return lines.map((w) => w.trim()).filter((w) => w !== "");
}

async function main() {
  try {
    const meta = getInput("meta");
    const root = getInput("root") || process.cwd();
    const output = getInput("output");

    const targets = await collect(meta);

    await archive(targets, root, output);
  } catch (err) {
    if (err instanceof Error) setFailed(err.message);
  }
}

main();
