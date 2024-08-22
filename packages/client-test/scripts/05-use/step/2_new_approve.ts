import { Helper } from "../../utils";

import { HTTPClient } from "../../../src/HttpClient";
import { Amount } from "../../../src/Amount";
import URI from "urijs";

import { Client, Context, ContextBuilder, ContextParams, NormalSteps } from "acc-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
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

    const paymentId = Helper.getPaymentId();
    let detail = await client.ledger.getPaymentDetail(paymentId);

    // Approve New
    console.log("Approve New");
    client.usePrivateKey(userInfo.wallet.privateKey);
    for await (const step of client.ledger.approveNewPayment(
        paymentId,
        detail.purchaseId,
        detail.amount,
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
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
