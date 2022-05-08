#!/usr/bin/env ts-node

import FS         from "fs";
import Path       from "path";
import Utility    from "util";
import Subprocess from "child_process";

import { Client, Handler, Cursor, Prompt } from "./src";

(async () => {
    const VERSION = "1.9.4";

    const client = new Client(["https://releases.hashicorp.com/vault", VERSION, `vault_${VERSION}_darwin_amd64.zip`].join("/"));
    const remove = Utility.promisify(FS.rm);

    Handler();

    await client.download(Path.join(__dirname, "Vault.zip"))

    Subprocess.execSync(["unzip", Path.resolve(__dirname, "Vault.zip")].join(" "), { stdio: "inherit" });

    await remove(Path.join(__dirname, "Vault.zip"))

    Cursor();

    const password = await Prompt("Vault Token: ");

    Subprocess.execSync(Path.resolve(__dirname, "vault") + " " + `server -dev -dev-root-token-id="${password}"`, { stdio: "inherit" });
})();

export {};

export default {};
