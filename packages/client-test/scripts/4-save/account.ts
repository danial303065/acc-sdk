import { Helper } from "../utils";
import { INewPurchaseData, INewPurchaseDetails } from "../../src/types";
import { HTTPClient } from "../../src/HttpClient";
import URI from "urijs";

const beautify = require("beautify");

let purchaseSequence = 0;
function getPurchaseId(): string {
    const res =
        "P" +
        new Date()
            .getTime()
            .toString()
            .padStart(10, "0") +
        purchaseSequence.toString().padStart(5, "0");
    purchaseSequence++;
    return res;
}

async function main() {
    const userInfo = Helper.loadUserInfo();
    const shopInfo = Helper.loadShopInfo();

    const makeTransactions = async (): Promise<INewPurchaseData> => {
        const purchaseId = getPurchaseId();
        const details: INewPurchaseDetails[] = [
            {
                productId: "2020051310000000",
                amount: 10_000,
                providePercent: 10,
            },
        ];
        let totalAmount: number = 0;
        for (const elem of details) {
            totalAmount += elem.amount;
        }
        const cashAmount = totalAmount;

        const res: INewPurchaseData = {
            purchaseId,
            timestamp: Helper.getTimeStamp().toString(),
            totalAmount,
            cashAmount,
            currency: process.env.CURRENCY || "php",
            shopId: shopInfo.shopId,
            waiting: 0,
            userAccount: userInfo.wallet.address,
            userPhone: "",
            details,
        };
        return res;
    };

    console.log("파라메타를 생성합니다.");
    const tx = await makeTransactions();
    console.log(tx);

    console.log("구매정보를 전달합니다.");
    const client = new HTTPClient({
        headers: {
            Authorization: Helper.SAVE_ACCESS_KEY,
        },
    });

    const url = URI(Helper.SAVE_ENDPOINT)
        .directory("/v1/tx/purchase")
        .filename("new")
        .toString();
    const response = await client.post(url, tx);

    console.log("처리결과입니다.");
    console.log(response.data.code);
    console.log(beautify(JSON.stringify(response.data.data), { format: "json" }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
