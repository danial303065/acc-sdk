export interface IProductData {
    productId: string;
    amount: number;
    providerPercent: number;
}

export interface INewPurchaseDetails {
    productId: string;
    amount: number;
    providePercent: number;
}

export interface INewPurchaseData {
    purchaseId: string;
    timestamp: string;
    totalAmount: number;
    cashAmount: number;
    currency: string;
    shopId: string;
    waiting: number;
    userAccount: string;
    userPhone: string;
    details: INewPurchaseDetails[];
}

export interface IProducts {
    product: IProductData;
    count: number;
}
