import { HTTPClient } from "../../src/HttpClient";
import { Helper } from "../utils";
import URI from "urijs";
import { ContextBuilder, ContextParams } from "acc-sdk-client-v2";

const beautify = require("beautify");

async function main() {
    const contextParams: ContextParams = ContextBuilder.buildContextParams(Helper.NETWORK, Helper.TEST_PK);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const shopInfo = Helper.loadShopInfo();

    const client = new HTTPClient();
    const url = URI(contextParams.relayEndpoint)
        .directory("/v1/purchase/shop/provide/")
        .filename(shopInfo.shopId)
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
