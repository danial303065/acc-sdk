// This file defines the interfaces of the context object holding client settings

import { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";

// Context input parameters
type Web3ContextParams = {
    network: number;
    privateKey?: string;
    web3Providers?: string | (string )[];
    phoneLinkAddress?: string;
    tokenAddress?: string;
    validatorAddress?: string;
    currencyRateAddress?: string;
    shopAddress?: string;
    ledgerAddress?: string;
    loyaltyProviderAddress?: string;
    loyaltyConsumerAddress?: string;
    loyaltyExchangerAddress?: string;
    loyaltyTransferAddress?: string;
    loyaltyBridgeAddress?: string;
};
type HttpContextParams = {
    relayEndpoint?: string;
};

export type ContextParams = Web3ContextParams & HttpContextParams;

export interface IContextParams {
    network: number;
    privateKey: string;
    phoneLinkAddress: string;
    tokenAddress: string;
    validatorAddress: string;
    currencyRateAddress: string;
    shopAddress: string;
    ledgerAddress: string;
    loyaltyProviderAddress: string;
    loyaltyConsumerAddress: string;
    loyaltyExchangerAddress: string;
    loyaltyTransferAddress: string;
    loyaltyBridgeAddress: string;
    web3Providers: string;
    relayEndpoint: string;
}

// Context state data
type Web3ContextState = {
    network: Networkish;
    signer?: Signer;
    web3Providers: JsonRpcProvider[];
    phoneLinkAddress?: string;
    tokenAddress?: string;
    validatorAddress?: string;
    currencyRateAddress?: string;
    shopAddress?: string;
    ledgerAddress?: string;
    loyaltyProviderAddress?: string;
    loyaltyConsumerAddress?: string;
    loyaltyExchangerAddress?: string;
    loyaltyTransferAddress?: string;
    loyaltyBridgeAddress?: string;
};
type HTTPContextState = {
    relayEndpoint?: string | URL;
};

export type ContextState = Web3ContextState & HTTPContextState;
