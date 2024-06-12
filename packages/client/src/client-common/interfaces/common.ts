import { Networkish } from "@ethersproject/providers";

export enum SupportedNetwork {
    LOYALTY_MAINNET = "loyalty_mainnet",
    LOYALTY_TESTNET = "loyalty_testnet",
    LOYALTY_DEVNET = "loyalty_devnet",
    ACC_MAINNET = "acc_mainnet",
    ACC_TESTNET = "acc_testnet",
    ACC_DEVNET = "acc_devnet",
    LOCAL = "localhost"
}

export const SupportedNetworkArray = Object.values(SupportedNetwork);

export type NetworkDeployment = {
    PhoneLinkCollectionAddress: string;
    LoyaltyTokenAddress: string;
    ValidatorAddress: string;
    CurrencyRateAddress: string;
    ShopAddress: string;
    LedgerAddress: string;
    LoyaltyProviderAddress: string;
    LoyaltyConsumerAddress: string;
    LoyaltyExchangerAddress: string;
    LoyaltyTransferAddress: string;
    network: Networkish;
    LoyaltyBridgeAddress: string;
    web3Endpoint: string | URL;
    relayEndpoint: string | URL;
};
export type GenericRecord = Record<string, string | number | boolean | null | undefined>;
