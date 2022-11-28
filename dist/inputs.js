"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputsInput = exports.getOutputInput = exports.getRootInput = exports.getPackagesInput = exports.getPackageInput = exports.getMetaInput = void 0;
const core_1 = require("@actions/core");
function getMetaInput() {
    return (0, core_1.getInput)("meta", { required: false });
}
exports.getMetaInput = getMetaInput;
function getPackageInput() {
    return (0, core_1.getInput)("package", { required: false });
}
exports.getPackageInput = getPackageInput;
function getPackagesInput() {
    return (0, core_1.getMultilineInput)("packages", { required: false });
}
exports.getPackagesInput = getPackagesInput;
function getRootInput() {
    return (0, core_1.getInput)("root", { required: false }) || process.cwd();
}
exports.getRootInput = getRootInput;
function getOutputInput() {
    return (0, core_1.getInput)("output", { required: false });
}
exports.getOutputInput = getOutputInput;
function getOutputsInput() {
    return (0, core_1.getMultilineInput)("outputs", { required: false });
}
exports.getOutputsInput = getOutputsInput;
