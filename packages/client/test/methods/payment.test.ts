import { Amount, Client, Context, ContractUtils, NormalSteps } from "../../src";
import { Wallet } from "@ethersproject/wallet";
import { Network } from "../../src/client-common/interfaces/network";
import { NodeInfo } from "../helper/NodeInfo";

import * as assert from "assert";
// @ts-ignore
import fs from "fs";

interface IUserData {
    idx: number;
    phone: string;
    address: string;
    privateKey: string;
    loyaltyType: number;
}

export interface IShopData {
    shopId: string;
    name: string;
    currency: string;
    address: string;
    privateKey: string;
}

describe("Ledger", () => {
    const contextParams = NodeInfo.getContextParams();
    // const contractInfo = NodeInfo.getContractInfo();
    // const accounts = NodeInfo.accounts();
    // const validatorWallets = [
    //     accounts[AccountIndex.VALIDATOR01],
    //     accounts[AccountIndex.VALIDATOR02],
    //     accounts[AccountIndex.VALIDATOR03],
    //     accounts[AccountIndex.VALIDATOR04],
    //     accounts[AccountIndex.VALIDATOR05],
    //     accounts[AccountIndex.VALIDATOR06],
    //     accounts[AccountIndex.VALIDATOR07],
    //     accounts[AccountIndex.VALIDATOR08],
    //     accounts[AccountIndex.VALIDATOR09],
    //     accounts[AccountIndex.VALIDATOR10],
    //     accounts[AccountIndex.VALIDATOR11],
    //     accounts[AccountIndex.VALIDATOR12],
    //     accounts[AccountIndex.VALIDATOR13],
    //     accounts[AccountIndex.VALIDATOR14],
    //     accounts[AccountIndex.VALIDATOR15],
    //     accounts[AccountIndex.VALIDATOR16]
    // ];

    let client: Client;
    const users: IUserData[] = JSON.parse(fs.readFileSync("test/helper/users.json", "utf8"));
    const shopData: IShopData[] = JSON.parse(fs.readFileSync("test/helper/shops.json", "utf8"));
    let user = new Wallet(users[0].privateKey);

    beforeAll(async () => {
        contextParams.privateKey = user.privateKey;
        const ctx = new Context(contextParams);
        client = new Client(ctx);
    });

    it("Web3 Health Checking", async () => {
        const isUp = await client.link.web3.isUp();
        expect(isUp).toEqual(true);
    });

    it("Server Health Checking", async () => {
        const isUp = await client.ledger.relay.isUp();
        expect(isUp).toEqual(true);
    });
    //
    // it("Set Exchange Rate", async () => {
    //     await NodeInfo.setExchangeRate(contractInfo.currencyRate, validatorWallets);
    // });
    //
    // it("Save Purchase Data 1", async () => {
    //     const purchaseAmount = Amount.make(100_000_000, 18).value;
    //     const loyaltyAmount = purchaseAmount.mul(5).div(100);
    //     const phoneHash = ContractUtils.getPhoneHash("");
    //     const purchaseParams = {
    //         purchaseId: NodeInfo.getPurchaseId(),
    //         amount: purchaseAmount,
    //         loyalty: loyaltyAmount,
    //         currency: "php",
    //         shopId: shopData[0].shopId,
    //         account: user.address,
    //         phone: phoneHash,
    //         sender: await accounts[AccountIndex.FOUNDATION].getAddress()
    //     };
    //     const purchaseMessage = ContractUtils.getPurchasesMessage(0, [purchaseParams], NodeInfo.CHAIN_ID);
    //     const signatures = await Promise.all(validatorWallets.map((m) => ContractUtils.signMessage(m, purchaseMessage)));
    //     const proposeMessage = ContractUtils.getPurchasesProposeMessage(0, [purchaseParams], signatures, NodeInfo.CHAIN_ID);
    //     const proposerSignature = await ContractUtils.signMessage(validatorWallets[0], proposeMessage);
    //     await contractInfo.loyaltyProvider.connect(validatorWallets[4]).savePurchase(0, [purchaseParams], signatures, proposerSignature);
    //
    //     const balance = await client.ledger.getPointBalance(user.address);
    //     console.log(`balance: ${new Amount(balance).toBOAString()}`);
    // });

    it("Test for payment", async () => {
        for (let idx = 0; idx < 10; idx++) {
            console.log(`idx: ${idx}`);
            const oldBalance = await client.ledger.getPointBalance(user.address);
            const purchase = {
                purchaseId: NodeInfo.getPurchaseId(),
                timestamp: 1672844400,
                amount: 100,
                method: 0,
                currency: "php",
                shopIndex: 0,
                userIndex: 0
            };
            const amount = Amount.make(purchase.amount, 18);

            const feeRate = await client.ledger.getFeeRate();
            const paidPoint = await client.currency.currencyToPoint(amount.value, purchase.currency);
            const feePoint = await client.currency.currencyToPoint(
                amount.value.mul(feeRate).div(10000),
                purchase.currency
            );

            // Open New
            console.log("Open New");
            let res = await Network.post(
                new URL(contextParams.relayEndpoint + "v1/payment/new/open"),
                {
                    purchaseId: purchase.purchaseId,
                    amount: amount.toString(),
                    currency: purchase.currency.toLowerCase(),
                    shopId: shopData[purchase.shopIndex].shopId,
                    account: user.address
                },
                {
                    Authorization: NodeInfo.RELAY_ACCESS_KEY
                }
            );
            if (res.code !== 0) {
                console.error(res.error.message);
                process.exit(res.code);
            }

            const paymentId = res.data.paymentId;
            console.log(paymentId);

            await ContractUtils.delay(1000);

            let detail = await client.ledger.getPaymentDetail(paymentId);

            // Approve New
            console.log("Approve New");
            client.usePrivateKey(user.privateKey);
            for await (const step of client.ledger.approveNewPayment(
                paymentId,
                detail.purchaseId,
                amount.value,
                detail.currency.toLowerCase(),
                detail.shopId,
                true
            )) {
                switch (step.key) {
                    case NormalSteps.PREPARED:
                        console.log("NormalSteps.PREPARED");
                        expect(step.paymentId).toEqual(paymentId);
                        expect(step.purchaseId).toEqual(detail.purchaseId);
                        expect(step.amount).toEqual(amount.value);
                        expect(step.currency).toEqual(detail.currency.toLowerCase());
                        expect(step.shopId).toEqual(detail.shopId);
                        expect(step.account).toEqual(user.address);
                        expect(step.signature).toMatch(/^0x[A-Fa-f0-9]{130}$/i);
                        break;
                    case NormalSteps.SENT:
                        console.log("NormalSteps.SENT");
                        expect(step.paymentId).toEqual(paymentId);
                        expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                        break;
                    case NormalSteps.APPROVED:
                        console.log("NormalSteps.APPROVED");
                        expect(step.paymentId).toEqual(paymentId);
                        expect(step.purchaseId).toEqual(detail.purchaseId);
                        expect(step.currency).toEqual(detail.currency.toLowerCase());
                        expect(step.shopId).toEqual(detail.shopId);
                        expect(step.paidPoint).toEqual(paidPoint);
                        expect(step.feePoint).toEqual(feePoint);
                        break;
                    default:
                        throw new Error("Unexpected pay point step: " + JSON.stringify(step, null, 2));
                }
            }

            await ContractUtils.delay(3000);

            // Close New
            console.log("Close New");
            res = await Network.post(
                new URL(contextParams.relayEndpoint + "v1/payment/new/close"),
                {
                    confirm: true,
                    paymentId
                },
                {
                    Authorization: NodeInfo.RELAY_ACCESS_KEY
                }
            );
            assert.deepStrictEqual(res.code, 0);

            await ContractUtils.delay(2000);

            assert.deepStrictEqual(
                await client.ledger.getPointBalance(user.address),
                oldBalance.sub(paidPoint).sub(feePoint)
            );
        }
    });
});
