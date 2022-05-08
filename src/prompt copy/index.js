"use strict";
/***
 * @name        cli-prompt
 * @package     @cloud-vault
 * @summary     ESM-based CLI Prompt
 *
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
const util_1 = __importDefault(require("util"));
const readline_1 = __importDefault(require("readline"));
const process_1 = __importDefault(require("process"));
/***
 * User Input Prompt
 *
 * @returns {Promise<String>}
 *
 * @constructor
 *
 * @param preface
 */
const Prompt = (preface) => {
    return new Promise(async (resolve, reject) => {
        let $;
        const Interface = readline_1.default.createInterface({
            input: process_1.default.openStdin(),
            output: process_1.default.stdout
        });
        const prompt = util_1.default.promisify(Interface.question).bind(Interface);
        try {
            $ = await prompt(preface);
        }
        catch (_) {
            reject(_);
        }
        finally {
            Interface.close();
        }
        resolve($);
    });
};
exports.Prompt = Prompt;
exports.default = Prompt;
