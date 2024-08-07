import { Client, Context, ContextBuilder, ContextParams } from "acc-sdk-client-v2";
import { Helper } from "../utils";
import { HTTPClient } from "../../src/HttpClient";
import URI from "urijs";

const beautify = require("beautify");

async function main() {
    const contextParams: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, Helper.TEST_PK);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const userInfo = Helper.loadUserInfo();

    const client = new HTTPClient();
    const url = URI(contextParams.relayEndpoint)
        .directory(`/v1/ledger/history/phone`)
        .filename(userInfo.phone)
        .addQuery("pageNumber", 1)
        .addQuery("pageSize", 100)
        .addQuery("actions", "1,2,3,11,12,21,22,23")
        .toString();
    const response = await client.get(url);
    if (response.data.code !== 0) {
        console.error("Error!", response.data.error.message);
        process.exit(response.data.code);
    }

    console.log("처리결과입니다.");
    console.log(response.data.code);
    console.log(beautify(JSON.stringify(response.data.data), { format: "json" }));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
