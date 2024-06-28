import { Helper } from "../utils";
import { BOACoin } from "../../src/Amount";
import { Client, Context, ContextBuilder } from "acc-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, userInfo.wallet.privateKey);
    const client = new Client(context);

    const balance = new BOACoin(await client.ledger.getTokenBalance(userInfo.wallet.address));
    console.log(`account : ${userInfo.wallet.address}`);
    console.log(`phone : ${userInfo.phone}`);
    console.log(`token balance : ${balance.toDisplayString(true, 2)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
