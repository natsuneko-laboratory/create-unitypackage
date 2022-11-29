import { getInput, getMultilineInput } from "@actions/core";

export function getMetaInput(): string {
  return getInput("meta", { required: false });
}

export function getPackageInput(): string {
  return getInput("package", { required: false });
}

export function getPackagesInput(): string[] {
  return getMultilineInput("packages", { required: false });
}

export function getRootInput(): string {
  return getInput("root", { required: false }) || process.cwd();
}

export function getOutputInput(): string {
  return getInput("output", { required: false });
}

export function getOutputsInput(): string[] {
  return getMultilineInput("outputs", { required: false });
}
