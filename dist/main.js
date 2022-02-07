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
const fs_1 = __importDefault(require("fs"));
const unitypackage_1 = require("@natsuneko-laboratory/unitypackage");
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
function collect(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFileAsync(path);
        const lines = content.split("\n");
        return lines.map((w) => w.trim()).filter((w) => w !== "");
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const meta = (0, core_1.getInput)("meta");
            const root = (0, core_1.getInput)("root") || process.cwd();
            const output = (0, core_1.getInput)("output");
            const targets = yield collect(meta);
            yield (0, unitypackage_1.archive)(targets, root, output);
        }
        catch (err) {
            if (err instanceof Error)
                (0, core_1.setFailed)(err.message);
        }
    });
}
main();
