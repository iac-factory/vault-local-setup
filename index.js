"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./download"), exports);
__exportStar(require("./standard-input"), exports);
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const child_process_1 = __importDefault(require("child_process"));
const src_1 = require("./src");
(async () => {
    const VERSION = "1.9.4";
    const client = new src_1.Client(["https://releases.hashicorp.com/vault", VERSION, `vault_${VERSION}_darwin_amd64.zip`].join("/"));
    const remove = util_1.default.promisify(fs_1.default.rm);
    (0, src_1.Handler)();
    await client.download(path_1.default.join(__dirname, "Vault.zip"));
    child_process_1.default.execSync(["unzip", path_1.default.resolve(__dirname, "Vault.zip")].join(" "), { stdio: "inherit" });
    await remove(path_1.default.join(__dirname, "Vault.zip"));
    (0, src_1.Cursor)();
    const password = await (0, src_1.Prompt)("Vault Token: ");
    child_process_1.default.execSync(path_1.default.resolve(__dirname, "vault") + " " + `server -dev -dev-root-token-id="${password}"`, { stdio: "inherit" });
})();
exports.default = {};
