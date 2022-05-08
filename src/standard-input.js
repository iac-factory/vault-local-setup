"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTY = exports.Cursor = exports.Handler = void 0;
const process_1 = __importDefault(require("process"));
const TTY = process.stdin.isTTY;
exports.TTY = TTY;
const Cursor = () => {
    const [X, Y] = process_1.default.stdout.getWindowSize();
    const buffer = " ".repeat(process?.stdout?.columns);
    process_1.default.stdout.cursorTo(0, Y);
    process_1.default.stdout.clearLine(0);
    process?.stdout?.write(buffer);
    process?.stdout.cursorTo(0, process?.stdout?.rows);
    process?.stdout?.write("\u001B[?25h");
    process_1.default.stdout.emit("drain");
};
exports.Cursor = Cursor;
const Handler = () => {
    process_1.default.stdout?.write("\u001B[?25l" + "\r");
    process_1.default.stdin?.on("data", ($) => {
        /// CTRL + C
        /// @ts-ignore
        Buffer.from([0x3], "hex")
            .equals($) && process?.exit(0);
        /// CTRL + D
        /// @ts-ignore
        Buffer.from([0x4], "hex")
            .equals($) && process?.exit(0);
        /// CTRL + Z
        /// @ts-ignore
        Buffer.from([0x1a], "hex")
            .equals($) && process?.exit(0);
    });
};
exports.Handler = Handler;
exports.default = Handler;
