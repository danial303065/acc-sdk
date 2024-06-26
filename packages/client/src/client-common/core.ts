import { IClientCore, IClientRelayCore, IClientWeb3Core } from "./interfaces/core";
import { Context } from "./context";
import { Web3Module } from "./modules/web3";
import { RelayModule } from "./modules/relay";

const web3Map = new Map<ClientCore, IClientWeb3Core>();
const relayMap = new Map<ClientCore, IClientRelayCore>();

/**
 * Provides the low level foundation so that subclasses have ready-made access to Web3, IPFS and GraphQL primitives
 */
export abstract class ClientCore implements IClientCore {
    protected constructor(context: Context) {
        relayMap.set(this, new RelayModule(context));
        web3Map.set(this, new Web3Module(context));
        Object.freeze(ClientCore.prototype);
    }

    get relay(): IClientRelayCore {
        return relayMap.get(this)!;
    }

    get web3(): IClientWeb3Core {
        return web3Map.get(this)!;
    }
}
