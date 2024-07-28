import { AccountIndex, NodeInfo } from "../helper/NodeInfo";
import {
    Amount,
    Client,
    Context,
    ContractUtils,
    DepositSteps,
    LoyaltyNetworkID,
    MobileType,
    NormalSteps,
    WithdrawSteps
} from "../../src";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { IShopData, IPurchaseData } from "../helper/types";
import { Wallet } from "@ethersproject/wallet";

describe("Ledger", () => {
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
    const linkValidatorWallets = [
        accounts[AccountIndex.LINK_VALIDATOR1],
        accounts[AccountIndex.LINK_VALIDATOR2],
        accounts[AccountIndex.LINK_VALIDATOR3]
    ];

    const userWallets = [
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom()
    ];
    const shopWallets = [
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom(),
        Wallet.createRandom()
    ];

    const shopData: IShopData[] = [
        {
            shopId: "",
            name: "Shop1",
            currency: "php",
            wallet: shopWallets[0]
        },
        {
            shopId: "",
            name: "Shop2",
            currency: "php",
            wallet: shopWallets[1]
        },
        {
            shopId: "",
            name: "Shop3",
            currency: "php",
            wallet: shopWallets[2]
        },
        {
            shopId: "",
            name: "Shop4",
            currency: "php",
            wallet: shopWallets[3]
        },
        {
            shopId: "",
            name: "Shop5",
            currency: "php",
            wallet: shopWallets[4]
        }
    ];
    const purchaseData: IPurchaseData[] = [
        {
            purchaseId: "P000001",
            timestamp: 1672844400,
            amount: 10000000000,
            method: 0,
            currency: "php",
            shopIndex: 0,
            userIndex: 0
        }
    ];

    let client: Client;
    beforeAll(async () => {
        contextParams.privateKey = userWallets[0].privateKey;
        const ctx = new Context(contextParams);
        client = new Client(ctx);
    });

    let signer: Signer;
    let userAddress: string;
    let phone: string;
    let phoneHash: string;
    beforeAll(async () => {
        client.usePrivateKey(userWallets[0].privateKey);
        signer = client.web3.getConnectedSigner();
        userAddress = await signer.getAddress();
        phone = NodeInfo.getPhoneNumber();
        phoneHash = ContractUtils.getPhoneHash(phone);

        console.log(`phone`, phone);
        console.log(`signer.getAddress()`, userAddress);
        console.log(`userWallets[0].address`, userWallets[0].address);
    });

    it("Server Health Checking", async () => {
        const isUp = await client.ledger.relay.isUp();
        expect(isUp).toEqual(true);
    });

    it("Set Exchange Rate", async () => {
        await NodeInfo.setExchangeRate(contractInfo.currencyRate, validatorWallets);
    });

    it("Prepare", async () => {
        await NodeInfo.transferBOA(userWallets.map((m) => m.address));
        await NodeInfo.transferBOA(shopWallets.map((m) => m.address));
        await NodeInfo.transferToken(
            contractInfo,
            userWallets.map((m) => m.address)
        );
        await NodeInfo.transferToken(
            contractInfo,
            shopWallets.map((m) => m.address)
        );

        for (const elem of shopData) {
            elem.shopId = ContractUtils.getShopId(elem.wallet.address, LoyaltyNetworkID.ACC_TESTNET);
        }
        await NodeInfo.addShopData(contractInfo, shopData);
    });

    it("Save Purchase Data 1", async () => {
        const purchaseAmount = Amount.make(purchaseData[0].amount, 18).value.mul(1000);
        const loyaltyAmount = purchaseAmount.mul(1).div(100);
        const purchaseParams = {
            purchaseId: NodeInfo.getPurchaseId(),
            amount: purchaseAmount,
            loyalty: loyaltyAmount,
            currency: purchaseData[0].currency.toLowerCase(),
            shopId: shopData[purchaseData[0].shopIndex].shopId,
            account: AddressZero,
            phone: phoneHash,
            sender: await accounts[AccountIndex.FOUNDATION].getAddress()
        };
        const purchaseMessage = ContractUtils.getPurchasesMessage(0, [purchaseParams], NodeInfo.getChainId());
        const signatures = await Promise.all(
            validatorWallets.map((m) => ContractUtils.signMessage(m, purchaseMessage))
        );
        const proposeMessage = ContractUtils.getPurchasesProposeMessage(
            0,
            [purchaseParams],
            signatures,
            NodeInfo.getChainId()
        );
        const proposerSignature = await ContractUtils.signMessage(validatorWallets[4], proposeMessage);
        await contractInfo.loyaltyProvider
            .connect(validatorWallets[4])
            .savePurchase(0, [purchaseParams], signatures, proposerSignature);
    });

    it("Save Purchase Data 2", async () => {
        const purchaseAmount = Amount.make(purchaseData[0].amount, 18).value.mul(1000);
        const loyaltyAmount = purchaseAmount.mul(1).div(100);
        const purchaseParams = {
            purchaseId: NodeInfo.getPurchaseId(),
            amount: purchaseAmount,
            loyalty: loyaltyAmount,
            currency: purchaseData[0].currency.toLowerCase(),
            shopId: shopData[purchaseData[0].shopIndex].shopId,
            account: userAddress,
            phone: phoneHash,
            sender: await accounts[AccountIndex.FOUNDATION].getAddress()
        };
        const purchaseMessage = ContractUtils.getPurchasesMessage(0, [purchaseParams], NodeInfo.getChainId());
        const signatures = await Promise.all(
            validatorWallets.map((m) => ContractUtils.signMessage(m, purchaseMessage))
        );
        const proposeMessage = ContractUtils.getPurchasesProposeMessage(
            0,
            [purchaseParams],
            signatures,
            NodeInfo.getChainId()
        );
        const proposerSignature = await ContractUtils.signMessage(validatorWallets[4], proposeMessage);
        await contractInfo.loyaltyProvider
            .connect(validatorWallets[4])
            .savePurchase(0, [purchaseParams], signatures, proposerSignature);
    });

    const purchaseAmount = Amount.make(purchaseData[0].amount, 18).value.mul(1000);
    const pointAmount = purchaseAmount.div(100);
    const tokenAmount = BigNumber.from(0);

    it("Balance Check - Test getting the unpayable point balance", async () => {
        const balance = await client.ledger.getUnPayablePointBalance(phoneHash);
        expect(balance).toEqual(pointAmount);
    });

    it("Balance Check - Test getting the point balance", async () => {
        const balance = await client.ledger.getPointBalance(userAddress);
        expect(balance).toEqual(pointAmount);
    });

    it("Balance Check - Test getting the token balance", async () => {
        const balance = await client.ledger.getTokenBalance(userAddress);
        expect(balance).toEqual(tokenAmount);
    });

    it("Link phone-wallet", async () => {
        const nonce = await contractInfo.phoneLinkCollection.nonceOf(userAddress);
        const msg = ContractUtils.getRequestMessage(phoneHash, await signer.getAddress(), nonce, NodeInfo.getChainId());
        const signature = await ContractUtils.signMessage(signer, msg);
        const requestId = ContractUtils.getRequestId(phoneHash, userAddress, nonce);
        //Add Phone
        await contractInfo.phoneLinkCollection.connect(signer).addRequest(requestId, phoneHash, userAddress, signature);
        // Vote
        await contractInfo.phoneLinkCollection.connect(linkValidatorWallets[0]).voteRequest(requestId);
        await contractInfo.phoneLinkCollection.connect(linkValidatorWallets[1]).voteRequest(requestId);
        await contractInfo.phoneLinkCollection.connect(linkValidatorWallets[0]).countVote(requestId);
    });

    it("Change to Payable Point", async () => {
        const unPayableBalance1 = await client.ledger.getUnPayablePointBalance(phoneHash);
        const payableBalance1 = await client.ledger.getPointBalance(userAddress);

        for await (const step of client.ledger.changeToPayablePoint(phone)) {
            switch (step.key) {
                case NormalSteps.PREPARED:
                    expect(step.phone).toEqual(phone);
                    expect(step.phoneHash).toEqual(phoneHash);
                    expect(step.account).toEqual(userAddress);
                    expect(step.balance).toEqual(unPayableBalance1);
                    break;
                case NormalSteps.SENT:
                    expect(typeof step.txHash).toBe("string");
                    expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                    break;
                case NormalSteps.DONE:
                    break;
                default:
                    throw new Error("Unexpected change payable point step: " + JSON.stringify(step, null, 2));
            }
        }
        const payableBalance2 = await client.ledger.getPointBalance(userAddress);
        expect(payableBalance2.toString()).toEqual(payableBalance1.add(unPayableBalance1).toString());
    });

    const tradeAmount = 10_000;
    const amountToTrade = Amount.make(tradeAmount, 18);

    it("Test of the deposit", async () => {
        const beforeBalance = await contractInfo.ledger.tokenBalanceOf(userAddress);

        let tx = await contractInfo.token
            .connect(accounts[AccountIndex.OWNER])
            .transfer(userWallets[0].address, amountToTrade.value);
        await tx.wait();

        for await (const step of client.ledger.deposit(amountToTrade.value)) {
            switch (step.key) {
                case DepositSteps.CHECKED_ALLOWANCE:
                    expect(step.allowance instanceof BigNumber).toBe(true);
                    expect(step.allowance.toString()).toBe("0");
                    break;
                case DepositSteps.UPDATING_ALLOWANCE:
                    expect(typeof step.txHash).toBe("string");
                    expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                    break;
                case DepositSteps.UPDATED_ALLOWANCE:
                    expect(step.allowance instanceof BigNumber).toBe(true);
                    expect(step.allowance.toString()).toBe(amountToTrade.toString());
                    break;
                case DepositSteps.DEPOSITING:
                    expect(typeof step.txHash).toBe("string");
                    expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                    break;
                case DepositSteps.DONE:
                    expect(step.amount instanceof BigNumber).toBe(true);
                    expect(step.amount.toString()).toBe(amountToTrade.toString());
                    break;
                default:
                    throw new Error("Unexpected deposit step: " + JSON.stringify(step, null, 2));
            }
        }

        const afterBalance = await contractInfo.ledger.tokenBalanceOf(userAddress);
        expect(afterBalance.toString()).toEqual(beforeBalance.add(amountToTrade.value).toString());
    });

    it("Test of the withdraw", async () => {
        const beforeBalance = await contractInfo.ledger.tokenBalanceOf(userAddress);

        for await (const step of client.ledger.withdraw(amountToTrade.value)) {
            switch (step.key) {
                case WithdrawSteps.WITHDRAWING:
                    expect(typeof step.txHash).toBe("string");
                    expect(step.txHash).toMatch(/^0x[A-Fa-f0-9]{64}$/i);
                    break;
                case WithdrawSteps.DONE:
                    expect(step.amount instanceof BigNumber).toBe(true);
                    expect(step.amount.toString()).toBe(amountToTrade.toString());
                    break;
                default:
                    throw new Error("Unexpected withdraw step: " + JSON.stringify(step, null, 2));
            }
        }

        const afterBalance = await contractInfo.ledger.tokenBalanceOf(userAddress);
        expect(afterBalance.toString()).toEqual(beforeBalance.sub(amountToTrade.value).toString());
    });

    it("Register Mobile Token", async () => {
        const token = "12345678901234567890123456789012345678901234567890";
        const language = "kr";
        const os = "iOS";
        await client.ledger.registerMobileToken(token, language, os, MobileType.USER_APP);
    });
});
