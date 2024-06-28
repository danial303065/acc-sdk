import { Helper } from "../utils";

import { HTTPClient } from "../../src/HttpClient";
import { Amount } from "../../src/Amount";
import URI from "urijs";

import { Client, Context, ContextBuilder, ContextParams, NormalSteps } from "acc-sdk-client-v2";
import assert from "assert";

const beautify = require("beautify");

async function main() {
    const userInfo = Helper.loadUserInfo();
    const shopInfo = Helper.loadShopInfo();
    const contextParams: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, userInfo.wallet.privateKey);
    const client = new Client(context);

    const paymentId = Helper.getPaymentId();

    const httpClient = new HTTPClient({
        headers: {
            Authorization: Helper.RELAY_ACCESS_KEY,
        },
    });

    // Open New
    console.log("Open Cancel");
    const url1 = URI(contextParams.relayEndpoint)
        .directory("/v1/payment/cancel")
        .filename("open")
        .toString();
    const params1 = {
        paymentId,
    };
    const response1 = await httpClient.post(url1, params1);
    if (response1.data.code !== 0) {
        console.error("Error!", response1.data.error.message);
        process.exit(response1.data.code);
    }

    await Helper.delay(1000);

    let detail = await client.ledger.getPaymentDetail(paymentId);

    // Approve New
    console.log("Approve Cancel");
    client.usePrivateKey(shopInfo.wallet.privateKey);
    for await (const step of client.ledger.approveCancelPayment(paymentId, detail.purchaseId, true)) {
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

    // Close Cancel
    console.log("Close New");
    const url2 = URI(contextParams.relayEndpoint)
        .directory("/v1/payment/cancel")
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
