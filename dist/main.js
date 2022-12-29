"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const unitypackage_1 = require("@natsuneko-laboratory/unitypackage");
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const inputs_1 = require("./inputs");
function isExistsFileAsync(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs_1.default.existsSync(path);
    });
}
function readFileAsync(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(path, { encoding: "utf-8" }, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    });
}
function getIgnoreFileElements(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFileAsync(path);
        const lines = content.split("\n");
        return lines.map((w) => w.trim()).filter((w) => w !== "");
    });
}
// Priority:
//   1. .npmignore
//   2. .gitignore
function readIgnoreFile(root) {
    return __awaiter(this, void 0, void 0, function* () {
        const npmignore = path_1.default.join(root, ".npmignore");
        const gitignore = path_1.default.join(root, ".gitignore");
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
        const hasNpmIgnore = yield isExistsFileAsync(npmignore);
        if (hasNpmIgnore) {
            const elements = yield getIgnoreFileElements(npmignore);
            return DEFAULT_IGNORES.concat(elements);
        }
        const hasGitIgnore = yield isExistsFileAsync(gitignore);
        if (hasGitIgnore) {
            const elements = yield getIgnoreFileElements(gitignore);
            return DEFAULT_IGNORES.concat(elements);
        }
        return DEFAULT_IGNORES;
    });
}
function collectTargetsFromMeta(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFileAsync(path);
        const lines = content.split("\n");
        return lines.map((w) => w.trim()).filter((w) => w !== "");
    });
}
function collectTargetsFromGlob(root) {
    return __awaiter(this, void 0, void 0, function* () {
        const ignore = yield readIgnoreFile(root);
        const files = glob_1.default.sync("**/*", { cwd: root, ignore });
        const meta = files
            .filter((w) => !w.endsWith(".meta"))
            .flatMap((w) => {
            const paths = w.split("/");
            const hierarchies = [];
            return paths.map((w) => {
                const path = [...hierarchies, w].join("/");
                hierarchies.push(w);
                return `${path}.meta`;
            });
        });
        return Array.from(new Set(meta)).filter((w) => w !== "Assets.meta");
    });
}
function runForMetaInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = (0, inputs_1.getRootInput)();
        const meta = (0, inputs_1.getMetaInput)();
        const output = (0, inputs_1.getOutputInput)();
        const targets = yield collectTargetsFromMeta(meta);
        yield (0, unitypackage_1.archive)(targets, root, output);
    });
}
function runForPackageInput(args) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const root = (0, inputs_1.getRootInput)();
        const pkg = (_a = args === null || args === void 0 ? void 0 : args.pkg) !== null && _a !== void 0 ? _a : (0, inputs_1.getPackageInput)();
        const output = (_b = args === null || args === void 0 ? void 0 : args.output) !== null && _b !== void 0 ? _b : (0, inputs_1.getOutputInput)();
        const basename = path_1.default.dirname(pkg);
        const targets = yield collectTargetsFromGlob(basename);
        yield (0, unitypackage_1.archive)(targets.map((w) => path_1.default.join(basename, w)), root, output);
    });
}
function runForPackagesInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const packages = (0, inputs_1.getPackagesInput)();
        const outputs = (0, inputs_1.getOutputsInput)();
        if (packages.length !== outputs.length)
            throw new Error("the number of elements in packages and outputs must be match");
        for (let i = 0; i < packages.length; i++) {
            const pkg = packages[i];
            const output = outputs[i];
            yield runForPackageInput({ pkg, output });
        }
    });
}
function getInputType() {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = (0, inputs_1.getMetaInput)();
        if (meta) {
            return "meta";
        }
        const pkg = (0, inputs_1.getPackageInput)();
        if (pkg) {
            return "package";
        }
        const packages = (0, inputs_1.getPackageInput)();
        if (packages.length) {
            return "packages";
        }
        throw new Error("@natsuneko-laboratory/create-unitypackage requires one of meta, package or packages input");
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const type = yield getInputType();
            switch (type) {
                case "meta":
                    yield runForMetaInput();
                    break;
                case "package":
                    yield runForPackageInput();
                    break;
                case "packages":
                    yield runForPackagesInput();
                    break;
                default:
                    throw new Error(`Unknown type: ${type}`);
            }
        }
        catch (err) {
            if (err instanceof Error)
                (0, core_1.setFailed)(err.message);
        }
    });
}
main();
