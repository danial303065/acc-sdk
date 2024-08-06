import { Helper } from "../utils";
import { Client, Context, ContextBuilder, NormalSteps } from "acc-sdk-client-v2";

async function main() {
    const shopInfo = Helper.loadShopInfo();
    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, shopInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const context: Context = new Context(contextParams);
    const client = new Client(context);
    console.log("상점 데이타를 추가합니다.");

    for await (const step of client.shop.add(shopInfo.shopId, "Shop New 10", "php")) {
        switch (step.key) {
            case NormalSteps.PREPARED:
                console.log("NormalSteps.PREPARED");
                break;
            case NormalSteps.SENT:
                console.log("NormalSteps.SENT");
                break;
            case NormalSteps.DONE:
                console.log("NormalSteps.DONE");
                break;
            default:
                throw new Error("Unexpected add shop step: " + JSON.stringify(step, null, 2));
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
