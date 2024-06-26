// This file contains the definition of the low level network clients

import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { IChainInfo } from "../../interfaces";

export interface IClientWeb3Core {
    usePrivateKey: (privateKey: string) => void;
    useSigner: (signer: Signer) => void;
    getSigner: () => Signer | undefined;
    getConnectedSigner: () => Signer;
    getProvider: () => JsonRpcProvider | undefined;
    isUp: () => Promise<boolean>;
    attachContract: <T>(address: string, abi: ContractInterface) => Contract & T;
    getTokenAddress: () => string;
    getLinkAddress: () => string;
    getValidatorAddress: () => string;
    getCurrencyRateAddress: () => string;
    getShopAddress: () => string;
    getLedgerAddress: () => string;
    getLoyaltyProviderAddress: () => string;
    getLoyaltyConsumerAddress: () => string;
    getLoyaltyExchangerAddress: () => string;
    getLoyaltyTransferAddress: () => string;
    getLoyaltyBridgeAddress: () => string;
    getChainId: () => number;
}

export interface IClientRelayCore {
    isUp: () => Promise<boolean>;
    getEndpoint: (path: string) => Promise<URL>;

    // Nonce
    getNonceOfLedger: (account: string) => Promise<BigNumber>;
    getNonceOfShop: (account: string) => Promise<BigNumber>;
    getNonceOfPhoneLink: (account: string) => Promise<BigNumber>;

    // Main Chain
    getChainInfoOfMainChain: () => Promise<IChainInfo>;
    getChainIdOfMainChain: () => Promise<number>;
    getProviderOfMainChain: () => Promise<JsonRpcProvider>;
    getBalanceOfMainChainToken: (account: string) => Promise<BigNumber>;
    getNonceOfMainChainToken: (account: string) => Promise<BigNumber>;

    // Side Chain
    getChainInfoOfSideChain: () => Promise<IChainInfo>;
    getChainIdOfSideChain: () => Promise<number>;
    getProviderOfSideChain: () => Promise<JsonRpcProvider>;
    getBalanceOfSideChainToken: (account: string) => Promise<BigNumber>;
    getNonceOfSideChainToken: (account: string) => Promise<BigNumber>;
}

export interface IClientCore {
    web3: IClientWeb3Core;
    relay: IClientRelayCore;
}
