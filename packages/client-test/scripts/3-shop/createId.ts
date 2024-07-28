import { ContractUtils, LoyaltyNetworkID } from "acc-sdk-client-v2";
import { Wallet } from "ethers";

async function main() {
    const wallet = Wallet.createRandom();
    const shopId = ContractUtils.getShopId(wallet.address, LoyaltyNetworkID.ACC_TESTNET);

    console.log("처리결과입니다.");
    console.log(`shopId: ${shopId}`);
    console.log(`address: ${wallet.address}`);
    console.log(`privateKey: ${wallet.privateKey}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
