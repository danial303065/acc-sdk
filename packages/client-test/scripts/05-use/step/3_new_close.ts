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

    const httpClient = new HTTPClient({
        headers: {
            Authorization: Helper.RELAY_ACCESS_KEY,
        },
    });

    const paymentId = Helper.getPaymentId();

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
