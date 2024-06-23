import { Amount, Client, Context, ContractUtils } from "../../src";
import { NodeInfo } from "../helper/NodeInfo";

describe("Currency", () => {
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

    beforeAll(async () => {
        const ctx = new Context(contextParams);
        client = new Client(ctx);
    });

    it("Web3 Health Checking", async () => {
        const isUp = await client.link.web3.isUp();
        expect(isUp).toEqual(true);
    });

    // it("Set Exchange Rate", async () => {
    //     await NodeInfo.setExchangeRate(contractInfo.currencyRate, validatorWallets);
    // });

    it("Test of Currency", async () => {
        const amount = Amount.make(100, 18).value;
        const multiple = await client.currency.getMultiple();
        expect(await client.currency.currencyToPoint(amount, "php")).toEqual(amount);

        let currencyRate = await client.currency.getRate("krw");
        expect(await client.currency.currencyToPoint(amount, "krw")).toEqual(
            ContractUtils.zeroGWEI(amount.mul(currencyRate).div(multiple))
        );
        expect(await client.currency.pointToCurrency(amount, "krw")).toEqual(
            ContractUtils.zeroGWEI(amount.mul(multiple).div(currencyRate))
        );

        const tokenSymbol = await client.currency.getTokenSymbol();
        const tokenRate = await client.currency.getRate(tokenSymbol);
        expect(await client.currency.pointToToken(amount)).toEqual(
            ContractUtils.zeroGWEI(amount.mul(multiple).div(tokenRate))
        );
        expect(await client.currency.tokenToPoint(amount)).toEqual(
            ContractUtils.zeroGWEI(amount.mul(tokenRate).div(multiple))
        );

        expect(await client.currency.tokenToCurrency(amount, "krw")).toEqual(
            ContractUtils.zeroGWEI(
                amount
                    .mul(tokenRate)
                    .div(multiple)
                    .mul(multiple)
                    .div(currencyRate)
            )
        );
        expect(await client.currency.currencyToToken(amount, "krw")).toEqual(
            ContractUtils.zeroGWEI(
                amount
                    .mul(currencyRate)
                    .div(multiple)
                    .mul(multiple)
                    .div(tokenRate)
            )
        );
    });
});
