import { cwd } from "node:process";

import { getInput, getMultilineInput } from "@actions/core";
import { globbySync } from "globby";

const getProjectRoot = () => getInput("root", { required: false }) || cwd();

const getFiles = () => getMultilineInput("files", { required: false }) || [];

const getGlobPatternFiles = () => {
  const patterns = getMultilineInput("files-glob", { required: false }) || [];
  if (patterns.length === 0) {
    return patterns;
  }

  return globbySync(patterns, {
    ignore: ["**/*.meta"],
    ignoreFiles: ["**/.gitignore", "**/.npmignore"],
  });
};

const getDestination = () => getInput("dest", { required: true });

export { getProjectRoot, getFiles, getGlobPatternFiles, getDestination };
