import { Helper } from "../utils";

import { HTTPClient } from "../../src/HttpClient";
import { Amount } from "../../src/Amount";
import URI from "urijs";

import { Client, Context, ContextBuilder, ContextParams, NormalSteps } from "acc-sdk-client-v2";
import assert from "assert";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const shopInfo = Helper.loadShopInfo();
    const contextParams: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, userInfo.wallet.privateKey);
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

    await Helper.delay(1000);

    let detail = await client.ledger.getPaymentDetail(paymentId);

    // Approve New
    console.log("Approve New");
    client.usePrivateKey(userInfo.wallet.privateKey);
    for await (const step of client.ledger.approveNewPayment(
        paymentId,
        detail.purchaseId,
        amount.value,
        detail.currency.toLowerCase(),
        detail.shopId,
        true
    )) {
        switch (step.key) {
            case NormalSteps.PREPARED:
                console.log("NormalSteps.PREPARED");
                break;
            case NormalSteps.SENT:
                console.log("NormalSteps.SENT");
                break;
            case NormalSteps.APPROVED:
                console.log("NormalSteps.APPROVED");
                break;
            default:
                throw new Error("Unexpected pay point step: " + JSON.stringify(step, null, 2));
        }
    }

    await Helper.delay(3000);

    // Close New
    console.log("Close New");
    const url2 = URI(contextParams.relayEndpoint)
        .directory("/v1/payment/new")
        .filename("close")
        .toString();
    const params2 = {
        confirm: true,
        paymentId,
    };
    const response2 = await httpClient.post(url2, params2);
    if (response2.data.code !== 0) {
        console.error("Error!", response2.data.error.message);
        process.exit(response2.data.code);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
