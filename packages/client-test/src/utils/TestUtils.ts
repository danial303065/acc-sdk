global.XMLHttpRequest = require("xhr2");

export class TestUtils {
    static RELAY_ACCESS_KEY = "0x2c93e943c0d7f6f1a42f53e116c52c40fe5c1b428506dc04b290f2a77580a342";
    static TEST_PK = "0xd09672244a06a32f74d051e5adbbb62ae0eda27832a973159d475da6d53ba5c0";
    static purchaseId = 0;
    public static getPurchaseId(): string {
        const randomIdx = Math.floor(Math.random() * 1000);
        const res = "P" + TestUtils.purchaseId.toString().padStart(10, "0") + randomIdx.toString().padStart(4, "0");
        TestUtils.purchaseId++;
        return res;
    }
    public static delay(interval: number): Promise<void> {
        return new Promise<void>((resolve, _) => {
            setTimeout(resolve, interval);
        });
    }
}
