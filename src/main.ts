import { getInput, setFailed } from "@actions/core";
import fsp from "fs/promises";

import { archive } from "@natsuneko-laboratory/unitypackage";

async function collect(path: string): Promise<string[]> {
  const content = await fsp.readFile(path, "utf-8");
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
