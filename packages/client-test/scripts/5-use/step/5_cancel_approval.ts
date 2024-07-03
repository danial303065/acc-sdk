import { Helper } from "../../utils";

import { HTTPClient } from "../../../src/HttpClient";
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

    const paymentId = Helper.getPaymentId();

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
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
