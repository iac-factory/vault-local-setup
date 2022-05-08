import Process from "process";

const TTY = process.stdin.isTTY;

const Cursor = () => {
    const [ X, Y ] = Process.stdout.getWindowSize();

    const buffer = " ".repeat( process?.stdout?.columns );

    Process.stdout.cursorTo( 0, Y );
    Process.stdout.clearLine( 0 );
    process?.stdout?.write( buffer );

    process?.stdout.cursorTo( 0, process?.stdout?.rows );
    process?.stdout?.write( "\u001B[?25h" );

    Process.stdout.emit( "drain" );
};

const Handler = () => {
    Process.stdout?.write( "\u001B[?25l" + "\r" );

    Process.stdin?.on( "data", ( $ ) => {
        /// CTRL + C
        /// @ts-ignore
        Buffer.from( [ 0x3 ], "hex" )
            .equals( $ ) && process?.exit( 0 );

        /// CTRL + D
        /// @ts-ignore
        Buffer.from( [ 0x4 ], "hex" )
            .equals( $ ) && process?.exit( 0 );

        /// CTRL + Z
        /// @ts-ignore
        Buffer.from( [ 0x1a ], "hex" )
            .equals( $ ) && process?.exit( 0 );
    } );
};

export { Handler, Cursor, TTY };

export default Handler;
