"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const url_1 = __importDefault(require("url"));
const standard_input_1 = require("./standard-input");
class Client {
    url;
    settings;
    headers = {};
    /***
     * URL-Object
     * ---
     *
     * HTTP Request Configuration Generator
     *
     * @constructor
     * @returns {{headers: {} | OutgoingHttpHeaders | undefined, setHost?: boolean | undefined, lookup?: LookupFunction | undefined, agent: boolean | Agent | undefined, socketPath?: string | undefined, method: string | undefined, auth?:
     *     string | null | undefined, createConnection?: ((options: ClientRequestArgs, oncreate: (err: Error, socket: Socket) => void) => Socket) | undefined, encoding: string, timeout?: number | undefined, maxHeaderSize?: number |
     *     undefined, rejectUnauthorized: boolean, defaultPort?: number | string | undefined, path?: string | null | undefined, protocol: string | null | undefined, hostname?: string | null | undefined, _defaultAgent?: Agent | undefined,
     *     port: number | string | null | undefined, requestCert: boolean, localAddress?: string | undefined, host?: string | null | undefined, family?: number | undefined, followAllRedirects: boolean, signal?: AbortSignal | undefined}}
     *
     */
    configuration = () => {
        return {
            ...{
                protocol: "https" + ":",
                port: 443,
                rejectUnauthorized: false,
                requestCert: true,
                followAllRedirects: true,
                encoding: "utf-8",
                agent: false,
                method: "GET",
                headers: {}
            }, ...url_1.default.urlToHttpOptions(new url_1.default.URL(this.url))
        };
    };
    /***
     * Initializer
     *
     * @param url
     * @param headers
     */
    constructor(url, headers = {}) {
        this.url = url;
        this.headers = headers;
        this.settings = this.configuration();
    }
    /***
     *
     * @param $ {PathLike | string}
     *
     * @returns {WriteStream}
     *
     */
    static stream = ($) => fs_1.default.createWriteStream($);
    /***
     * HTTP File Downloader
     *
     * @param target - The Target Location for the Downloaded File
     * @param progress {boolean} - Display Progress (Defaults to `true`)
     *
     * @returns {Promise<void>}
     *
     */
    async download(target, progress = true) {
        (progress) && (standard_input_1.TTY) && (0, standard_input_1.Handler)();
        const protocol = !this.url.charAt(4)
            .localeCompare("s") ? https_1.default : http_1.default;
        const file = Client.stream(target);
        const data = {
            total: 0, saved: 0, file: {
                local: String(file.path),
                mime: "",
                size: 0
            }
        };
        const handler = (complete = false) => {
            const $ = Number.parseInt(String(data.saved / (1024 ^ 2)));
            const _ = Number.parseInt(String(data.total / (1024 ^ 2)));
            process.stdout.cursorTo(0);
            process.stdout.clearLine(0);
            process.stdout.write("\r");
            (complete)
                ? process.stdout.write(_ + "/" + _)
                : process.stdout.write($ + "/" + _);
            process.stdout.write(" ");
            (complete)
                ? process.stdout.write("100.00" + "%")
                : process.stdout.write(Number((data.saved / data.total) * 100).toFixed(2) + "%");
        };
        const $ = new Promise((resolve, reject) => {
            const request = protocol.get(this.settings, response => {
                const headers = response.headers;
                const length = String(headers?.["Content-Length"] ?? headers?.["content-length"] ?? "0");
                const type = String(headers?.["Content-Type"] ?? headers?.["content-type"] ?? "Application/Zip");
                data.request = request;
                data.response = response;
                data.file = { local: target, mime: type, size: parseInt(length, 10) };
                (response.statusCode !== 200) && reject(new Error(`Failed to get '${this.settings}' (${response.statusCode})`));
                response.on("data", ($) => {
                    /// --> Chunk
                    data.saved += $.length;
                    (progress) && handler();
                });
                response.pipe(file);
            });
            file.on("finish", () => {
                resolve(data);
            });
            request.on("error", (error) => {
                fs_1.default.unlink(target, () => reject(error));
            });
            request.on("response", ($) => {
                const length = String($.headers?.["Content-Length"] ?? $.headers?.["content-length"] ?? "0");
                data.total = Number.parseInt(length, 10);
            });
            file.on("error", (error) => {
                fs_1.default.unlink(target, () => reject(error));
            });
            request.end();
        });
        return await $.then(() => {
            (progress) && handler(true);
            (progress) && process.stdout.write("\n");
        });
    }
}
exports.Client = Client;
exports.default = Client;
