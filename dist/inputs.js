"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDestination = exports.getGlobPatternFiles = exports.getFiles = exports.getProjectRoot = void 0;
const node_process_1 = require("node:process");
const core_1 = require("@actions/core");
const globby_1 = require("globby");
const getProjectRoot = () => (0, core_1.getInput)("root", { required: false }) || (0, node_process_1.cwd)();
exports.getProjectRoot = getProjectRoot;
const getFiles = () => (0, core_1.getMultilineInput)("files", { required: false }) || [];
exports.getFiles = getFiles;
const getGlobPatternFiles = () => {
    const patterns = (0, core_1.getMultilineInput)("files-glob", { required: false }) || [];
    if (patterns.length === 0) {
        return patterns;
    }
    const root = getProjectRoot();
    return (0, globby_1.globbySync)(patterns, {
        cwd: root,
        ignoreFiles: ["**/.gitignore", "**/.npmignore"],
    });
};
exports.getGlobPatternFiles = getGlobPatternFiles;
const getDestination = () => (0, core_1.getInput)("dest", { required: true });
exports.getDestination = getDestination;
