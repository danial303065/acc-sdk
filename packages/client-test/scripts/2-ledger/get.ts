import { Helper } from "../utils";
import { BOACoin } from "../../src/Amount";
import { Client, Context, ContextBuilder } from "acc-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, userInfo.wallet.privateKey);
    const client = new Client(context);

    const balance = await client.ledger.getBalanceOfLedger(userInfo.wallet.address);
    console.log(`account: ${balance.account}`);
    console.log(`phone : ${userInfo.phone}`);
    console.log(`point.balance: ${new BOACoin(balance.point.balance).toDisplayString(true, 4)}`);
    console.log(`point.value: ${new BOACoin(balance.point.value).toDisplayString(true, 4)}`);
    console.log(`token.balance: ${new BOACoin(balance.token.balance).toDisplayString(true, 4)}`);
    console.log(`token.value: ${new BOACoin(balance.token.value).toDisplayString(true, 4)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
