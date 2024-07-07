import { JsonRpcProvider } from "@ethersproject/providers";
import { IClientRelayCore } from "../interfaces/core";
import { Context } from "../context";
import { InternalServerError, NoRelayEndpointError } from "../../utils/errors";
import { IChainInfo } from "../../interfaces";
import { Network } from "../interfaces/network";

import { BigNumber } from "@ethersproject/bignumber";

const relayEndpointMap = new Map<RelayModule, string>();
const mainChainInfoMap = new Map<RelayModule, IChainInfo>();
const sideChainInfoMap = new Map<RelayModule, IChainInfo>();

export class RelayModule implements IClientRelayCore {
    constructor(context: Context) {
        if (context.relayEndpoint) {
            relayEndpointMap.set(this, context.relayEndpoint);
        }

        Object.freeze(RelayModule.prototype);
        Object.freeze(this);
    }

    private get relayEndpoint(): string | undefined {
        return relayEndpointMap.get(this);
    }

    /**
     * 릴레이 서버의 주소를 이용하여 엔드포인트를 생성한다
     * @param path 경로
     * @return {Promise<URL>} 엔드포인트의 주소
     */
    public async getEndpoint(path: string): Promise<URL> {
        if (!path) throw Error("Not path");
        const endpoint = this.relayEndpoint;
        if (endpoint === undefined) throw new NoRelayEndpointError();

        const newUrl = typeof endpoint === "string" ? new URL(endpoint) : endpoint;
        if (newUrl && !newUrl?.pathname.endsWith("/")) {
            newUrl.pathname += "/";
        }
        return new URL(path, newUrl);
    }

    /**
     * 릴레이 서버가 정상적인 상태인지 검사한다.
     * @return {Promise<boolean>} 이 값이 true 이면 릴레이 서버가 정상이다.
     */
    public async isUp(): Promise<boolean> {
        try {
            const res = await Network.get(await this.getEndpoint("/"));
            return res === "OK";
        } catch {
            return false;
        }
    }

    public async getNonceOfLedger(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/ledger/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    public async getNonceOfShop(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/shop/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    public async getNonceOfPhoneLink(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/link/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    private get mainChainInfo(): IChainInfo | undefined {
        return mainChainInfoMap.get(this);
    }

    private get sideChainInfo(): IChainInfo | undefined {
        return sideChainInfoMap.get(this);
    }
    // region Main Chain

    /**
     * 메인체인의 정보를 제공한다.
     */
    public async getChainInfoOfMainChain(): Promise<IChainInfo> {
        if (this.mainChainInfo !== undefined) return this.mainChainInfo;
        const res = await Network.get(await this.getEndpoint(`/v1/chain/main/info`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        const chainInfo = {
            url: res.data.url,
            network: {
                name: res.data.network.name,
                chainId: res.data.network.chainId,
                ensAddress: res.data.network.ensAddress,
                chainTransferFee: BigNumber.from(res.data.network.chainTransferFee),
                chainBridgeFee: BigNumber.from(res.data.network.chainBridgeFee),
                loyaltyTransferFee: BigNumber.from(res.data.network.loyaltyTransferFee),
                loyaltyBridgeFee: BigNumber.from(res.data.network.loyaltyBridgeFee)
            },
            contract: {
                token: res.data.contract.token,
                chainBridge: res.data.contract.chainBridge,
                loyaltyBridge: res.data.contract.loyaltyBridge
            }
        };
        mainChainInfoMap.set(this, chainInfo);
        return chainInfo;
    }

    /**
     * 메인체인의 체인아이디를 제공한다.
     */
    public async getChainIdOfMainChain(): Promise<number> {
        const chainInfo = await this.getChainInfoOfMainChain();
        return Number(chainInfo.network.chainId);
    }

    /**
     * 메인체인의 Provider를 제공한다.
     */
    public async getProviderOfMainChain(): Promise<JsonRpcProvider> {
        const chainInfo = await this.getChainInfoOfMainChain();
        const url = new URL(chainInfo.url);
        return new JsonRpcProvider(url.href, {
            name: chainInfo.network.name,
            chainId: chainInfo.network.chainId,
            ensAddress: chainInfo.network.ensAddress
        });
    }

    /**
     * 메인체인의 토큰의 Nonce를 제공한다.
     */
    public async getNonceOfMainChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/main/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    /**
     * 메인체인의 토큰잔고를 제공한다.
     */
    public async getBalanceOfMainChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/main/balance/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        return BigNumber.from(res.data.balance);
    }

    // region Side Chain

    /**
     * 사이드체인의 정보를 제공한다.
     */
    public async getChainInfoOfSideChain(): Promise<IChainInfo> {
        if (this.sideChainInfo !== undefined) return this.sideChainInfo;
        const res = await Network.get(await this.getEndpoint(`/v1/chain/side/info`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        const chainInfo = {
            url: res.data.url,
            network: {
                name: res.data.network.name,
                chainId: res.data.network.chainId,
                ensAddress: res.data.network.ensAddress,
                chainTransferFee: BigNumber.from(res.data.network.chainTransferFee),
                chainBridgeFee: BigNumber.from(res.data.network.chainBridgeFee),
                loyaltyTransferFee: BigNumber.from(res.data.network.loyaltyTransferFee),
                loyaltyBridgeFee: BigNumber.from(res.data.network.loyaltyBridgeFee)
            },
            contract: {
                token: res.data.contract.token,
                chainBridge: res.data.contract.chainBridge,
                loyaltyBridge: res.data.contract.loyaltyBridge
            }
        };
        sideChainInfoMap.set(this, chainInfo);
        return chainInfo;
    }

    /**
     * 사이드체인의 체인아이디를 제공한다.
     */
    public async getChainIdOfSideChain(): Promise<number> {
        const chainInfo = await this.getChainInfoOfSideChain();
        return Number(chainInfo.network.chainId);
    }

    /**
     * 사이드체인의 Provider 를 제공한다.
     */
    public async getProviderOfSideChain(): Promise<JsonRpcProvider> {
        const chainInfo = await this.getChainInfoOfSideChain();
        const url = new URL(chainInfo.url);
        return new JsonRpcProvider(url.href, {
            name: chainInfo.network.name,
            chainId: chainInfo.network.chainId,
            ensAddress: chainInfo.network.ensAddress
        });
    }

    /**
     * 사이드체인의 토큰의 Nonce 를 제공한다.
     */
    public async getNonceOfSideChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/side/nonce/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }

        return BigNumber.from(res.data.nonce);
    }

    /**
     * 사이드체인의 토큰 잔고를 제공한다.
     */
    public async getBalanceOfSideChainToken(account: string): Promise<BigNumber> {
        const res = await Network.get(await this.getEndpoint(`/v1/token/side/balance/${account}`));
        if (res.code !== 0) {
            throw new InternalServerError(res?.error?.message ?? "");
        }
        return BigNumber.from(res.data.balance);
    }
}
