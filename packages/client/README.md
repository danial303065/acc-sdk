# Decentralized Point System SDK Client

`dms-sdk-client` provides easy access to the high level interactions to be
made with an DMS.

# Installation

Use [yarn](https://yarnpkg.com/) to install
dms-sdk-client.

```bash
yarn add dms-sdk-client
```

# Testing

To execute library tests just run:

```bash
yarn test
```

# 함수에 대한 설명

## LedgerMethods

### Common

- getNonceOfLedger: (account: string) =\> Promise\<BigNumber\>;
  - Ledger의 nonce 를 제공하는 함수

### Balance
- getUnPayablePointBalance: (phone: string) =\> Promise\<BigNumber\>;
  - 사용불가능한 전화번호로 적립된 포인트의 잔고를 리턴한다
- getPointBalance: (account: string) =\> Promise\<BigNumber\>;
  - 사용가능한 포인트의 잔고를 리턴한다
- getTokenBalance: (account: string) =\> Promise\<BigNumber\>;
  - 토큰의 잔고를 리턴한다.

### Payment
- getFeeRate: () =\> Promise\<number\>;
  - 컨트랙트에 저장된 수수료 율을 리턴한다.
- getTemporaryAccount: () =\> Promise\<string\>;
  - 결제에 사용될 임시 주소를 생성한다.
- getPaymentDetail: (paymentId: BytesLike) =\> Promise\<PaymentDetailData\>
  - 결제에 대한 자세한 정보를 리턴한다. 
- approveNewPayment: (
  paymentId: BytesLike,
  purchaseId: string,
  amount: BigNumber,
  currency: string,
  shopId: BytesLike,
  approval: boolean
  ) =\> AsyncGenerator\<ApproveNewPaymentValue\>
  - 신규 결제에 대해서 승인한다.
- approveCancelPayment: (
  paymentId: BytesLike,
  purchaseId: string,
  approval: boolean
  ) =\> AsyncGenerator\<ApproveCancelPaymentValue\>
    - 취소 결제에 대해서 승인한다.

### Change
- changeToPayablePoint: (phone: string) =\> AsyncGenerator\<ChangeToPayablePointStepValue\>;
  - 전화번호로 적립된 포인트를 사용가능한 지갑주소로 적립된 포인트로 변환한다.
- exchangePointToToken: (amount: BigNumber) =\> AsyncGenerator\<ExchangePointToTokenStepValue\>;
  - 포인트를 토큰으로 변환

### Transfer
- transfer: (to: string, amount: BigNumber) =\> AsyncGenerator\<DelegatedTransferStepValue\>;
  - 토큰을 다른 주소로 전송한다.

### Deposit & Withdrawal via Bridge
- depositViaBridge: (amount: BigNumber) =\> AsyncGenerator\<DepositViaBridgeStepValue\>;
  - 토큰을 브릿지를 경유해서 입금한다
- waiteDepositViaBridge: (depositId: string, timeout?: number) =\> AsyncGenerator\<WaiteBridgeStepValue\>;
  - depositViaBridge 를 호출한 후 토큰이 완전히 입금될 때 까지 대기한다.
  - 메인넷의 블록이 새로운 블록이 생성되어야 완료된다.
- withdrawViaBridge: (amount: BigNumber) =\> AsyncGenerator\<WithdrawViaBridgeStepValue\>;
  - 토큰을 브릿지를 경유해서 출금한다
- waiteWithdrawViaBridge: (depositId: string, timeout?: number) =\> AsyncGenerator\<WaiteBridgeStepValue\>;
  - withdrawViaBridge 를 호출한 후 토큰이 완전히 출금될 때 까지 대기한다.
  - 메인넷의 블록이 새로운 블록이 생성되어야 완료된다.

### Mobile
- registerMobileToken: (token: string, language: string, os: string, type: MobileType) =\> Promise\<void\>;
  - 모바일의 정보를 등록한다
- removePhoneInfo: () =\> AsyncGenerator\<RemovePhoneInfoStepValue\>;
  - 등록된 모바일의 정보를 폐기한다

### Main Chain
- getChainInfoOfMainChain: () =\> Promise\<IChainInfo\>;
  - 메인체인의 정보를 제공한다.
- getProviderOfMainChain: () =\> Promise\<JsonRpcProvider\>;
  - 메인체인의 Provider를 제공한다.
- getMainChainBalance: (account: string) =\> Promise\<BigNumber\>;
  - 메인체인의 토큰잔고를 제공한다.
- getBalanceOfMainChainToken: (account: string) =\> Promise\<BigNumber\>;
  - 메인체인의 토큰잔고를 제공한다. getMainChainBalance 와 동일하다
- getNonceOfMainChainToken: (account: string) =\> Promise\<BigNumber\>;
  - 메인체인의 토큰의 Nonce를 제공한다.
- transferInMainChain: (to: string, amount: BigNumber) =\> AsyncGenerator\<DelegatedTransferStepValue\>;
  - 메인체인에서 토큰을 다른 주소로 전송한다.

### Side Chain
- getChainInfoOfSideChain: () =\> Promise\<IChainInfo\>;
  - 사이드체인의 정보를 제공한다.
- getProviderOfSideChain: () =\> Promise\<JsonRpcProvider\>;
  - 사이드체인의 Provider 를 제공한다.
- getSideChainBalance: (account: string) =\> Promise\<BigNumber\>;
  - 사이드체인의 토큰 잔고를 제공한다.
- getBalanceOfSideChainToken: (account: string) =\> Promise\<BigNumber\>;
  - 사이드체인의 토큰 잔고를 제공한다. getSideChainBalance 와 동일하다
- getNonceOfSideChainToken: (account: string) =\> Promise\<BigNumber\>;
  - 사이드체인의 토큰의 Nonce 를 제공한다.
- transferInSideChain: (to: string, amount: BigNumber) =\> AsyncGenerator\<DelegatedTransferStepValue\>;
  - 사이드체인에서 토큰을 다른 주소로 전송한다.

### History of Ledger
- getAccountHistory: (account: string, actions: LedgerAction[], pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 다양한 트랜잭션들의 히스토리를 제공한다. 이것을 사용해서 다양한 유형의 트랜잭션들을 조회할 수 있다.
- getSaveAndUseHistory: (account: string, pageNumber?: number, pageSize? number) =\> Promise\<any\>;
  - 적립, 사용, 소각, 환전, 정산금반환에 대한 히스토리를 제공한다. 내부적으로 getAccountHistory 를 사용한다
- getDepositAndWithdrawHistory: (account: string, pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 입출금에 대한 히스토리를 제공한다. 내부적으로 getAccountHistory 를 사용한다
- getTransferHistory: (account: string, pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 이체에 대한 히스토리를 제공한다. 내부적으로 getAccountHistory 를 사용한다
- getEstimatedSaveHistory: (account: string) =\> Promise\<any\>;
  - 조만간 적립될 금액에 대한 히스토리를 제공한다.
- getTotalEstimatedSaveHistory: (account: string) =\> Promise\<any\>;
  - 조만간 적립될 금액의 합계를 제공한다.

### History of Main Chain
- getTransferHistoryInMainChain: (account: string, pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 토큰의 전송 히스토리를 제공한다.

### History of Side Chain
- getTransferHistoryInSideChain: (account: string, pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 토큰의 전송 히스토리를 제공한다.


## ShopMethods

### Common
- getShopInfo: (shopId: BytesLike) =\> Promise\<ShopData\>;
  - 상점의 정보를 제공한다.
  
### Add
- isAvailableId: (shopId: BytesLike) =\> Promise\<boolean\>;
  - 상점아이디가 사용가능한지 확인해 준다.
- add: (shopId: BytesLike, name: string, currency: string) =\> AsyncGenerator\<AddShopStepValue\>;
  - 상점을 추가한다

### Update
- getTaskDetail: (taskId: BytesLike) =\> Promise\<ShopDetailData\>;
  - 상점정보변경과정에서 작업의 상세정보를 제공한다.
- approveUpdate: (taskId: BytesLike, shopId: BytesLike, approval: boolean) =\> AsyncGenerator\<ApproveShopStepValue\>;
  - 관리자페이지에서 상점정보를 변경하면 모바일로 푸쉬메세지가 온다. getTaskDetail 를 통해 정보를 확보한다 그 이후 이 함수를 사용하여 상점정보변경을 승인한다.
- approveStatus: (taskId: BytesLike, shopId: BytesLike, approval: boolean) =\> AsyncGenerator\<ApproveShopStepValue\>;
  - 관리자페이지에서 상점정보를 변경하면 모바일로 푸쉬메세지가 온다. getTaskDetail 를 통해 정보를 확보한다 그 이후 이 함수를 사용하여 상점정보변경을 승인한다.

### Refund
- refund: (shopId: BytesLike, amount: BigNumber) =\> AsyncGenerator\<RefundShopStepValue\>;
  - 정산금을 반환한다.
- getRefundableAmount: (shopId: BytesLike) =\> Promise\<ShopRefundableData\>;
  - 반환받을 수 있는 정산금을 제공한다. 금액과 토큰의 량을 제공한다

### List
- getShops: (from: number, to: number) =\> Promise\<BytesLike[]\>;
  - 상점주가 등록한 상점의 아이디 들을 제공한다.
- getShopsCount: () =\> Promise\<BigNumber\>;
  - 상점주가 등록한 상점의 갯수를 제공한다

### Delegate
- createDelegate: (shopId: BytesLike) =\> AsyncGenerator\<CreateDelegateStepValue\>;
  - 결제취소에 사용될 대리인의 주소를 등록한다.
- removeDelegate: (shopId: BytesLike) =\> AsyncGenerator\<RemoveDelegateStepValue\>;
  - 결제취소에 사용될 대리인의 주소를 제거한다.

### History
- getHistory: (shopId: BytesLike, actions: ShopAction[], pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 상점의 포인트 히스토리를 제공한다
- getProvideAndUseTradeHistory: (shopId: BytesLike, pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 상점의 포인트 지급과 사용에 대한 히스토리를 제공한다
- getRefundHistory: (shopId: BytesLike, pageNumber?: number, pageSize?: number) =\> Promise\<any\>;
  - 상점의 정산금 반환 히스토리를 제공한다
- getEstimatedProvideHistory: (shopId: BytesLike) =\> Promise\<any\>;
  - 상점이 조만간 제공할 포인트의 히스토리를 제공한다
- getTotalEstimatedProvideHistory: (shopId: BytesLike) =\> Promise\<any\>;
  - 상점이 조만간 제공할 포인트의 총금액을 제공한다
