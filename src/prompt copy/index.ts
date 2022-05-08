/***
 * @name        cli-prompt
 * @package     @cloud-vault
 * @summary     ESM-based CLI Prompt
 *
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Utility from "util";
import Input from "readline";
import Process from "process";

/***
 * User Input Prompt
 *
 * @returns {Promise<String>}
 *
 * @constructor
 *
 * @param preface
 */

const Prompt = (preface: string) => {
    return new Promise(async (resolve, reject) => {
        let $;

        const Interface = Input.createInterface({
            input: Process.openStdin(),
            output: Process.stdout
        });

        const prompt = Utility.promisify(Interface.question).bind(Interface);

        try {
            $ = await prompt(preface);
        } catch ( _ ) { reject(_); }
        finally { Interface.close(); }

        resolve($);
    });
};

export { Prompt };

export default Prompt;
