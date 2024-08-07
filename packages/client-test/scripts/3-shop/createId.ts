import { ContractUtils, LoyaltyNetworkID } from "acc-sdk-client-v2";
import { Wallet } from "ethers";
import { Helper } from "../utils";

async function main() {
    const wallet = Wallet.createRandom();
    let shopId = "";

    if (Helper.NETWORK === "acc_mainnet") {
        ContractUtils.getShopId(wallet.address, LoyaltyNetworkID.ACC_MAINNET);
    } else if (Helper.NETWORK === "acc_testnet") {
        ContractUtils.getShopId(wallet.address, LoyaltyNetworkID.ACC_TESTNET);
    } else {
        ContractUtils.getShopId(wallet.address, LoyaltyNetworkID.ACC_TESTNET);
    }

    console.log("처리결과입니다.");
    console.log(`shopId: ${shopId}`);
    console.log(`address: ${wallet.address}`);
    console.log(`privateKey: ${wallet.privateKey}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
