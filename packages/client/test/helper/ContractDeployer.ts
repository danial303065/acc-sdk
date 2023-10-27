import { GanacheServer } from "./GanacheServer";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract, ContractFactory } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import {
    ShopCollection,
    ShopCollection__factory,
    Ledger,
    Ledger__factory,
    Token,
    Token__factory,
    CurrencyRate,
    CurrencyRate__factory,
    ValidatorCollection,
    ValidatorCollection__factory
} from "dms-osx-lib";
import { Amount, ContractUtils, LIVE_CONTRACTS } from "../../src";
import { PhoneLinkCollection, PhoneLinkCollection__factory } from "del-osx-lib";
import { contextParamsLocalChain } from "./constants";

export interface Deployment {
    provider: JsonRpcProvider;
    phoneLinkCollection: PhoneLinkCollection;
    token: Token;
    validatorCollection: ValidatorCollection;
    currencyRate: CurrencyRate;
    shopCollection: ShopCollection;
    ledger: Ledger;
}

export const depositAmount = Amount.make(50_000, 18);
export const foundationAmount = Amount.make(1_000_000_000, 18);

export interface IPurchaseData {
    purchaseId: string;
    timestamp: number;
    amount: number;
    method: number;
    currency: string;
    userIndex: number;
    shopIndex: number;
}

export interface IShopData {
    shopId: string;
    name: string;
    provideWaitTime: number;
    providePercent: number;
    wallet: Wallet;
}

export interface IUserData {
    phone: string;
    address: string;
    privateKey: string;
}

export const userData: IUserData[] = [];

export const shopData: IShopData[] = [];

export const purchaseData: IPurchaseData[] = [
    {
        purchaseId: "P000001",
        timestamp: 1672844400,
        amount: 10000,
        method: 0,
        currency: "krw",
        shopIndex: 0,
        userIndex: 0
    },
    {
        purchaseId: "P000002",
        timestamp: 1675522800,
        amount: 10000,
        method: 0,
        currency: "krw",
        shopIndex: 0,
        userIndex: 1
    },
    {
        purchaseId: "P000003",
        timestamp: 1677942000,
        amount: 10000,
        method: 0,
        currency: "krw",
        shopIndex: 1,
        userIndex: 2
    },
    {
        purchaseId: "P000004",
        timestamp: 1680620400,
        amount: 10000,
        method: 0,
        currency: "krw",
        shopIndex: 2,
        userIndex: 3
    },
    {
        purchaseId: "P000005",
        timestamp: 1683212400,
        amount: 10000,
        method: 0,
        currency: "krw",
        shopIndex: 1,
        userIndex: 4
    }
];

export class ContractDeployer {
    public static createSampleData() {
        const [
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            user1,
            user2,
            user3,
            user4,
            user5,
            shop1,
            shop2,
            shop3,
            shop4,
            shop5,
            shop6
        ] = GanacheServer.accounts();
        const userWallets = [user1, user2, user3, user4, user5];
        const shopWallets = [shop1, shop2, shop3, shop4, shop5, shop6];
        while (userData.length > 0) userData.pop();
        while (shopData.length > 0) shopData.pop();

        userData.push(
            ...[
                {
                    phone: "08201012341001",
                    address: userWallets[0].address,
                    privateKey: userWallets[0].privateKey
                },
                {
                    phone: "08201012341002",
                    address: userWallets[1].address,
                    privateKey: userWallets[1].privateKey
                },
                {
                    phone: "08201012341003",
                    address: userWallets[2].address,
                    privateKey: userWallets[2].privateKey
                },
                {
                    phone: "08201012341004",
                    address: "",
                    privateKey: ""
                },
                {
                    phone: "08201012341005",
                    address: "",
                    privateKey: ""
                }
            ]
        );

        shopData.push(
            ...[
                {
                    shopId: "",
                    name: "Shop1",
                    provideWaitTime: 0,
                    providePercent: 1,
                    wallet: shopWallets[0]
                },
                {
                    shopId: "",
                    name: "Shop2",
                    provideWaitTime: 0,
                    providePercent: 1,
                    wallet: shopWallets[1]
                },
                {
                    shopId: "",
                    name: "Shop3",
                    provideWaitTime: 0,
                    providePercent: 1,
                    wallet: shopWallets[2]
                },
                {
                    shopId: "",
                    name: "Shop4",
                    provideWaitTime: 0,
                    providePercent: 1,
                    wallet: shopWallets[3]
                },
                {
                    shopId: "",
                    name: "Shop5",
                    provideWaitTime: 0,
                    providePercent: 1,
                    wallet: shopWallets[4]
                }
            ]
        );

        for (const elem of shopData) {
            elem.shopId = ContractUtils.getShopId(elem.wallet.address);
        }
    }

    public static async deploy(): Promise<Deployment> {
        const provider = GanacheServer.createTestProvider();
        GanacheServer.setTestProvider(provider);

        let accounts = GanacheServer.accounts();
        const [deployer, foundation, settlement, fee, validator1, validator2, validator3] = accounts;
        const validators = [validator1, validator2, validator3];

        try {
            const tokenContract = await ContractDeployer.deployToken(deployer, accounts);

            const validatorCollectionContract: ValidatorCollection = (await ContractDeployer.deployValidatorCollection(
                deployer,
                tokenContract,
                validators
            )) as ValidatorCollection;

            await ContractDeployer.depositValidators(tokenContract, validatorCollectionContract, validators);
            const linkCollectionContract: PhoneLinkCollection = await ContractDeployer.deployLinkCollection(
                deployer,
                validators
            );

            const currencyRateContract: CurrencyRate = await ContractDeployer.deployCurrencyRate(
                deployer,
                validatorCollectionContract,
                tokenContract,
                validator1
            );
            const shopCollectionContract: ShopCollection = await ContractDeployer.deployShopCollection(deployer);
            const ledgerContract: Ledger = await ContractDeployer.deployLedger(
                deployer,
                foundation.address,
                settlement.address,
                fee.address,
                tokenContract,
                validatorCollectionContract,
                linkCollectionContract,
                currencyRateContract,
                shopCollectionContract
            );
            await ContractDeployer.depositFoundationAsset(tokenContract, ledgerContract, deployer, foundation);

            ContractDeployer.createSampleData();

            await ContractDeployer.addShopData(shopCollectionContract);

            LIVE_CONTRACTS.bosagora_devnet.PhoneLinkCollectionAddress = linkCollectionContract.address;
            LIVE_CONTRACTS.bosagora_devnet.TokenAddress = tokenContract.address;
            LIVE_CONTRACTS.bosagora_devnet.ValidatorCollectionAddress = validatorCollectionContract.address;
            LIVE_CONTRACTS.bosagora_devnet.CurrencyRateAddress = currencyRateContract.address;
            LIVE_CONTRACTS.bosagora_devnet.ShopCollectionAddress = shopCollectionContract.address;
            LIVE_CONTRACTS.bosagora_devnet.LedgerAddress = ledgerContract.address;

            contextParamsLocalChain.phoneLinkCollectionAddress = linkCollectionContract.address;
            contextParamsLocalChain.tokenAddress = tokenContract.address;
            contextParamsLocalChain.validatorCollectionAddress = validatorCollectionContract.address;
            contextParamsLocalChain.currencyRateAddress = currencyRateContract.address;
            contextParamsLocalChain.shopCollectionAddress = shopCollectionContract.address;
            contextParamsLocalChain.ledgerAddress = ledgerContract.address;

            return {
                provider: provider,
                phoneLinkCollection: linkCollectionContract,
                token: tokenContract,
                validatorCollection: validatorCollectionContract,
                currencyRate: currencyRateContract,
                shopCollection: shopCollectionContract,
                ledger: ledgerContract
            };
        } catch (e) {
            throw e;
        }
    }

    private static async deployToken(deployer: Wallet, accounts: Wallet[]): Promise<Token> {
        const tokenFactory = new ContractFactory(Token__factory.abi, Token__factory.bytecode);
        const tokenContract = (await tokenFactory
            .connect(deployer)
            .deploy(await deployer.getAddress(), "Sample", "SAM")) as Token;
        await tokenContract.deployed();
        await tokenContract.deployTransaction.wait();

        for (const elem of accounts) {
            await tokenContract.connect(deployer).transfer(await elem.getAddress(), depositAmount.value);
        }
        return tokenContract;
    }

    private static async deployValidatorCollection(
        deployer: Wallet,
        tokenContract: Token,
        validators: Wallet[]
    ): Promise<ValidatorCollection> {
        const validatorFactory = new ContractFactory(
            ValidatorCollection__factory.abi,
            ValidatorCollection__factory.bytecode
        );
        const validatorContract: ValidatorCollection = (await validatorFactory.connect(deployer).deploy(
            tokenContract.address,
            validators.map((m) => m.address)
        )) as ValidatorCollection;
        await validatorContract.deployed();
        await validatorContract.deployTransaction.wait();
        return validatorContract;
    }

    private static async depositValidators(
        tokenContract: Contract,
        validatorContract: ValidatorCollection,
        validators: Wallet[]
    ): Promise<void> {
        for (const elem of validators) {
            const token = tokenContract.connect(elem);
            const address = await elem.getAddress();
            const tx1 = await token.approve(validatorContract.address, depositAmount.value);
            await tx1.wait();
            const tx2 = await validatorContract.connect(elem).deposit(depositAmount.value);
            await tx2.wait();
            await validatorContract.validatorOf(address);
        }
    }

    private static async deployLinkCollection(deployer: Wallet, validators: Wallet[]): Promise<PhoneLinkCollection> {
        const linkCollectionFactory = new ContractFactory(
            PhoneLinkCollection__factory.abi,
            PhoneLinkCollection__factory.bytecode
        );
        const linkCollectionContract: PhoneLinkCollection = (await linkCollectionFactory
            .connect(deployer)
            .deploy(validators.map((m) => m.address))) as PhoneLinkCollection;
        await linkCollectionContract.deployed();
        await linkCollectionContract.deployTransaction.wait();

        return linkCollectionContract;
    }

    private static async deployCurrencyRate(
        deployer: Signer,
        validatorContract: ValidatorCollection,
        tokenContract: Token,
        validator: Signer
    ): Promise<CurrencyRate> {
        const currencyRateFactory = new ContractFactory(CurrencyRate__factory.abi, CurrencyRate__factory.bytecode);
        const currencyRateContract = (await currencyRateFactory
            .connect(deployer)
            .deploy(validatorContract.address)) as CurrencyRate;
        await currencyRateContract.deployed();
        await currencyRateContract.deployTransaction.wait();

        const multiple = BigNumber.from(1000000000);
        const price = BigNumber.from(150).mul(multiple);
        await currencyRateContract.connect(validator).set(await tokenContract.symbol(), price);
        await currencyRateContract.connect(validator).set("usd", BigNumber.from(3).mul(multiple));
        await currencyRateContract.connect(validator).set("jpy", BigNumber.from(2).mul(multiple));
        await currencyRateContract.connect(validator).set("cny", BigNumber.from(1).mul(multiple));
        await currencyRateContract.connect(validator).set("krw", BigNumber.from(1).mul(multiple));
        await currencyRateContract.connect(validator).set("point", BigNumber.from(1).mul(multiple));
        return currencyRateContract;
    }

    private static async deployShopCollection(deployer: Signer): Promise<ShopCollection> {
        const shopCollectionFactory = new ContractFactory(
            ShopCollection__factory.abi,
            ShopCollection__factory.bytecode
        );
        const shopCollection = (await shopCollectionFactory.connect(deployer).deploy()) as ShopCollection;
        await shopCollection.deployed();
        await shopCollection.deployTransaction.wait();
        return shopCollection;
    }

    private static async deployLedger(
        deployer: Signer,
        foundationAddress: string,
        settlementAddress: string,
        feeAddress: string,
        tokenContract: Contract,
        validatorContract: Contract,
        linkCollectionContract: Contract,
        currencyRateContract: Contract,
        shopCollection: Contract
    ): Promise<Ledger> {
        const ledgerFactory = new ContractFactory(Ledger__factory.abi, Ledger__factory.bytecode);
        const ledgerContract = (await ledgerFactory
            .connect(deployer)
            .deploy(
                foundationAddress,
                settlementAddress,
                feeAddress,
                tokenContract.address,
                validatorContract.address,
                linkCollectionContract.address,
                currencyRateContract.address,
                shopCollection.address
            )) as Ledger;
        await ledgerContract.deployed();
        await ledgerContract.deployTransaction.wait();
        await shopCollection.connect(deployer).setLedgerAddress(ledgerContract.address);
        return ledgerContract;
    }

    private static async depositFoundationAsset(
        tokenContract: Token,
        ledgerContract: Ledger,
        deployer: Wallet,
        foundation: Wallet
    ): Promise<void> {
        await tokenContract.connect(deployer).transfer(foundation.address, foundationAmount.value);
        await tokenContract.connect(foundation).approve(ledgerContract.address, foundationAmount.value);
        await ledgerContract.connect(foundation).deposit(foundationAmount.value);
    }

    private static async addShopData(shopCollection: ShopCollection) {
        for (const elem of shopData) {
            await shopCollection
                .connect(elem.wallet)
                .addDirect(elem.shopId, elem.name, elem.provideWaitTime, elem.providePercent);
        }
    }
}