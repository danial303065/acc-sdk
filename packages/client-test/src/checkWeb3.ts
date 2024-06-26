import { TestUtils } from "./utils/TestUtils";
import { Client, Context, ContextBuilder, ContextParams } from "acc-sdk-client-v2";

const beautify = require("beautify");

async function TestOfTestnet() {
    const contextParams: ContextParams = ContextBuilder.buildContextParamsOfTestnet(TestUtils.TEST_PK);
    console.log(beautify(JSON.stringify(contextParams), { format: "json" }));

    const context: Context = ContextBuilder.buildContextOfTestnet(TestUtils.TEST_PK);
    const client = new Client(context);

    const web3Status = await client.web3.isUp();
    console.log(`web3Status: ${web3Status}`);
}

async function TestOfDevnet() {
    const contextParams: ContextParams = ContextBuilder.buildContextParamsOfDevnet(TestUtils.TEST_PK);
    console.log(beautify(JSON.stringify(contextParams), { format: "json" }));

    const context: Context = ContextBuilder.buildContextOfDevnet(TestUtils.TEST_PK);
    const client = new Client(context);

    const web3Status = await client.web3.isUp();
    console.log(`web3Status: ${web3Status}`);
}

async function main() {
    await TestOfTestnet();
    await TestOfDevnet();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});