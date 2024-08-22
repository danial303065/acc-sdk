import { Helper } from "../../utils";

import { HTTPClient } from "../../../src/HttpClient";
import { Amount } from "../../../src/Amount";
import URI from "urijs";

import { Client, Context, ContextBuilder, ContextParams, NormalSteps } from "acc-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const shopInfo = Helper.loadShopInfo();
    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const context: Context = new Context(contextParams);
    const client = new Client(context);

    const httpClient = new HTTPClient({
        headers: {
            Authorization: Helper.RELAY_ACCESS_KEY,
        },
    });

    const purchase = {
        purchaseId: Helper.getPurchaseId(),
        timestamp: 1672844400,
        amount: 100,
        method: 0,
        currency: "php",
        shopIndex: 0,
        userIndex: 0,
    };
    const amount = Amount.make(purchase.amount, 18);

    // Create temporary account
    console.log("Create temporary account");
    const temporaryAccount = await client.ledger.getTemporaryAccount();
    console.log(`temporaryAccount: ${temporaryAccount}`);

    // Open New
    console.log("Open New");
    const url1 = URI(contextParams.relayEndpoint)
        .directory("/v1/payment/new")
        .filename("open")
        .toString();
    const params1 = {
        purchaseId: purchase.purchaseId,
        amount: amount.toString(),
        currency: purchase.currency.toLowerCase(),
        shopId: shopInfo.shopId,
        account: temporaryAccount,
    };
    const response1 = await httpClient.post(url1, params1);
    if (response1.data.code !== 0) {
        console.error("Error!", response1.data.error.message);
        process.exit(response1.data.code);
    }

    const paymentId = response1.data.data.paymentId;
    Helper.setPaymentId(paymentId);
    console.log(`paymentId: ${paymentId}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
