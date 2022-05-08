import fs from "fs";
declare type Headers = {
    [$: string]: string;
};
declare class Client {
    private readonly url;
    private readonly settings;
    private headers?;
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
    private configuration;
    /***
     * Initializer
     *
     * @param url
     * @param headers
     */
    constructor(url: string, headers?: Headers);
    /***
     *
     * @param $ {PathLike | string}
     *
     * @returns {WriteStream}
     *
     */
    static stream: ($: string) => fs.WriteStream;
    /***
     * HTTP File Downloader
     *
     * @param target - The Target Location for the Downloaded File
     * @param progress {boolean} - Display Progress (Defaults to `true`)
     *
     * @returns {Promise<void>}
     *
     */
    download(target: string, progress?: boolean): Promise<void>;
}
export { Client };
export default Client;
//# sourceMappingURL=download.d.ts.map