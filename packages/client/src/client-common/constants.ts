import { NetworkDeployment, SupportedNetwork } from "./interfaces/common";
import { activeContractsList } from "acc-contracts-lib-v2";
import { Network } from "@ethersproject/networks";

export const LIVE_CONTRACTS: { [K in SupportedNetwork]: NetworkDeployment } = {
    acc_mainnet: {
        PhoneLinkCollectionAddress: activeContractsList.acc_mainnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.acc_mainnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.acc_mainnet.Validator,
        CurrencyRateAddress: activeContractsList.acc_mainnet.CurrencyRate,
        ShopAddress: activeContractsList.acc_mainnet.Shop,
        LedgerAddress: activeContractsList.acc_mainnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.acc_mainnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.acc_mainnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.acc_mainnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.acc_mainnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.acc_mainnet.LoyaltyBridge,
        network: 215110,
        web3Endpoint: "https://rpc.main.acccoin.io/",
        relayEndpoint: "https://relay.main.acccoin.io/"
    },
    acc_testnet: {
        PhoneLinkCollectionAddress: activeContractsList.acc_testnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.acc_testnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.acc_testnet.Validator,
        CurrencyRateAddress: activeContractsList.acc_testnet.CurrencyRate,
        ShopAddress: activeContractsList.acc_testnet.Shop,
        LedgerAddress: activeContractsList.acc_testnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.acc_testnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.acc_testnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.acc_testnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.acc_testnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.acc_testnet.LoyaltyBridge,
        network: 215115,
        web3Endpoint: "https://rpc.test.acccoin.io/",
        relayEndpoint: "https://relay.test.acccoin.io/"
    },
    acc_devnet: {
        PhoneLinkCollectionAddress: activeContractsList.acc_devnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.acc_devnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.acc_devnet.Validator,
        CurrencyRateAddress: activeContractsList.acc_devnet.CurrencyRate,
        ShopAddress: activeContractsList.acc_devnet.Shop,
        LedgerAddress: activeContractsList.acc_devnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.acc_devnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.acc_devnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.acc_devnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.acc_devnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.acc_devnet.LoyaltyBridge,
        network: 24680,
        web3Endpoint: "http://rpc-side.dev.acccoin.io:28545/",
        relayEndpoint: "http://relay.dev.acccoin.io:27070/"
    },
    localhost: {
        PhoneLinkCollectionAddress: "",
        LoyaltyTokenAddress: "",
        ValidatorAddress: "",
        CurrencyRateAddress: "",
        ShopAddress: "",
        LedgerAddress: "",
        LoyaltyProviderAddress: "",
        LoyaltyConsumerAddress: "",
        LoyaltyExchangerAddress: "",
        LoyaltyTransferAddress: "",
        LoyaltyBridgeAddress: "",
        network: 24680,
        web3Endpoint: "http://localhost:8545/",
        relayEndpoint: "http://localhost:7070/"
    }
};

export const ADDITIONAL_NETWORKS: Network[] = [
    {
        name: SupportedNetwork.ACC_MAINNET,
        chainId: 215110
    },
    {
        name: SupportedNetwork.ACC_TESTNET,
        chainId: 215115
    },
    {
        name: SupportedNetwork.ACC_DEVNET,
        chainId: 24680
    }
];
