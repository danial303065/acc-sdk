import { BigNumberish } from "@ethersproject/bignumber";
import { BigNumber } from "@ethersproject/bignumber";
import { Signer } from "@ethersproject/abstract-signer";
import { JsonRpcProvider, Networkish } from "@ethersproject/providers";
import { BytesLike } from "@ethersproject/bytes";

export type PurchaseParam = {
    purchaseId: string;
    amount: BigNumberish;
    userEmail: string;
    shopId: string;
};

export type SingPaymentParam = {
    signer: Signer;
    purchaseId: string;
    amount: BigNumberish;
    userEmail: string;
    shopId: string;
    nonce: BigNumberish;
};

export type ClientParams = {
    network?: Networkish;
    signer?: Signer;
    web3Provider?: JsonRpcProvider;
    relayEndpoint?: string;
};

export type FetchPayOption = PayPointOption | PayTokenOption;
export type PayPointOption = {
    purchaseId: string;
    amount: string;
    currency: string;
    shopId: BytesLike;
    account: string;
    signature: BytesLike;
};

export enum PayPointSteps {
    PAYING_POINT = "paying_point",
    DONE = "done"
}

export type PayPointStepValue =
    | { key: PayPointSteps.PAYING_POINT; txHash: string; purchaseId: string }
    | {
          key: PayPointSteps.DONE;
          amount: BigNumber;
          purchaseId: string;
          paidAmountPoint: BigNumber;
          balancePoint: BigNumber;
      };

export enum PayTokenSteps {
    PAYING_TOKEN = "paying_token",
    DONE = "done"
}

export type PayTokenStepValue =
    | { key: PayTokenSteps.PAYING_TOKEN; txHash: string; purchaseId: string }
    | {
          key: PayTokenSteps.DONE;
          purchaseId: string;
          amount: BigNumber;
          paidAmountToken: BigNumber;
          balanceToken: BigNumber;
      };

export type PayTokenOption = {
    purchaseId: string;
    amount: string;
    currency: string;
    shopId: BytesLike;
    account: string;
    signature: BytesLike;
};

export enum DepositSteps {
    CHECKED_ALLOWANCE = "checkedAllowance",
    UPDATING_ALLOWANCE = "updatingAllowance",
    UPDATED_ALLOWANCE = "updatedAllowance",
    DEPOSITING = "depositing",
    DONE = "done"
}
export type UpdateAllowanceStepValue =
    | { key: DepositSteps.CHECKED_ALLOWANCE; allowance: BigNumber }
    | { key: DepositSteps.UPDATING_ALLOWANCE; txHash: string }
    | { key: DepositSteps.UPDATED_ALLOWANCE; allowance: BigNumber };

export type DepositStepValue =
    | UpdateAllowanceStepValue
    | { key: DepositSteps.DEPOSITING; txHash: string }
    | { key: DepositSteps.DONE; amount: BigNumber };

export type UpdateAllowanceParams = {
    targetAddress: string;
    amount: BigNumber;
    tokenAddress: string;
};

export enum WithdrawSteps {
    WITHDRAWING = "withdrawing",
    DONE = "done"
}

export type WithdrawStepValue =
    | { key: WithdrawSteps.WITHDRAWING; txHash: string }
    | { key: WithdrawSteps.DONE; amount: BigNumber };

export enum RoyaltyType {
    POINT,
    TOKEN
}

export type ChangeRoyaltyTypeOption = {
    type: RoyaltyType;
    account: string;
    signature: BytesLike;
};

export enum ChangeRoyaltyTypeSteps {
    DOING = "doing",
    DONE = "done"
}

export type ChangeRoyaltyTypeStepValue =
    | { key: ChangeRoyaltyTypeSteps.DOING; txHash: string }
    | { key: ChangeRoyaltyTypeSteps.DONE; type: RoyaltyType };

export enum SortDirection {
    ASC = "asc",
    DESC = "desc"
}

export type QueryOption = {
    limit?: number;
    skip?: number;
    sortDirection?: SortDirection;
    sortBy?: SortByBlock;
};

export enum SortByBlock {
    BLOCK_NUMBER = "blockNumber",
    BLOCK_TIMESTAMP = "blockTimestamp"
}
export enum SortBy {
    LAST_UPDATED = "lastUpdated",
    CREATED_AT = "createdAt"
}
