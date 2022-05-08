import fs    from "fs";
import http  from "http";
import https from "https";

import URI from "url";

import { TTY, Handler } from "./standard-input";

type Headers = { [$: string]: string };

interface Data {
    total: number;
    saved: number;

    file: {
        local: string
        mime: string
        size: number
    };

    response?: http.ServerResponse | http.IncomingMessage;
    request?: http.ClientRequest;
}

class Client {
    private readonly url: string;
    private readonly settings: URI.UrlObject;

    private headers?: Headers = {};

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
    private configuration = () => {
        return {
            ... {
                protocol: "https" + ":",
                port: 443,
                rejectUnauthorized: false,
                requestCert: true,
                followAllRedirects: true,
                encoding: "utf-8",
                agent: false,
                method: "GET",
                headers: {}
            }, ... URI.urlToHttpOptions( new URI.URL( this.url ) )
        };
    };

    /***
     * Initializer
     *
     * @param url
     * @param headers
     */

    constructor( url: string, headers: Headers = {}) {
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

    static stream = ( $: string ) => fs.createWriteStream( $ );

    /***
     * HTTP File Downloader
     *
     * @param target - The Target Location for the Downloaded File
     * @param progress {boolean} - Display Progress (Defaults to `true`)
     *
     * @returns {Promise<void>}
     *
     */

    public async download( target: string, progress: boolean = true ): Promise<void> {
        (progress) && (TTY) && Handler();

        const protocol = !this.url.charAt( 4 )
            .localeCompare( "s" ) ? https : http;
        const file = Client.stream( target );

        const data: Data = {
            total: 0, saved: 0, file: {
                local: String( file.path ),
                mime: "",
                size: 0
            }
        };

        const handler = ( complete = false ) => {
            const $ = Number.parseInt( String( data.saved / ( 1024 ^ 2 ) ) );
            const _ = Number.parseInt( String( data.total / ( 1024 ^ 2 ) ) );

            process.stdout.cursorTo( 0 );
            process.stdout.clearLine( 0 );
            process.stdout.write( "\r" );

            ( complete )
                ? process.stdout.write( _ + "/" + _ )
                : process.stdout.write( $ + "/" + _ );

            process.stdout.write( " " );

            ( complete )
                ? process.stdout.write( "100.00" + "%" )
                : process.stdout.write( Number( ( data.saved / data.total ) * 100 ).toFixed( 2 ) + "%" );
        };

        const $ = new Promise( ( resolve, reject ) => {
            const request = protocol.get( this.settings, response => {
                const headers = response.headers;
                const length = String( headers?.["Content-Length"] ?? headers?.["content-length"] ?? "0" );
                const type = String( headers?.["Content-Type"] ?? headers?.["content-type"] ?? "Application/Zip" );

                data.request = request;
                data.response = response;

                data.file = { local: target, mime: type, size: parseInt( length, 10 ) };

                ( response.statusCode !== 200 ) && reject( new Error( `Failed to get '${ this.settings }' (${ response.statusCode })` ) );

                response.on( "data", ( $ ) => {
                    /// --> Chunk
                    data.saved += $.length;

                    ( progress ) && handler();
                } );

                response.pipe( file );
            } );

            file.on( "finish", () => {
                resolve( data );
            } );

            request.on( "error", ( error ) => {
                fs.unlink( target, () => reject( error ) );
            } );

            request.on( "response", ( $ ) => {
                const length = String( $.headers?.["Content-Length"] ?? $.headers?.["content-length"] ?? "0" );

                data.total = Number.parseInt( length, 10 );
            } );

            file.on( "error", ( error ) => {
                fs.unlink( target, () => reject( error ) );
            } );

            request.end();
        } );

        return await $.then( () => {
            ( progress ) && handler( true );
            ( progress ) && process.stdout.write( "\n" );
        } );
    }
}

export { Client };

export default Client;