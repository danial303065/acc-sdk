import { Client, Context, ContextBuilder, ContextParams } from "acc-sdk-client-v2";
import { Helper } from "../utils";

const beautify = require("beautify");

async function main() {
    const contextParams: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, Helper.TEST_PK);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    console.log(beautify(JSON.stringify(contextParams), { format: "json" }));

    const context: Context = new Context(contextParams);
    const client = new Client(context);

    console.log((await client.ledger.relay.getEndpoint("/")).toString());
    const relayStatus = await client.ledger.relay.isUp();
    console.log(`relayStatus: ${relayStatus}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
