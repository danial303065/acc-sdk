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

    for (let idx = 0; idx < 10; idx++) {
        const user: IUserData = users[idx];
        const balance = await client.ledger.getBalanceOfLedger(user.address);
        console.log(`idx: ${idx}`);
        console.log(`account: ${balance.account}`);
        console.log(`point.balance: ${new BOACoin(balance.point.balance).toDisplayString(true, 4)}`);
        console.log(`point.value: ${new BOACoin(balance.point.value).toDisplayString(true, 4)}`);
        console.log(`token.balance: ${new BOACoin(balance.token.balance).toDisplayString(true, 4)}`);
        console.log(`token.value: ${new BOACoin(balance.token.value).toDisplayString(true, 4)}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
