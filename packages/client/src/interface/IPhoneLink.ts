import { IClientCore } from "../client-common";
import { PhoneLinkRegisterStepValue, PhoneLinkSubmitStepValue, RemovePhoneInfoStepValue } from "../interfaces";
import { BytesLike } from "@ethersproject/bytes";

export interface IPhoneLink {
    link: IPhoneLinkMethods;
}

/** Defines the shape of the general purpose Client class */
export interface IPhoneLinkMethods extends IClientCore {
    isUp: () => Promise<boolean>;
    getEndpoint: (path: string) => Promise<URL>;
    toAddress: (phone: string) => Promise<string>;
    toPhoneNumber: (address: string) => Promise<string>;
    register: (phone: string) => AsyncGenerator<PhoneLinkRegisterStepValue>;
    submit: (requestId: BytesLike, code: string) => AsyncGenerator<PhoneLinkSubmitStepValue>;
    getRegisterStatus: (id: BytesLike) => Promise<number>;
    removePhoneInfo: () => AsyncGenerator<RemovePhoneInfoStepValue>;
}
