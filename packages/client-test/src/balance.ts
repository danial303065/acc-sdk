import { BOACoin } from "./utils/Amount";
import { Client, Context, ContextBuilder, ContextParams } from "acc-sdk-client-v2";
import { TestUtils } from "./utils/TestUtils";
import fs from "fs";

const beautify = require("beautify");

interface IUserData {
    idx: number;
    phone: string;
    address: string;
    privateKey: string;
    loyaltyType: number;
}

async function main() {
    const contextParams: ContextParams = ContextBuilder.buildContextParamsOfDevnet(TestUtils.TEST_PK);
    console.log(beautify(JSON.stringify(contextParams), { format: "json" }));

    const context: Context = ContextBuilder.buildContextOfDevnet(TestUtils.TEST_PK);
    const client = new Client(context);
    const users: IUserData[] = JSON.parse(fs.readFileSync("src/data/users.json", "utf8"));
    const user: IUserData = users[0];
    client.usePrivateKey(user.privateKey);

    for (let idx = 0; idx < 10; idx++) {
        const tokenBalance = new BOACoin(await client.ledger.getTokenBalance(user.address));
        const pointBalance = new BOACoin(await client.ledger.getPointBalance(user.address));
        console.log(`idx: ${idx}`);
        console.log(tokenBalance.toDisplayString(true, 4));
        console.log(pointBalance.toDisplayString(true, 4));
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
