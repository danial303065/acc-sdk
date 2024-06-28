import { Helper } from "../utils";
import { Client, Context, ContextBuilder, NormalSteps } from "acc-sdk-client-v2";

async function main() {
    const userInfo = Helper.loadUserInfo();
    const context: Context = ContextBuilder.buildContext(Helper.NETWORK, userInfo.wallet.privateKey);
    const client = new Client(context);

    for await (const step of client.ledger.changeToPayablePoint(userInfo.phone)) {
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
                throw new Error("Unexpected change payable point step: " + JSON.stringify(step, null, 2));
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
