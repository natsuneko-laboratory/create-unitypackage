import { setFailed } from "@actions/core";
import { archive } from "@natsuneko-laboratory/unitypackage";

import {
  getProjectRoot,
  getFiles,
  getGlobPatternFiles,
  getDestination,
} from "./inputs";

async function main() {
  const root = getProjectRoot();
  const dest = getDestination();
  const files = [...getFiles(), ...getGlobPatternFiles()];

  try {
    await archive({
      files,
      root,
      dest,
    });
  } catch (err) {
    if (err instanceof Error) setFailed(err.message);
  }
}

main();
