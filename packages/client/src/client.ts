import { ClientCore, Context } from "./client-common";
import { ILedger, ILedgerMethods } from "./interface/ILedger";
import { LedgerMethods } from "./internal/client/LedgerMethods";
import { CurrencyMethods } from "./internal/client/CurrencyMethods";
import { ICurrency, ICurrencyMethods } from "./interface/ICurrency";
import { IShop, IShopMethods } from "./interface/IShop";
import { IPhoneLink, IPhoneLinkMethods } from "./interface/IPhoneLink";
import { PhoneLinkMethods } from "./internal/client/PhoneLinkMethods";
import { ShopMethods } from "./internal/client/ShopMethods";

/**
 * Provider a generic client with high level methods to manage and interact
 */
export class Client extends ClientCore implements ILedger, ICurrency, IShop, IPhoneLink {
    private readonly privateLedger: ILedgerMethods;
    private readonly privateCurrency: ICurrencyMethods;
    private readonly privateShop: IShopMethods;
    private readonly privateLink: IPhoneLinkMethods;

    constructor(context: Context) {
        super(context);
        this.privateLedger = new LedgerMethods(context);
        this.privateCurrency = new CurrencyMethods(context);
        this.privateShop = new ShopMethods(context);
        this.privateLink = new PhoneLinkMethods(context);
        Object.freeze(Client.prototype);
        Object.freeze(this);
    }

    public usePrivateKey(privateKey: string): void {
        this.web3.usePrivateKey(privateKey);
        this.privateLedger.web3.usePrivateKey(privateKey);
        this.privateCurrency.web3.usePrivateKey(privateKey);
        this.privateShop.web3.usePrivateKey(privateKey);
        this.privateLink.web3.usePrivateKey(privateKey);
    }

    public get ledger(): ILedgerMethods {
        return this.privateLedger;
    }

    public get currency(): ICurrencyMethods {
        return this.privateCurrency;
    }

    public get shop(): IShopMethods {
        return this.privateShop;
    }

    public get link(): IPhoneLinkMethods {
        return this.privateLink;
    }
}
