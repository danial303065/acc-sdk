import { Helper } from "../utils";
import { Client, Context, ContextBuilder, ContractUtils, NormalSteps } from "acc-sdk-client-v2";
import fs from "fs";
import { Wallet } from "ethers";

async function main() {
    const shopInfos = JSON.parse(fs.readFileSync("./data/shop_infos.json", "utf8")).map(
        (m: { shopId: string; privateKey: string; name: string; currency: string }) => {
            return {
                shopId: m.shopId,
                wallet: new Wallet(m.privateKey),
                name: m.name,
                currency: m.currency,
            };
        }
    );
    for (const shopInfo of shopInfos) {
        const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, shopInfo.wallet.privateKey);
        if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
        if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
        const context: Context = new Context(contextParams);
        const client = new Client(context);
        console.log("상점 데이타를 추가합니다.");

        for await (const step of client.shop.add(shopInfo.shopId, shopInfo.name, shopInfo.currency)) {
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

        await ContractUtils.delay(1000);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
