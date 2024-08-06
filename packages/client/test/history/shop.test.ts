import { Amount, Client, Context, ContractUtils, NormalSteps, ShopAction } from "../../src";

// @ts-ignore
import fs from "fs";
import { BigNumber } from "@ethersproject/bignumber";
import { Network } from "../../src/client-common/interfaces/network";

import * as assert from "assert";
import { AccountIndex, NodeInfo } from "../helper/NodeInfo";

export interface IPurchaseData {
    purchaseId: string;
    timestamp: number;
    amount: number;
    method: number;
    currency: string;
    userIndex: number;
    shopIndex: number;
}

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
    address: string;
    privateKey: string;
}

describe("Integrated test of Shop", () => {
    const contextParams = NodeInfo.getContextParams();
    const contractInfo = NodeInfo.getContractInfo();
    const accounts = NodeInfo.accounts();
    const validatorWallets = [
        accounts[AccountIndex.VALIDATOR01],
        accounts[AccountIndex.VALIDATOR02],
        accounts[AccountIndex.VALIDATOR03],
        accounts[AccountIndex.VALIDATOR04],
        accounts[AccountIndex.VALIDATOR05],
        accounts[AccountIndex.VALIDATOR06],
        accounts[AccountIndex.VALIDATOR07],
        accounts[AccountIndex.VALIDATOR08],
        accounts[AccountIndex.VALIDATOR09],
        accounts[AccountIndex.VALIDATOR10],
        accounts[AccountIndex.VALIDATOR11],
        accounts[AccountIndex.VALIDATOR12],
        accounts[AccountIndex.VALIDATOR13],
        accounts[AccountIndex.VALIDATOR14],
        accounts[AccountIndex.VALIDATOR15],
        accounts[AccountIndex.VALIDATOR16]
    ];

    let shop: IShopData;
    let shopIndex: number;
    let refundableAmount: BigNumber;
    describe("Method Check", () => {
        let client: Client;
        const users: IUserData[] = JSON.parse(fs.readFileSync("test/helper/users_mobile.json", "utf8"));
        const shops: IShopData[] = JSON.parse(fs.readFileSync("test/helper/shops.json", "utf8"));
        shopIndex = 2;
        shop = shops[shopIndex];
        beforeAll(async () => {
            contextParams.privateKey = shops[shopIndex].privateKey;
            const ctx = new Context(contextParams);
            client = new Client(ctx);
        });

        it("Web3 Health Checking", async () => {
            const isUp = await client.ledger.web3.isUp();
            expect(isUp).toEqual(true);
        });

        it("Server Health Checking", async () => {
            const isUp = await client.ledger.relay.isUp();
            expect(isUp).toEqual(true);
        });

        describe("GraphQL TEST", () => {
            it("GraphQL Server Health Test", async () => {
                const web3IsUp = await client.web3.isUp();
                expect(web3IsUp).toEqual(true);
                await ContractUtils.delay(1000);
            });

            it("Check Settlement", async () => {
                let res = await client.shop.getRefundableAmount(shop.shopId);
                refundableAmount = res.refundableAmount;
            });

            it("Set Exchange Rate", async () => {
                await NodeInfo.setExchangeRate(contractInfo.currencyRate, validatorWallets);
            });

            it("Save Purchase Data", async () => {
                const purchaseAmount = Amount.make(100_000_000, 18).value;
                const loyaltyAmount = purchaseAmount.mul(5).div(100);
                const phoneHash = ContractUtils.getPhoneHash("");
                const foundation = await accounts[AccountIndex.FOUNDATION].getAddress();

                const purchaseParams = await Promise.all(
                    users.map(async (m) => {
                        const purchaseItem = {
                            purchaseId: NodeInfo.getPurchaseId(),
                            amount: purchaseAmount,
                            loyalty: loyaltyAmount,
                            currency: "php",
                            shopId: shops[0].shopId,
                            account: m.address,
                            phone: phoneHash,
                            sender: foundation,
                            signature: ""
                        };
                        purchaseItem.signature = await ContractUtils.getPurchaseSignature(
                            accounts[AccountIndex.FOUNDATION],
                            purchaseItem,
                            NodeInfo.getChainId()
                        );
                        return purchaseItem;
                    })
                );
                const purchaseMessage = ContractUtils.getPurchasesMessage(0, purchaseParams, NodeInfo.getChainId());
                const signatures = await Promise.all(
                    validatorWallets.map((m) => ContractUtils.signMessage(m, purchaseMessage))
                );
                const proposeMessage = ContractUtils.getPurchasesProposeMessage(
                    0,
                    purchaseParams,
                    signatures,
                    NodeInfo.getChainId()
                );
                const proposerSignature = await ContractUtils.signMessage(validatorWallets[4], proposeMessage);
                await contractInfo.loyaltyProvider
                    .connect(validatorWallets[4])
                    .savePurchase(0, purchaseParams, signatures, proposerSignature);

                for (const user of users) {
                    const balance = await client.ledger.getPointBalance(user.address);
                    console.log(`${user.address} - balance: ${new Amount(balance).toDisplayString(true, 2)}`);
                }
            });

            it("Pay", async () => {
                const purchase: IPurchaseData = {
                    purchaseId: "P100000",
                    timestamp: 1672844400,
                    amount: 100000,
                    currency: "php",
                    shopIndex: 2,
                    userIndex: 0,
                    method: 0
                };

                const amount = Amount.make(purchase.amount, 18);

                const feeRate = await client.ledger.getFeeRate();
                const paidPoint = await client.currency.currencyToPoint(amount.value, purchase.currency);
                const feePoint = await client.currency.currencyToPoint(
                    amount.value.mul(feeRate).div(10000),
                    purchase.currency
                );
                const totalPoint = paidPoint.add(feePoint);

                let userIndex = 0;
                for (const user of users) {
                    const balance = await client.ledger.getPointBalance(user.address);
                    if (balance.gt(totalPoint)) {
                        purchase.userIndex = userIndex;
                        purchase.purchaseId = NodeInfo.getPurchaseId();

                        client.usePrivateKey(user.privateKey);

                        // Open New
                        console.log("Pay point - Open New");
                        let res = await Network.post(
                            new URL(contextParams.relayEndpoint + "v1/payment/new/open"),
                            {
                                purchaseId: purchase.purchaseId,
                                amount: paidPoint.toString(),
                                currency: purchase.currency.toLowerCase(),
                                shopId: shops[purchase.shopIndex].shopId,
                                account: user.address
                            },
                            {
                                Authorization: NodeInfo.RELAY_ACCESS_KEY
                            }
                        );
                        assert.deepStrictEqual(res.code, 0, res?.error?.message);
                        assert.notDeepStrictEqual(res.data, undefined);

                        const paymentId = res.data.paymentId;

                        await ContractUtils.delay(3000);

                        // Approve New
                        console.log("Pay point - Approve New");

                        let detail = await client.ledger.getPaymentDetail(paymentId);
                        for await (const step of client.ledger.approveNewPayment(
                            paymentId,
                            detail.purchaseId,
                            paidPoint,
                            detail.currency.toLowerCase(),
                            detail.shopId,
                            true
                        )) {
                            switch (step.key) {
                                case NormalSteps.PREPARED:
                                    expect(step.paymentId).toEqual(paymentId);
                                    expect(step.purchaseId).toEqual(detail.purchaseId);
                                    expect(step.amount).toEqual(paidPoint);
                                    expect(step.currency).toEqual(detail.currency.toLowerCase());
                                    expect(step.shopId).toEqual(detail.shopId);
                                    expect(step.account).toEqual(user.address);
                                    expect(step.signature).toMatch(/^0x[A-Fa-f0-9]{130}$/i);
                                    break;
                                case NormalSteps.SENT:
                                    expect(step.paymentId).toEqual(paymentId);
                                    expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                                    break;
                                case NormalSteps.APPROVED:
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

                        await ContractUtils.delay(5000);

                        // Close New
                        console.log("Pay point - Close New");
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

                        await ContractUtils.delay(1000);
                    }

                    let res = await client.shop.getRefundableAmount(shop.shopId);
                    refundableAmount = res.refundableAmount;
                    console.log(`userIndex: ${userIndex} ${new Amount(refundableAmount, 18).toDisplayString(true, 2)}`);
                    if (refundableAmount.gt(Amount.make(500000, 18).value)) {
                        break;
                    }
                    userIndex++;
                }
            });

            it("Get Provide & Use History", async () => {
                const res = await client.shop.getProvideAndUseTradeHistory(shop.shopId, 1, 100);
                const length = res.items.length;
                expect(length).toBeGreaterThan(0);
                expect(res.items[length - 1].shopId).toEqual(shop.shopId);
                expect([ShopAction.PROVIDED, ShopAction.USED]).toContain(res.items[length - 1].action);
            });

            it("Check Refundable Amount", async () => {
                let res = await client.shop.getRefundableAmount(shop.shopId);
                refundableAmount = res.refundableAmount;
                console.log("refundableAmount: ", new Amount(refundableAmount).toDisplayString(true, 2));
            });

            it("Refund", async () => {
                client.usePrivateKey(shop.privateKey);

                for await (const step of client.shop.refund(shop.shopId, refundableAmount)) {
                    switch (step.key) {
                        case NormalSteps.PREPARED:
                            console.log("Open Withdrawal", "NormalSteps.PREPARED");
                            expect(step.shopId).toEqual(shop.shopId);
                            expect(step.account.toUpperCase()).toEqual(shop.address.toUpperCase());
                            expect(step.signature).toMatch(/^0x[A-Fa-f0-9]{130}$/i);
                            break;
                        case NormalSteps.SENT:
                            console.log("Open Withdrawal", "NormalSteps.SENT");
                            expect(step.shopId).toEqual(shop.shopId);
                            expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                            break;
                        case NormalSteps.DONE:
                            console.log("Open Withdrawal", "NormalSteps.DONE");
                            expect(step.shopId).toEqual(shop.shopId);
                            expect(step.refundAmount.toString()).toEqual(refundableAmount.toString());
                            expect(step.account.toUpperCase()).toEqual(shop.address.toUpperCase());
                            break;
                        default:
                            throw new Error("Unexpected open withdrawal step: " + JSON.stringify(step, null, 2));
                    }
                }
            });

            it("Wait", async () => {
                await ContractUtils.delay(5000);
            });

            it("Check Refundable Amount", async () => {
                let res = await client.shop.getRefundableAmount(shop.shopId);
                refundableAmount = res.refundableAmount;
                expect(res.refundableAmount).toEqual(BigNumber.from(0));
            });

            it("Refund History", async () => {
                const res = await client.shop.getRefundHistory(shop.shopId, 1, 100);
                const length = res.items.length;
                expect(length).toBeGreaterThan(0);
                expect(res.items[0].shopId).toEqual(shop.shopId);
                expect(res.items[0].action).toEqual(ShopAction.REFUNDED);
            });
        });
    });
});
