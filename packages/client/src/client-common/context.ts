import { ContextParams, ContextState } from "./interfaces/context";
import { SupportedNetwork, SupportedNetworkArray } from "./interfaces/common";
import { InvalidAddressError, UnsupportedProtocolError, UnsupportedNetworkError } from "acc-sdk-common-v2";
import { getNetwork } from "../utils/Utilty";
import { LIVE_CONTRACTS } from "./constants";

import { isAddress } from "@ethersproject/address";
import { Network } from "@ethersproject/networks";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { Wallet } from "@ethersproject/wallet";
export { ContextParams } from "./interfaces/context";

const supportedProtocols = ["https:", "http:"];
// if (typeof process !== "undefined" && process.env?.TESTING) {
//     supportedProtocols.push("http:");
// }

export class Context {
    protected state: ContextState = Object.assign({});

    // INTERNAL CONTEXT STATE

    /**
     * @param {Object} params
     *
     * @constructor
     */
    constructor(params: Partial<ContextParams>) {
        this.set(params);
    }

    /**
     * Getter for the network
     *
     * @var network
     *
     * @returns {Networkish}
     *
     * @public
     */
    get network() {
        return this.state.network;
    }

    /**
     * Getter for the Signer
     *
     * @var signer
     *
     * @returns {Signer}
     *
     * @public
     */
    get signer() {
        return this.state.signer;
    }

    // GETTERS

    /**
     * Getter for the web3 providers
     *
     * @var web3Provider
     *
     * @returns {JsonRpcProvider[]}
     *
     * @public
     */
    get web3Provider() {
        return this.state.web3Provider;
    }

    get relayEndpoint() {
        return this.state.relayEndpoint;
    }

    get tokenAddress(): string | undefined {
        return this.state.tokenAddress;
    }

    get phoneLinkAddress(): string | undefined {
        return this.state.phoneLinkAddress;
    }

    get validatorAddress(): string | undefined {
        return this.state.validatorAddress;
    }

    get currencyRateAddress(): string | undefined {
        return this.state.currencyRateAddress;
    }
    get shopAddress(): string | undefined {
        return this.state.shopAddress;
    }
    get ledgerAddress(): string | undefined {
        return this.state.ledgerAddress;
    }

    get loyaltyProviderAddress(): string | undefined {
        return this.state.loyaltyProviderAddress;
    }
    get loyaltyConsumerAddress(): string | undefined {
        return this.state.loyaltyConsumerAddress;
    }
    get loyaltyExchangerAddress(): string | undefined {
        return this.state.loyaltyExchangerAddress;
    }
    get loyaltyTransferAddress(): string | undefined {
        return this.state.loyaltyTransferAddress;
    }
    get loyaltyBridgeAddress(): string | undefined {
        return this.state.loyaltyBridgeAddress;
    }

    // INTERNAL HELPERS
    private static resolveNetwork(networkish: Networkish, ensRegistryAddress?: string): Network {
        const network = getNetwork(networkish);
        const networkName = network.name as SupportedNetwork;
        if (!SupportedNetworkArray.includes(networkName)) {
            throw new UnsupportedNetworkError(networkName);
        }

        if (ensRegistryAddress) {
            if (!isAddress(ensRegistryAddress)) {
                throw new InvalidAddressError();
            } else {
                network.ensAddress = ensRegistryAddress;
            }
        }

        if (!network.ensAddress) {
            network.ensAddress = AddressZero;
        }
        return network;
    }

    private static resolveweb3Provider(endpoint: string | JsonRpcProvider, network: Networkish): JsonRpcProvider {
        if (typeof endpoint === "string") {
            const url = new URL(endpoint);
            if (!supportedProtocols.includes(url.protocol)) {
                throw new UnsupportedProtocolError(url.protocol);
            }
            return new JsonRpcProvider(url.href, this.resolveNetwork(network));
        } else {
            return endpoint;
        }
    }

    /**
     * Does set and parse the given context configuration object
     *
     * @returns {void}
     *
     * @private
     */
    setFull(contextParams: ContextParams): void {
        if (!contextParams.network) {
            throw new Error("Missing network");
        } else if (!contextParams.privateKey) {
            throw new Error("Please pass the required signer");
        } else if (!contextParams.web3Provider) {
            throw new Error("No web3 endpoints defined");
        } else if (!contextParams.tokenAddress) {
            throw new Error("Missing token contract address");
        } else if (!contextParams.phoneLinkAddress) {
            throw new Error("Missing link collection contract address");
        } else if (!contextParams.validatorAddress) {
            throw new Error("Missing validator collection contract address");
        } else if (!contextParams.currencyRateAddress) {
            throw new Error("Missing token price contract address");
        } else if (!contextParams.shopAddress) {
            throw new Error("Missing shop collection  contract address");
        } else if (!contextParams.ledgerAddress) {
            throw new Error("Missing ledger contract address");
        } else if (!contextParams.loyaltyProviderAddress) {
            throw new Error("Missing loyalty provider contract address");
        } else if (!contextParams.loyaltyConsumerAddress) {
            throw new Error("Missing loyalty consumer contract address");
        } else if (!contextParams.loyaltyExchangerAddress) {
            throw new Error("Missing loyalty exchanger contract address");
        } else if (!contextParams.loyaltyTransferAddress) {
            throw new Error("Missing loyalty transfer contract address");
        } else if (!contextParams.loyaltyBridgeAddress) {
            throw new Error("Missing loyalty bridge contract address");
        }

        this.state = {
            network: contextParams.network,
            signer: new Wallet(contextParams.privateKey),
            web3Provider: Context.resolveweb3Provider(contextParams.web3Provider, contextParams.network),
            tokenAddress: contextParams.tokenAddress,
            phoneLinkAddress: contextParams.phoneLinkAddress,
            validatorAddress: contextParams.validatorAddress,
            currencyRateAddress: contextParams.currencyRateAddress,
            shopAddress: contextParams.shopAddress,
            ledgerAddress: contextParams.ledgerAddress,
            loyaltyProviderAddress: contextParams.loyaltyProviderAddress,
            loyaltyConsumerAddress: contextParams.loyaltyConsumerAddress,
            loyaltyExchangerAddress: contextParams.loyaltyExchangerAddress,
            loyaltyTransferAddress: contextParams.loyaltyTransferAddress,
            loyaltyBridgeAddress: contextParams.loyaltyBridgeAddress
        };
    }

    set(contextParams: Partial<ContextParams>) {
        if (contextParams.network) {
            this.state.network = contextParams.network;
        }
        if (contextParams.privateKey) {
            this.state.signer = new Wallet(contextParams.privateKey);
        }
        if (contextParams.web3Provider) {
            this.state.web3Provider = Context.resolveweb3Provider(contextParams.web3Provider, this.state.network);
        }
        if (contextParams.relayEndpoint) {
            this.state.relayEndpoint = contextParams.relayEndpoint;
        }
        if (contextParams.tokenAddress) {
            this.state.tokenAddress = contextParams.tokenAddress;
        }
        if (contextParams.phoneLinkAddress) {
            this.state.phoneLinkAddress = contextParams.phoneLinkAddress;
        }
        if (contextParams.validatorAddress) {
            this.state.validatorAddress = contextParams.validatorAddress;
        }
        if (contextParams.currencyRateAddress) {
            this.state.currencyRateAddress = contextParams.currencyRateAddress;
        }
        if (contextParams.shopAddress) {
            this.state.shopAddress = contextParams.shopAddress;
        }
        if (contextParams.ledgerAddress) {
            this.state.ledgerAddress = contextParams.ledgerAddress;
        }
        if (contextParams.loyaltyProviderAddress) {
            this.state.loyaltyProviderAddress = contextParams.loyaltyProviderAddress;
        }
        if (contextParams.loyaltyConsumerAddress) {
            this.state.loyaltyConsumerAddress = contextParams.loyaltyConsumerAddress;
        }
        if (contextParams.loyaltyExchangerAddress) {
            this.state.loyaltyExchangerAddress = contextParams.loyaltyExchangerAddress;
        }
        if (contextParams.loyaltyTransferAddress) {
            this.state.loyaltyTransferAddress = contextParams.loyaltyTransferAddress;
        }
        if (contextParams.loyaltyBridgeAddress) {
            this.state.loyaltyBridgeAddress = contextParams.loyaltyBridgeAddress;
        }
    }
}

export class ContextBuilder {
    public static buildContextParams(networkName: SupportedNetwork, defaultPrivateKey: string): ContextParams {
        const contextParams: ContextParams = {
            network: LIVE_CONTRACTS[networkName].network,
            privateKey: defaultPrivateKey,
            tokenAddress: LIVE_CONTRACTS[networkName].LoyaltyTokenAddress,
            phoneLinkAddress: LIVE_CONTRACTS[networkName].PhoneLinkCollectionAddress,
            validatorAddress: LIVE_CONTRACTS[networkName].ValidatorAddress,
            currencyRateAddress: LIVE_CONTRACTS[networkName].CurrencyRateAddress,
            shopAddress: LIVE_CONTRACTS[networkName].ShopAddress,
            ledgerAddress: LIVE_CONTRACTS[networkName].LedgerAddress,
            loyaltyProviderAddress: LIVE_CONTRACTS[networkName].LoyaltyProviderAddress,
            loyaltyConsumerAddress: LIVE_CONTRACTS[networkName].LoyaltyConsumerAddress,
            loyaltyExchangerAddress: LIVE_CONTRACTS[networkName].LoyaltyExchangerAddress,
            loyaltyTransferAddress: LIVE_CONTRACTS[networkName].LoyaltyTransferAddress,
            loyaltyBridgeAddress: LIVE_CONTRACTS[networkName].LoyaltyBridgeAddress,
            relayEndpoint: LIVE_CONTRACTS[networkName].relayEndpoint,
            web3Provider: LIVE_CONTRACTS[networkName].web3Endpoint
        };
        return contextParams;
    }

    public static buildContextParamsOfMainnet(defaultPrivateKey: string): ContextParams {
        return ContextBuilder.buildContextParams(SupportedNetwork.ACC_MAINNET, defaultPrivateKey);
    }

    public static buildContextParamsOfTestnet(defaultPrivateKey: string): ContextParams {
        return ContextBuilder.buildContextParams(SupportedNetwork.ACC_TESTNET, defaultPrivateKey);
    }

    public static buildContextParamsOfDevnet(defaultPrivateKey: string): ContextParams {
        return ContextBuilder.buildContextParams(SupportedNetwork.ACC_DEVNET, defaultPrivateKey);
    }

    public static buildContext(networkName: SupportedNetwork, defaultPrivateKey: string): Context {
        const contextParams = ContextBuilder.buildContextParams(networkName, defaultPrivateKey);
        return new Context(contextParams);
    }

    public static buildContextOfMainnet(defaultPrivateKey: string): Context {
        return ContextBuilder.buildContext(SupportedNetwork.ACC_MAINNET, defaultPrivateKey);
    }

    public static buildContextOfTestnet(defaultPrivateKey: string): Context {
        return ContextBuilder.buildContext(SupportedNetwork.ACC_TESTNET, defaultPrivateKey);
    }

    public static buildContextOfDevnet(defaultPrivateKey: string): Context {
        return ContextBuilder.buildContext(SupportedNetwork.ACC_DEVNET, defaultPrivateKey);
    }
}
