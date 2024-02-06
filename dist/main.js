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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const unitypackage_1 = require("@natsuneko-laboratory/unitypackage");
const inputs_1 = require("./inputs");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = (0, inputs_1.getProjectRoot)();
        const dest = (0, inputs_1.getDestination)();
        const files = [...(0, inputs_1.getFiles)(), ...(0, inputs_1.getGlobPatternFiles)()];
        try {
            yield (0, unitypackage_1.archive)({
                files,
                root,
                dest,
            });
        }
        catch (err) {
            if (err instanceof Error)
                (0, core_1.setFailed)(err.message);
        }
    });
}
main();
