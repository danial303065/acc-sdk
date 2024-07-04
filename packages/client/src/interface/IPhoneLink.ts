import { IClientCore } from "../client-common";
import { PhoneLinkRegisterStepValue, PhoneLinkSubmitStepValue, RemovePhoneInfoStepValue } from "../interfaces";
import { BytesLike } from "@ethersproject/bytes";

export interface IPhoneLink {
    link: IPhoneLinkMethods;
}

/** Defines the shape of the general purpose Client class */
export interface IPhoneLinkMethods extends IClientCore {
    getAccount: () => Promise<string>;
    isUp: () => Promise<boolean>;
    getEndpoint: (path: string) => Promise<URL>;
    getPhoneHash: (phone: string) => string;
    toAddress: (phoneHash: string) => Promise<string>;
    toPhoneHash: (address: string) => Promise<string>;
    register: (phone: string) => AsyncGenerator<PhoneLinkRegisterStepValue>;
    submit: (requestId: BytesLike, code: string) => AsyncGenerator<PhoneLinkSubmitStepValue>;
    getRegisterStatus: (id: BytesLike) => Promise<number>;
    removePhoneInfo: () => AsyncGenerator<RemovePhoneInfoStepValue>;
}
