export enum SupportedNetwork {
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
    LoyaltyBridgeAddress: string;
    network: number;
    web3Endpoint: string;
    relayEndpoint: string;
};
export type GenericRecord = Record<string, string | number | boolean | null | undefined>;
