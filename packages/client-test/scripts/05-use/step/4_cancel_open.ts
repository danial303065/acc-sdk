import { Helper } from "../../utils";

import { HTTPClient } from "../../../src/HttpClient";
import URI from "urijs";

import { Client, Context, ContextBuilder, ContextParams, NormalSteps } from "acc-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, userInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;

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
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

process.on("SIGINT", () => {});
