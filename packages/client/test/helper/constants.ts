import * as dotenv from "dotenv";

import { ContextParams } from "../../src";
dotenv.config({ path: "env/.env" });

export const web3EndpointsMainnet = {
    working: "https://rpc.main.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const web3EndpointsTestnet = {
    working: "https://rpc.test.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const web3EndpointsDevnet = {
    working: "http://rpc-side.dev.acccoin.io:28545/",
    failing: "https://bad-url-gateway.io/"
};

export const TEST_WALLET = "d09672244a06a32f74d051e5adbbb62ae0eda27832a973159d475da6d53ba5c0";

export const relayEndpointsMainnet = {
    working: "https://relay.main.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const relayEndpointsTestnet = {
    working: "https://relay.test.acccoin.io/",
    failing: "https://bad-url-gateway.io/"
};

export const relayEndpointsDevnet = {
    working: "http://relay.dev.acccoin.io:27070/",
    failing: "https://bad-url-gateway.io/"
};

export const contextParamsMainnet: ContextParams = {
    network: 215110,
    privateKey: TEST_WALLET,
    web3Provider: web3EndpointsMainnet.working,
    relayEndpoint: relayEndpointsMainnet.working
};

export const contextParamsTestnet: ContextParams = {
    network: 215115,
    privateKey: TEST_WALLET,
    web3Provider: web3EndpointsTestnet.working,
    relayEndpoint: relayEndpointsTestnet.working
};

export const contextParamsDevnet: ContextParams = {
    network: 24680,
    privateKey: TEST_WALLET,
    web3Provider: web3EndpointsDevnet.working,
    relayEndpoint: relayEndpointsDevnet.working
};

export const contextParamsLocalChain: ContextParams = {
    network: 24680,
    privateKey: TEST_WALLET,
    web3Provider: "http://localhost:8545",
    relayEndpoint: "http://localhost:7070"
};

export const contextParamsFailing: ContextParams = {
    network: 24680,
    privateKey: TEST_WALLET,
    web3Provider: web3EndpointsMainnet.failing
};
