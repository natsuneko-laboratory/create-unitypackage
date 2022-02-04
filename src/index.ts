import core from "@actions/core";
import fsp from "fs/promises";

import { archive } from "@natsuneko-laboratory/unitypackage";

const collect = async (path: string): Promise<string[]> => {
  const content = await fsp.readFile(path, "utf-8");
  const lines = content.split("\n");

  return lines.map((w) => w.trim()).filter((w) => w !== "");
};

const main = async () => {
  try {
    const meta = core.getInput("meta");
    const root = core.getInput("root");
    const output = core.getInput("output");

    const targets = await collect(meta);

    await archive(targets, root, output);
  } catch (err) {
    if (err instanceof Error) core.setFailed(err.message);
  }
};

main();
