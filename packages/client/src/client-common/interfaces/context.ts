// This file defines the interfaces of the context object holding client settings

import { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";

// Context input parameters
type Web3ContextParams = {
    network: number;
    privateKey: string;
    web3Provider: string;
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
};

type RelayContextParams = {
    relayEndpoint: string;
};

export type ContextParams = Web3ContextParams & RelayContextParams;

// Context state data
type Web3ContextState = {
    network: Networkish;
    signer?: Signer;
    web3Provider: JsonRpcProvider;
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

type RelayContextState = {
    relayEndpoint?: string;
};

export type ContextState = Web3ContextState & RelayContextState;
