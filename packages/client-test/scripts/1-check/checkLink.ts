import { Client, Context, ContextBuilder, ContextParams } from "acc-sdk-client-v2";
import { Helper } from "../utils";

const beautify = require("beautify");

async function main() {
    const contextParams: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, Helper.TEST_PK);
    console.log(beautify(JSON.stringify(contextParams), { format: "json" }));

    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, Helper.TEST_PK);
    const client = new Client(context);

    console.log((await client.link.getEndpoint("/")).toString());
    const status = await client.link.isUp();
    console.log(`phone link Status: ${status}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
