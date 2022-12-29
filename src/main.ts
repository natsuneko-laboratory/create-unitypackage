import { setFailed } from "@actions/core";
import { archive } from "@natsuneko-laboratory/unitypackage";
import fs from "fs";
import glob from "glob";
import path from "path";

import {
  getMetaInput,
  getOutputInput,
  getOutputsInput,
  getPackageInput,
  getPackagesInput,
  getRootInput,
} from "./inputs";

async function isExistsFileAsync(path: string): Promise<boolean> {
  return fs.existsSync(path);
}

async function readFileAsync(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

async function getIgnoreFileElements(path: string): Promise<string[]> {
  const content = await readFileAsync(path);
  const lines = content.split("\n");

  return lines.map((w) => w.trim()).filter((w) => w !== "");
}

// Priority:
//   1. .npmignore
//   2. .gitignore
async function readIgnoreFile(root: string): Promise<string[]> {
  const npmignore = path.join(root, ".npmignore");
  const gitignore = path.join(root, ".gitignore");
  const DEFAULT_IGNORES = [
    ".*.swp",
    "._*",
    ".DS_Store",
    ".git",
    ".gitignore",
    ".hg",
    ".npmignore",
    ".npmrc",
    ".lock-wscript",
    ".svn",
    ".wafpickle-*",
    "config.gypi",
    "CVS",
    "npm-debug.log",
  ];

  const hasNpmIgnore = await isExistsFileAsync(npmignore);
  if (hasNpmIgnore) {
    const elements = await getIgnoreFileElements(npmignore);
    return DEFAULT_IGNORES.concat(elements);
  }

  const hasGitIgnore = await isExistsFileAsync(gitignore);
  if (hasGitIgnore) {
    const elements = await getIgnoreFileElements(gitignore);
    return DEFAULT_IGNORES.concat(elements);
  }

  return DEFAULT_IGNORES;
}

async function collectTargetsFromMeta(path: string): Promise<string[]> {
  const content = await readFileAsync(path);
  const lines = content.split("\n");

  return lines.map((w) => w.trim()).filter((w) => w !== "");
}

async function collectTargetsFromGlob(root: string): Promise<string[]> {
  const ignore = await readIgnoreFile(root);
  const files = glob.sync("**/*", { cwd: root, ignore });
  const meta = files
    .filter((w) => !w.endsWith(".meta"))
    .flatMap((w) => {
      const paths = w.split("/");
      const hierarchies: string[] = [];

      return paths.map((w) => {
        const path = [...hierarchies, w].join("/");
        hierarchies.push(w);

        return `${path}.meta`;
      });
    });

  return Array.from<string>(new Set<string>(meta)).filter(
    (w) => w !== "Assets.meta"
  );
}

async function runForMetaInput() {
  const root = getRootInput();
  const meta = getMetaInput();
  const output = getOutputInput();

  const targets = await collectTargetsFromMeta(meta);

  await archive(targets, root, output);
}

async function runForPackageInput(args?: { pkg: string; output: string }) {
  const root = getRootInput();
  const pkg = args?.pkg ?? getPackageInput();
  const output = args?.output ?? getOutputInput();

  const basename = path.dirname(pkg);
  const targets = await collectTargetsFromGlob(basename);

  await archive(
    targets.map((w) => path.join(basename, w)),
    root,
    output
  );
}

async function runForPackagesInput() {
  const packages = getPackagesInput();
  const outputs = getOutputsInput();

  if (packages.length !== outputs.length)
    throw new Error(
      "the number of elements in packages and outputs must be match"
    );

  for (let i = 0; i < packages.length; i++) {
    const pkg = packages[i];
    const output = outputs[i];

    await runForPackageInput({ pkg, output });
  }
}

async function getInputType(): Promise<"meta" | "package" | "packages"> {
  const meta = getMetaInput();
  if (meta) {
    return "meta";
  }

  const pkg = getPackageInput();
  if (pkg) {
    return "package";
  }

  const packages = getPackageInput();
  if (packages.length) {
    return "packages";
  }

  throw new Error(
    "@natsuneko-laboratory/create-unitypackage requires one of meta, package or packages input"
  );
}

async function main() {
  try {
    const type = await getInputType();

    switch (type) {
      case "meta":
        await runForMetaInput();
        break;

      case "package":
        await runForPackageInput();
        break;

      case "packages":
        await runForPackagesInput();
        break;

      default:
        throw new Error(`Unknown type: ${type as { type: "__invalid__" }}`);
    }
  } catch (err) {
    if (err instanceof Error) setFailed(err.message);
  }
}

main();
