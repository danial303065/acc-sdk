import { NetworkDeployment, SupportedNetwork } from "./interfaces/common";
import { activeContractsList } from "acc-contracts-lib-v2";
import { Network } from "@ethersproject/networks";

export const LIVE_CONTRACTS: { [K in SupportedNetwork]: NetworkDeployment } = {
    loyalty_mainnet: {
        PhoneLinkCollectionAddress: activeContractsList.loyalty_mainnet.LoyaltyToken,
        LoyaltyTokenAddress: activeContractsList.loyalty_mainnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.loyalty_mainnet.Validator,
        CurrencyRateAddress: activeContractsList.loyalty_mainnet.CurrencyRate,
        ShopAddress: activeContractsList.loyalty_mainnet.Shop,
        LedgerAddress: activeContractsList.loyalty_mainnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.loyalty_mainnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.loyalty_mainnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.loyalty_mainnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.loyalty_mainnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.loyalty_mainnet.LoyaltyBridge,
        network: 215110,
        web3Endpoint: "https://rpc.kios.bosagora.org/",
        relayEndpoint: "https://relay.kios.bosagora.org/"
    },
    loyalty_testnet: {
        PhoneLinkCollectionAddress: activeContractsList.loyalty_testnet.LoyaltyToken,
        LoyaltyTokenAddress: activeContractsList.loyalty_testnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.loyalty_testnet.Validator,
        CurrencyRateAddress: activeContractsList.loyalty_testnet.CurrencyRate,
        ShopAddress: activeContractsList.loyalty_testnet.Shop,
        LedgerAddress: activeContractsList.loyalty_testnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.loyalty_testnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.loyalty_testnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.loyalty_testnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.loyalty_testnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.loyalty_testnet.LoyaltyBridge,
        network: 215115,
        web3Endpoint: "https://rpc.test.kios.bosagora.org/",
        relayEndpoint: "https://relay.test.kios.bosagora.org/"
    },
    loyalty_devnet: {
        PhoneLinkCollectionAddress: activeContractsList.loyalty_devnet.PhoneLinkCollection,
        LoyaltyTokenAddress: activeContractsList.loyalty_devnet.LoyaltyToken,
        ValidatorAddress: activeContractsList.loyalty_devnet.Validator,
        CurrencyRateAddress: activeContractsList.loyalty_devnet.CurrencyRate,
        ShopAddress: activeContractsList.loyalty_devnet.Shop,
        LedgerAddress: activeContractsList.loyalty_devnet.Ledger,
        LoyaltyProviderAddress: activeContractsList.loyalty_devnet.LoyaltyProvider,
        LoyaltyConsumerAddress: activeContractsList.loyalty_devnet.LoyaltyConsumer,
        LoyaltyExchangerAddress: activeContractsList.loyalty_devnet.LoyaltyExchanger,
        LoyaltyTransferAddress: activeContractsList.loyalty_devnet.LoyaltyTransfer,
        LoyaltyBridgeAddress: activeContractsList.loyalty_devnet.LoyaltyBridge,
        network: 24680,
        web3Endpoint: "http://rpc-side.dev.lyt.bosagora.org:8545/",
        relayEndpoint: "http://relay.dev.lyt.bosagora.org:7070/"
    },
    acc_mainnet: {
        PhoneLinkCollectionAddress: activeContractsList.acc_mainnet.LoyaltyToken,
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
        web3Endpoint: "https://rpc.acc.bosagora.org/",
        relayEndpoint: "https://relay.acc.bosagora.org/"
    },
    acc_testnet: {
        PhoneLinkCollectionAddress: activeContractsList.acc_testnet.LoyaltyToken,
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
        web3Endpoint: "https://rpc.test.acc.bosagora.org/",
        relayEndpoint: "https://relay.test.acc.bosagora.org/"
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
        web3Endpoint: "http://rpc-side.dev.acc.bosagora.org:28545/",
        relayEndpoint: "http://relay.dev.acc.bosagora.org:27070/"
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
        name: SupportedNetwork.LOYALTY_MAINNET,
        chainId: 215110
    },
    {
        name: SupportedNetwork.LOYALTY_TESTNET,
        chainId: 215115
    },
    {
        name: SupportedNetwork.LOYALTY_DEVNET,
        chainId: 24680
    },
    {
        name: SupportedNetwork.ACC_MAINNET,
        chainId: 215120
    },
    {
        name: SupportedNetwork.ACC_TESTNET,
        chainId: 215125
    },
    {
        name: SupportedNetwork.ACC_DEVNET,
        chainId: 24680
    }
];
