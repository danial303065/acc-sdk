import { BOACoin } from "../../src/Amount";
import { Client, Context, ContextBuilder } from "acc-sdk-client-v2";
import { Helper } from "../utils";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const context: Context = new Context(contextParams);
    const client = new Client(context);

    const balance = new BOACoin(await client.ledger.getPointBalance(userInfo.wallet.address));
    console.log(`account : ${userInfo.wallet.address}`);
    console.log(`phone : ${userInfo.phone}`);
    console.log(`point balance : ${balance.toDisplayString(true, 2)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
