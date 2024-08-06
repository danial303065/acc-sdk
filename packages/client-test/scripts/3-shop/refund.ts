import { Helper } from "../utils";
import { Amount, Client, Context, ContextBuilder, NormalSteps } from "acc-sdk-client-v2";
import { BOACoin } from "../../src/Amount";
import { BigNumber } from "@ethersproject/bignumber";

const beautify = require("beautify");

async function main() {
    const shopInfo = Helper.loadShopInfo();
    console.log(`shopId: ${shopInfo.shopId}`);
    console.log(`wallet.address: ${shopInfo.wallet.address}`);

    const contextParams = ContextBuilder.buildContextParams(Helper.NETWORK, shopInfo.wallet.privateKey);
    if (Helper.RELAY_ENDPOINT !== "") contextParams.relayEndpoint = Helper.RELAY_ENDPOINT;
    if (Helper.WEB3_ENDPOINT !== "") contextParams.web3Provider = Helper.WEB3_ENDPOINT;
    const context: Context = new Context(contextParams);
    const client = new Client(context);

    console.log("상점 정보를 요청합니다.");
    const info = await client.shop.getShopInfo(shopInfo.shopId);
    const refundable = await client.shop.getRefundableAmount(shopInfo.shopId);

    console.log("처리결과입니다.");
    console.log(`shopId: ${info.shopId}`);
    console.log(`name: ${info.name}`);
    console.log(`currency: ${info.currency}`);
    console.log(`account: ${info.account}`);
    console.log(`delegator: ${info.delegator}`);
    console.log(`providedAmount: ${new BOACoin(info.providedAmount).toDisplayString(true, 2)}`);
    console.log(`usedAmount: ${new BOACoin(info.usedAmount).toDisplayString(true, 2)}`);
    console.log(`refundedAmount: ${new BOACoin(info.refundedAmount).toDisplayString(true, 2)}`);
    console.log(`refundableAmount: ${new BOACoin(refundable.refundableAmount).toDisplayString(true, 2)}`);

    if (refundable.refundableAmount.gt(BigNumber.from(0))) {
        for await (const step of client.shop.refund(shopInfo.shopId, refundable.refundableAmount)) {
            switch (step.key) {
                case NormalSteps.PREPARED:
                    console.log(`NormalSteps.PREPARED`);
                    console.log(`step.shopId: ${step.shopId}`);
                    console.log(`step.signature: ${step.signature}`);
                    break;
                case NormalSteps.SENT:
                    console.log(`NormalSteps.SENT`);
                    console.log(`step.txHash: ${step.txHash}`);
                    break;
                case NormalSteps.DONE:
                    console.log(`NormalSteps.DONE`);
                    console.log(`step.refundAmount: ${step.refundAmount.toString()}`);
                    break;
                default:
                    throw new Error("Unexpected open withdrawal step: " + JSON.stringify(step, null, 2));
            }
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
