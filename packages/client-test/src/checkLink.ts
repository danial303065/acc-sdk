import { TestUtils } from "./utils/TestUtils";
import { Client, Context, ContextBuilder, ContextParams } from "acc-sdk-client-v2";

async function TestOfTestnet() {
    const context: Context = ContextBuilder.buildContextOfTestnet(TestUtils.TEST_PK);
    const client = new Client(context);

    //  console.log((await client.link.getEndpoint("/")).toString());
    const status = await client.link.isUp();
    console.log(`phone link Status: ${status}`);
}

async function TestOfDevnet() {
    const context: Context = ContextBuilder.buildContextOfDevnet(TestUtils.TEST_PK);
    const client = new Client(context);

    console.log((await client.link.getEndpoint("/")).toString());
    const status = await client.link.isUp();
    console.log(`phone link Status: ${status}`);
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
