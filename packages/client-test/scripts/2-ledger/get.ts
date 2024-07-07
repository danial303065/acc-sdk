import { Helper } from "../utils";
import { BOACoin } from "../../src/Amount";
import { Client, Context, ContextBuilder } from "acc-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const context: Context = new Context(contextParams);
    const client = new Client(context);

    const balance = await client.ledger.getAccountBalances(userInfo.wallet.address);
    console.log(`- account: ${balance.account}`);
    console.log(`- tokenInfo`);
    console.log(`   - symbol: ${balance.tokenInfo.symbol}`);
    console.log(`   - name: ${balance.tokenInfo.name}`);
    console.log(`   - decimals: ${balance.tokenInfo.decimals}`);

    console.log(`- exchangeRate`);
    console.log(`   - token: ${new BOACoin(balance.exchangeRate.token).toDisplayString(true, 4)}`);
    console.log(`   - point: ${new BOACoin(balance.exchangeRate.point).toDisplayString(true, 4)}`);

    console.log(`- ledger`);
    console.log(`   - point.balance: ${new BOACoin(balance.ledger.point.balance).toDisplayString(true, 4)}`);
    console.log(`   - point.value: ${new BOACoin(balance.ledger.point.value).toDisplayString(true, 4)}`);
    console.log(`   - token.balance: ${new BOACoin(balance.ledger.token.balance).toDisplayString(true, 4)}`);
    console.log(`   - token.value: ${new BOACoin(balance.ledger.token.value).toDisplayString(true, 4)}`);

    console.log(`- mainChain`);
    console.log(`   - point.balance: ${new BOACoin(balance.mainChain.point.balance).toDisplayString(true, 4)}`);
    console.log(`   - point.value: ${new BOACoin(balance.mainChain.point.value).toDisplayString(true, 4)}`);
    console.log(`   - token.balance: ${new BOACoin(balance.mainChain.token.balance).toDisplayString(true, 4)}`);
    console.log(`   - token.value: ${new BOACoin(balance.mainChain.token.value).toDisplayString(true, 4)}`);

    console.log(`- sideChain`);
    console.log(`   - point.balance: ${new BOACoin(balance.sideChain.point.balance).toDisplayString(true, 4)}`);
    console.log(`   - point.value: ${new BOACoin(balance.sideChain.point.value).toDisplayString(true, 4)}`);
    console.log(`   - token.balance: ${new BOACoin(balance.sideChain.token.balance).toDisplayString(true, 4)}`);
    console.log(`   - token.value: ${new BOACoin(balance.sideChain.token.value).toDisplayString(true, 4)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
