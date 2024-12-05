---
title: Typescript SDK

slug: /eclipse/sdk
---

# Pair

Class uniquely representing a pool. It should be created using a dedicated constructor.

```ts
export class Pair {
  public tokenX: PublicKey;
  public tokenY: PublicKey;
  public feeTier: FeeTier;
  public feeTierAddress: PublicKey | null;
  public tickSpacing: number;
}
```

## Methods

### Constructor

```ts
constructor(first: PublicKey, second: PublicKey, feeTier: FeeTier)
```

#### Params

| Name    | Type      | Description                                                 |
| ------- | --------- | ----------------------------------------------------------- |
| first   | PublicKey | Token Mint key.                                             |
| second  | PublicKey | Token Mint key.                                             |
| feeTier | FeeTier   | Fee tier struct chosen from the fee tiers existing on pool. |

### getAddressAndBump

```ts
getAddressAndBump(programId: PublicKey): [PublicKey, number]
```

#### Params

| Name      | Type      | Description               |
| --------- | --------- | ------------------------- |
| programId | PublicKey | Id of the market program. |

#### Return

| Type      | Description   |
| --------- | ------------- |
| PublicKey | Pool address. |
| number    | bump.         |

### getAddress

```ts
getAddress(programId: PublicKey): PublicKey
```

#### Params

| Name      | Type      | Description               |
| --------- | --------- | ------------------------- |
| programId | PublicKey | Id of the market program. |

#### Return

| Type      | Description   |
| --------- | ------------- |
| PublicKey | Pool address. |

### getFeeTierAddress

```ts
getFeeTierAddress(programId: PublicKey)
```

#### Params

| Name      | Type      | Description               |
| --------- | --------- | ------------------------- |
| programId | PublicKey | Id of the market program. |

#### Return

| Type      | Description      |
| --------- | ---------------- |
| PublicKey | FeeTier address. |

# Network

Network enum used for initializing the market object.

```ts
export enum Network {
  LOCAL,
  DEV,
  TEST,
  MAIN,
}
```

# Market

Market class wraps the functionality of the protocol.

## Initialization

Market can be initialized with or without the Provider. Provider can be omitted when using the market for queries only.

```ts
public static build(
  network: Network,
  wallet: IWallet,
  connection: Connection,
  programId?: PublicKey
)
```

```ts
public static async buildWithoutProvider(
  network: Network,
  connection: Connection,
  programId?: PublicKey
)
```

## Anchor IDL

If you wish to use raw instructions you can use the provided idl.
Idl can be accessed through `program` property on the Market object.

```ts
const market = Market.buildWithoutProvider(...)
market.program;
```

## Entrypoint methods

Most entrypoints have 3 methods following a pattern of `entrypointName`, `entrypointNameTransaction`, `entrypointNameInstruction`.
`entrypointName` methods call and sign the entrypoint with the singer passed in as an argument. `entrypointNameTransaction` returns a transaction sometimes with additional instructions that are necessary for performing an action on the protocol. `entrypointNameInstruction` returns a single instruction. The exception to this rule is `createPool`.
Some methods have optional parameters which contain information about the current state. When using custom caching for invariants state it's recommended to pass the data when calling these functions. Otherwise the state will be fetched from the RPC.

### CreateState

```ts
async createStateInstruction(admin?: PublicKey)
async createStateTransaction(admin?: PublicKey)
async createState(admin: PublicKey, signer: Keypair)
```

#### Params

| Name   | Type      | Description                                |
| ------ | --------- | ------------------------------------------ |
| admin  | PublicKey | Admin account, defaults to wallet address. |
| signer | Keypair   | Transaction signer.                        |

#### Return

Returns instruction or transaction with create state instruction.

### CreateFeeTier

```ts
async createFeeTierInstruction(createFeeTier: CreateFeeTier)
async createFeeTierTransaction(createFeeTier: CreateFeeTier)
async createFeeTier(createFeeTier: CreateFeeTier)
```

#### Params

```ts
export interface CreateFeeTier {
  feeTier: FeeTier;
  admin?: PublicKey;
}
```

| Name    | Type      | Description                                |
| ------- | --------- | ------------------------------------------ |
| feeTier | FeeTier   | Fee tier to be created.                    |
| admin   | PublicKey | Admin account, defaults to wallet address. |
| signer  | Keypair   | Transaction signer.                        |

#### Return

Returns instruction or transaction with create fee tier instruction.

### CreatePool

```ts
async createPoolTransaction(createPool: CreatePoolTx, cache: CreatePoolCache = {})
async createPool(createPool: CreatePool, cache: CreatePoolCache = {})
```

#### Params

```ts
export interface CreatePool {
  pair: Pair;
  payer: Keypair;
  initTick?: number;
}
export interface CreatePoolTx {
  pair: Pair;
  payer?: Keypair;
  initTick?: number;
}
```

#### Params

| Name     | Type    | Description                                                    |
| -------- | ------- | -------------------------------------------------------------- |
| pair     | Pair    | Pool identifier for the tick.                                  |
| payer    | Keypair | Specifies the signer of the transaction and owner of the pool. |
| initTick | number  | Optional parameter specifying the initial price tick.          |

#### Return

| Name        | Type        | Description                                                                   |
| ----------- | ----------- | ----------------------------------------------------------------------------- |
| transaction | Transaction | Create pool transaction. Containing initReserves and createPool instructions. |
| signers     | Keypair[]   | Array of signers with reserve and tickmap accounts.                           |

### CreateTick

```ts
async createTickInstruction(createTick: CreateTick, cache: CreateTickInstructionCache = {})
async createTickTransaction(createTick: CreateTick, cache: CreateTickInstructionCache = {})
async createTick(createTick: CreateTick, signer: Keypair, cache: CreateTickInstructionCache = {})
```

#### Params

```ts
export interface CreateTick {
  pair: Pair;
  index: number;
  payer?: PublicKey;
}
```

| Name   | Type      | Description                   |
| ------ | --------- | ----------------------------- |
| pair   | Pair      | Pool identifier for the tick. |
| index  | number    | Tick index.                   |
| payer  | PublicKey | Owner of the tick.            |
| signer | Keypair   | Transaction signer.           |

#### Return

Returns instruction or transaction with create tick instruction.

### CreatePositionList

```ts
async createPositionListInstruction(owner: PublicKey, signer?: PublicKey)
async createPositionListTransaction(owner: PublicKey, signer?: PublicKey)
async createPositionList(owner: PublicKey, signer: Keypair)
```

#### Params

| Name   | Type              | Description                                             |
| ------ | ----------------- | ------------------------------------------------------- |
| owner  | PublicKey         | Owner of the position list, defaults to wallet address. |
| signer | PublicKey/Keypair | Transaction signer, defaults to owner                   |

#### Return

Returns instruction or transaction with create position list instruction.

### InitPosition

```ts
async initPositionInstruction(initPosition: InitPosition, cache: InitPositionTransactionCache = {})
async initPositionTransaction(initPosition: InitPosition, cache: InitPositionTransactionCache = {})
async initPosition(initPosition: InitPosition, signer: Keypair, cache: InitPositionTransactionCache = {})
```

#### Params

```ts
export interface InitPosition {
  pair: Pair;
  owner?: PublicKey;
  userTokenX: PublicKey;
  userTokenY: PublicKey;
  lowerTick: number;
  upperTick: number;
  liquidityDelta: BN;
  knownPrice: BN;
  slippage: BN;
}
```

| Name           | Type      | Description                                                                            |
| -------------- | --------- | -------------------------------------------------------------------------------------- |
| pair           | Pair      |                                                                                        |
| owner          | PublicKey | Account that will pay for allocation                                                   |
| signer         | Keypair   | Account that will sign the transaction                                                 |
| lowerTick      | number    | Lower tick index for the position                                                      |
| upperTick      | number    | Upper tick index for the position                                                      |
| liquidityDelta | BN        | liquidity of the position                                                              |
| knownPrice     | BN        | Price at which the position should be crated                                           |
| slippage       | BN        | Slippage is based on price impact and calculated by dividing by `DENOMINATOR` (10^12). |
| userTokenX     | PublicKey | User tokenX account                                                                    |
| userTokenY     | PublicKey | User tokenY account                                                                    |

#### Return

| Method                  | Description                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| initPositionInstruction | Create position instruction                                                                                                                                                                                        |
| initPositionTransaction | Transaction with create position instruction. If either of the ticks or position list doesn't exist, transaction will contain createTick instructions for the position ticks, and createPositionList instructions. |

### InitPoolAndPosition

This methods combines create pool and create position into one method.

```ts
async initPoolAndPositionTx(createPool: InitPoolAndPosition, payer?: Keypair, cache: initPoolAndPositionCache = {})
async initPoolAndPosition(createPool: InitPoolAndPosition, signer: Keypair, cache: initPoolAndPositionCache = {})
```

#### Params

```ts
export interface InitPoolAndPosition extends InitPosition {
  initTick?: number;
}
```

#### Return

| Name           | Type        | Description                                                                                                                                                         |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initPoolTx     | Transaction | Create pool transaction. Containing initReserves and createPool instructions.                                                                                       |
| initPositionTx | Transaction | Transaction with create position instruction and createTick instructions. If position list doesn't exist, transaction will contain createPositionList instructions. |
| signers        | Keypair[]   | Array of signers with reserve and tickmap accounts.                                                                                                                 |

### Swap

Performs a swap operation on the protocol. This function allows for passing Tick account addresses explicitly or computes them based on the limit provided in `{tickCrosses: LIMIT}` struct. In case of swaps where native tokens are used and the transaction is batched with creating, initializing and unwrapping ata account limit is given by `TICK_CROSSES_PER_IX_NATIVE_TOKEN` and should be passed explicitly. Determine necessary tick addresses based on `simulateSwap` function to lower the transaction cost.

```ts
async swapInstruction(swap: Swap, cache: SwapCache = {}, ticks: Ticks = { tickCrosses: TICK_CROSSES_PER_IX })
async swapTransaction(swap: Swap, cache: SwapCache = {}, ticks: Ticks = { tickCrosses: TICK_CROSSES_PER_IX })
async swap(swap: Swap, signer: Keypair, cache: SwapCache = {}, ticks: Ticks = { tickCrosses: TICK_CROSSES_PER_IX })
```

#### Params

```ts
export interface Swap {
  pair: Pair;
  owner?: PublicKey;
  xToY: boolean;
  amount: BN;
  estimatedPriceAfterSwap: Decimal;
  slippage: Decimal;
  accountX: PublicKey;
  accountY: PublicKey;
  byAmountIn: boolean;
  referralAccount?: PublicKey;
}
```

| Name                    | Type      | Description                                                                                                  |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| signer                  | PublicKey | Signer of the transaction.                                                                                   |
| owner                   | PublicKey | Owner of the token accounts.                                                                                 |
| slippage                | BN        | Slippage is based on price impact and calculated by dividing by `DENOMINATOR` (10^12).                       |
| estimatedPriceAfterSwap | BN        | Variable affected by slippage; swap will fail if the final price exceeds the slippage-adjusted target price. |
| pair                    | Pair      | Unique pool identifier                                                                                       |
| accountX                | PublicKey | User's account for `tokenX`; must exist before the swap is performed.                                        |
| accountY                | PublicKey | User's account for `tokenY`; must exist before the swap is performed.                                        |
| byAmountIn              | boolean   | Specifies whether the `amount` is used as input (`True`) or output (`False`).                                |
| xToY                    | boolean   | Determines the direction of the swap, either from `tokenX` to `tokenY` or vice versa.                        |
| referralAccount         | PublicKey | Optional parameter that allows the user to specify if the referral fees should be applied                    |
| ticks                   | Ticks     | Tick limit for the swap or tick addresses                                                                    |

#### Return

Swap instruction or transaction with swap instruction.

### ClaimFee

```ts
async claimFeeInstruction(claimFee: ClaimFee, cache: ClaimFeeCache = {})
async claimFeeTransaction(claimFee: ClaimFee, cache: ClaimFeeCache = {})
async claimFee(claimFee: ClaimFee, signer: Keypair, cache: ClaimFeeCache = {})
```

#### Params

```ts
export interface ClaimFee {
  pair: Pair;
  owner?: PublicKey;
  userTokenX: PublicKey;
  userTokenY: PublicKey;
  index: number;
}
```

| Name       | Type      | Description                                                                 |
| ---------- | --------- | --------------------------------------------------------------------------- |
| pair       | Pair      | Unique pool identifier.                                                     |
| signer     | PublicKey | Signer of the transaction.                                                  |
| owner      | PublicKey | Owner of the token accounts and the position.                               |
| index      | number    | Index of the position to claim fee from.                                    |
| userTokenX | PublicKey | User's token account for `tokenX`; must exist before the swap is performed. |
| userTokenY | PublicKey | User's token account for `tokenY`; must exist before the swap is performed. |

#### Returns

Claim fee instruction or transaction with claim fee instruction.

### WithdrawProtocolFee

```ts
async withdrawProtocolFeeInstruction(withdrawProtocolFee: WithdrawProtocolFee, cache: WithdrawProtocolFeeCache = {})
async withdrawProtocolFeeTransaction(withdrawProtocolFee: WithdrawProtocolFee, cache: WithdrawProtocolFeeCache = {})
async withdrawProtocolFee(withdrawProtocolFee: WithdrawProtocolFee, signer: Keypair, cache: WithdrawProtocolFeeCache = {})
```

#### Params

```ts
export interface WithdrawProtocolFee {
  pair: Pair;
  accountX: PublicKey;
  accountY: PublicKey;
  admin?: PublicKey;
}
```

| Name     | Type      | Description                                                                  |
| -------- | --------- | ---------------------------------------------------------------------------- |
| pair     | Pair      | Unique pool identifier.                                                      |
| signer   | PublicKey | Signer of the transaction.                                                   |
| admin    | PublicKey | Owner of the token accounts and the fee receiver for the pool.               |
| accountX | PublicKey | Admin's token account for `tokenX`; must exist before the swap is performed. |
| accountY | PublicKey | Admin's token account for `tokenY`; must exist before the swap is performed. |

#### Return

Returns withdraw protocol fee instruction or transaction with protocol fee instruction.

### UpdateSecondsPerLiquidity

```ts
async updateSecondsPerLiquidityInstruction(updateSecondsPerLiquidity: UpdateSecondsPerLiquidity)
async updateSecondsPerLiquidityTransaction(updateSecondsPerLiquidity: UpdateSecondsPerLiquidity)
async updateSecondsPerLiquidity(updateSecondsPerLiquidity: UpdateSecondsPerLiquidity, signer: Keypair)
```

#### Params

```ts
export interface UpdateSecondsPerLiquidity {
  pair: Pair;
  owner?: PublicKey;
  signer?: PublicKey;
  lowerTickIndex: number;
  upperTickIndex: number;
  index: number;
}
```

| Name           | Type      | Description                       |
| -------------- | --------- | --------------------------------- |
| pair           | Pair      | Unique pool identifier.           |
| signer         | PublicKey | Signer of the transaction.        |
| owner          | PublicKey | Owner of the position             |
| lowerTickIndex | number    | Lower tick index for the position |
| upperTickIndex | number    | Upper tick index for the position |

#### Return

Return update seconds per liquidity instruction or transaction with the update seconds per liquidity instruction.

### ChangeProtocolFee

```ts
async changeProtocolFeeInstruction(changeProtocolFee: ChangeProtocolFee)
async changeProtocolFeeTransaction(changeProtocolFee: ChangeProtocolFee)
async changeProtocolFee(changeProtocolFee: ChangeProtocolFee, signer: Keypair)
```

#### Params

```ts
export interface ChangeProtocolFee {
  pair: Pair;
  admin?: PublicKey;
  protocolFee: BN;
}
```

| Name        | Type      | Description                |
| ----------- | --------- | -------------------------- |
| pair        | Pair      | Unique pool identifier.    |
| signer      | PublicKey | Signer of the transaction. |
| admin       | PublicKey | Admin of the protocol.     |
| protocolFee | BN        | New protocol fee.          |

#### Return

Returns change protocol fee instruction or transaction with protocol fee instruction.

### TransferPositionOwnership

```ts
async transferPositionOwnershipInstruction(transferPositionOwnership: TransferPositionOwnership, cache: TransferPositionCache = {})
async transferPositionOwnershipTransaction(transferPositionOwnership: TransferPositionOwnership, cache: TransferPositionCache = {})
async transferPositionOwnership(transferPositionOwnership: TransferPositionOwnership, signer: Keypair, cache: TransferPositionCache = {})
```

### Params

```ts
export interface TransferPositionOwnership {
  owner?: PublicKey;
  recipient?: PublicKey;
  index: number;
}
```

| Name      | Type      | Description                            |
| --------- | --------- | -------------------------------------- |
| signer    | Keypair   | Signer of the transaction.             |
| owner     | PublicKey | Owner of the transferred position.     |
| recipient | PublicKey | Recipient of the transferred position. |
| index     | number    | Index of the transferred position.     |

## Simple Queries

### getTickmap

Returns a tickmap for the given pair.

```ts
async getTickmap(pair: Pair, pool?: { tickmap: PublicKey }): Promise<Tickmap>
```

### Params

| Name | Type                   | Description                                               |
| ---- | ---------------------- | --------------------------------------------------------- |
| pair | Pair                   | Unique pool identifier.                                   |
| pool | { tickmap: PublicKey } | Struct containing tickmap address to avoid extra fetches. |

### getFeeTier

Fetches fee tier account if it exits.

```ts
async getFeeTier(feeTier: FeeTier): Promise<FeeTier>
```

#### Params

| Name    | Type    | Description       |
| ------- | ------- | ----------------- |
| feeTier | FeeTier | FeeTier to fetch. |

### getPoolByAddress

Fetches a pool based on it's address.

```ts
async getPoolByAddress(address: PublicKey): Promise<PoolStructure>
```

#### Params

| Name    | Type      | Description  |
| ------- | --------- | ------------ |
| address | PublicKey | PoolAddress. |

### getPool

Fetches a pool based on it's address.

```ts
async getPool(pair: Pair): Promise<PoolStructure>
```

#### Params

| Name | Type | Description             |
| ---- | ---- | ----------------------- |
| pair | Pair | Unique pool identifier. |

### isInitialized

Checks if a tick is initialized for a given pool.

```ts
async isInitialized(pair: Pair, index: number, pool?: { tickmap: PublicKey; tickSpacing: number }, tickmap?: Tickmap): Promise<boolean>
```

#### Params

| Name    | Type                                        | Description                                            |
| ------- | ------------------------------------------- | ------------------------------------------------------ |
| pair    | Pair                                        | Unique pool identifier.                                |
| index   | number                                      | Index of the tick.                                     |
| pool    | { tickmap: PublicKey; tickSpacing: number } | Pool data containing tickmap address and tick spacing. |
| tickmap | Tickmap                                     | Tickmap account data for the pool.                     |

### getTick

Fetches a tick account.

```ts
async getTick(pair: Pair, index: number): Promise<Tick>
```

#### Params

| Name  | Type   | Description             |
| ----- | ------ | ----------------------- |
| pair  | Pair   | Unique pool identifier. |
| index | number | Index of the tick.      |

### getTickByPool

Fetches a tick account based on pool address.

```ts
async getTickByPool(poolAddress: PublicKey, index: number): Promise<Tick>
```

#### Params

| Name        | Type      | Description           |
| ----------- | --------- | --------------------- |
| poolAddress | PublicKey | Pool account address. |
| index       | number    | Index of the tick.    |

### getPositionList

Fetches the position list.

```ts
async getPositionList(owner: PublicKey): Promise<PositionList>
```

#### Params

| Name  | Type      | Description                 |
| ----- | --------- | --------------------------- |
| owner | PublicKey | Owner of the position list. |

### getPosition

Returns position account.

```ts
async getPosition(owner: PublicKey, index: number): Promise<Position>
```

#### Params

| Name  | Type      | Description                        |
| ----- | --------- | ---------------------------------- |
| owner | PublicKey | Owner of the position list.        |
| index | number    | Index of the position in the list. |

### getState

Returns the state account.

```ts
async getState(): Promise<State>
```

### getOracle

Fetches oracle account.

```ts
async getOracle(pair: Pair, pool?: { oracleAddress: PublicKey }): Promise<Oracle>
```

#### Params

| Name | Type                      | Description                       |
| ---- | ------------------------- | --------------------------------- |
| pair | Pair                      | Unique pool identifier.           |
| pool | {oracleAddress:PublicKey} | Struct containing oracle address. |

## Complex Queries

### getAllPosition

Returns all position for invariant

```ts
async getAllPositions(): Promise<Position[]>
```

### getAllPools

Returns all the pools which exist on invariant.

```ts
async getAllPools(): Promise<PoolStructure[]>
```

### getAllIndexedTicks

Gets all ticks for given pair and creates a Map from number to Tick.

```ts
async getAllIndexedTicks(pair: Pair): Promise<Map<number, Tick>>
```

#### Params

| Name | Type | Description             |
| ---- | ---- | ----------------------- |
| pair | Pair | Unique pool identifier. |

### getAllTicks

Fetches all ticks for a pool.

```ts
async getAllTicks(pair: Pair): Promise<Tick[]>
```

#### Params

| Name | Type | Description             |
| ---- | ---- | ----------------------- |
| pair | Pair | Unique pool identifier. |

### getLiquidityOnTicks

Returns an array of Ticks containing only liquidity values and indexes.

```ts
async getLiquidityOnTicks(pair: Pair): Promise<{liquidity:BN, index: number}>
```

#### Params

| Name | Type | Description             |
| ---- | ---- | ----------------------- |
| pair | Pair | Unique pool identifier. |

### getAllUserLockedPositions

Fetches all locked user positions.

```ts
async getAllUserLockedPositions(owner: PublicKey): Promise<LockedPosition[]>
```

#### Params

| Name  | Type      | Description            |
| ----- | --------- | ---------------------- |
| owner | PublicKey | Owner of the position. |

### getAllUserPositions

Fetches all locked user positions.

```ts
async getAllUserPositions(owner: PublicKey): Promise<PositionStructure[]>
```

#### Params

| Name  | Type      | Description            |
| ----- | --------- | ---------------------- |
| owner | PublicKey | Owner of the position. |

### getPositionsForPool

Fetches all position for a given pool.

```ts
async getPositionsForPool(pool: PublicKey): Promise<Position[]>
```

#### Params

| Name | Type      | Description   |
| ---- | --------- | ------------- |
| pool | PublicKey | Pool address. |

#### getPositionsFromRange

Fetches user positions for a specified range. Range should start at 0 or higher and end at position list head or lower.

```ts
async getPositionsFromRange(owner: PublicKey, lowerIndex: number, upperIndex: number): Promise<Position[]>
```

#### Params

| Name       | Type      | Description                |
| ---------- | --------- | -------------------------- |
| owner      | PublicKey | Position owner public key. |
| lowerIndex | number    | Min index of the range.    |
| upperIndex | number    | Max index of the range.    |

#### getPositionsFromIndexes

Fetches an array of users positions.

```ts
async getPositionsFromIndexes(owner: PublicKey, indexes: number[]): Promise<Position[]>
```

#### Params

| Name    | Type      | Description                     |
| ------- | --------- | ------------------------------- |
| owner   | PublicKey | Position owner public key.      |
| indexes | number[]  | Indexes of the owner positions. |

### getAllPoolLiquidityInTokens

Returns the total liquidity amount for a pool expressed in tokens.

```ts
async getAllPoolLiquidityInTokens(poolAddress: PublicKey): Promise<BN>
```

#### Params

| Name        | Type      | Description           |
| ----------- | --------- | --------------------- |
| poolAddress | PublicKey | Pool account address. |

### getActiveLiquidityInTokens

Returns the total active liquidity amount for a pool expressed in tokens.

```ts
async getActiveLiquidityInTokens(poolAddress: PublicKey, currentTickIndex: number): Promise<BN>
```

#### Params

| Name             | Type      | Description                      |
| ---------------- | --------- | -------------------------------- |
| poolAddress      | PublicKey | Pool account address.            |
| currentTickIndex | number    | Current price index of the pool. |

### getReserveBalances

Returns current balances of the pool.

```ts
async getReserveBalances(pair: Pair): Promise<{x: BN, y: BN}>
```

#### Params

| Name | Type | Description             |
| ---- | ---- | ----------------------- |
| pair | Pair | Unique pool identifier. |

#### Return

| Name | Type | Description                    |
| ---- | ---- | ------------------------------ |
| x    | BN   | Balance of the token X reserve |
| y    | BN   | Balance of the token Y reserve |

### getGlobalFee

Returns token fees approximation for a pool.

```ts
async getGlobalFee(pair: Pair, pool?: PoolStructure): Promise<{feeX: BN, feeY: BN}>
```

#### Params

| Name | Type          | Description             |
| ---- | ------------- | ----------------------- |
| pair | Pair          | Unique pool identifier. |
| pool | PoolStructure | Prefetched pool state.  |

#### Return

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| feeX | BN   | Collected token X fee. |
| feeY | BN   | Collected token Y fee. |

### getVolume

Returns token volumes for a pool.

```ts
async getVolume(pair: Pair, pool?: PoolStructure): Promise<{volumeX: BN, volumeY: BN}>
```

#### Params

| Name | Type          | Description             |
| ---- | ------------- | ----------------------- |
| pair | Pair          | Unique pool identifier. |
| pool | PoolStructure | Prefetched pool state.  |

#### Return

| Name    | Type | Description     |
| ------- | ---- | --------------- |
| volumeX | BN   | Token X volume. |
| volumeY | BN   | Token Y volume. |

### getPairLiquidityValues

Returns token values of liquidity for a pool.

```ts
async getPairLiquidityValues(pair: Pair, cachedPool?: PoolStructure): Promise<{liquidityX: BN, liquidityY: BN }>
```

#### Params

| Name       | Type          | Description             |
| ---------- | ------------- | ----------------------- |
| pair       | Pair          | Unique pool identifier. |
| cachedPool | PoolStructure | Prefetched pool state.  |

#### Return

| Name       | Type | Description        |
| ---------- | ---- | ------------------ |
| liquidityX | BN   | Token X liquidity. |
| liquidityY | BN   | Token Y liquidity. |

### getWholeLiquidity

Returns total liquidity for a pool.

```ts
async getWholeLiquidity(pair: Pair): Promise<BN>
```

#### Params

| Name | Type | Description             |
| ---- | ---- | ----------------------- |
| pair | Pair | Unique pool identifier. |

## Account addresses

### getTickAddress

```ts
getTickAddress(pair: Pair, index: number): {tickAddress: PublicKey, tickBump: number}
```

#### Params

| Name  | Type   | Description                    |
| ----- | ------ | ------------------------------ |
| pair  | Pair   | Pool on which the tick exists. |
| index | number | Index of the tick.             |

### getTickAddressByPool

```ts
getTickAddressByPool(poolAddress: PublicKey, index: number): {tickAddress: PublicKey, tickBump: number}
```

#### Params

| Name        | Type      | Description                                   |
| ----------- | --------- | --------------------------------------------- |
| poolAddress | PublicKey | Address of the pool on which the tick exists. |
| index       | number    | Index of the tick.                            |

### getPositionListAddress

```ts
getPositionListAddress(owner: PublicKey): {positionListAddress: PublicKey, positionListBump: number}
```

#### Params

| Name  | Type      | Description                         |
| ----- | --------- | ----------------------------------- |
| owner | PublicKey | Address of the position list owner. |

### getPositionAddress

```ts
getPositionAddress(owner: PublicKey, index: number): {positionAddress: PublicKey, positionBump: number}
```

#### Params

| Name  | Type      | Description                                 |
| ----- | --------- | ------------------------------------------- |
| owner | PublicKey | Address of the position list owner.         |
| index | number    | Index of the position on the position list. |

### getNewPositionAddress

Returns the address of a new position.

```ts
async getNewPositionAddress(owner: PublicKey, positionListHead?: number)
```

#### Params

| Name             | Type      | Description                                                                    |
| ---------------- | --------- | ------------------------------------------------------------------------------ |
| owner            | PublicKey | Owner of the position list.                                                    |
| positionListHead | number    | Head of the position in the list; it will be fetched if not passed explicitly. |

### getStateAddress

Returns the state address.

```ts
getStateAddress(): AddressAndBump
```

### getFeeTierAddress

```ts
getFeeTierAddress(feeTier: FeeTier)
```

#### Params

| Name    | Type    | Description     |
| ------- | ------- | --------------- |
| feeTier | FeeTier | FeeTier struct. |

# Utils

## MIN_BALANCE_FOR_RENT_EXEMPT

Utility used when creating pool to avoid fetching data that will most likely remain constant.

```ts
export const MIN_BALANCE_FOR_RENT_EXEMPT = {
  [Network.LOCAL]: 2039280, // AnchorProvider defaults to solana's minimum amount
  [Network.DEV]: 19924,
  [Network.TEST]: 19924,
  [Network.MAIN]: 19924,
};
```

## FEE_TIERS

To create or choose a pool you must first choose a fee Tier. FeeTiers are created by the contract administrator, and the current list of them is stored in the sdk under `FEE_TIERS`. These are possible feeTiers on which the pools may exist. Creating pairs with them and fetching the pools is one of the ways of acquiring existing pools.

```ts
export const FEE_TIERS: FeeTier[] = [
  { fee: fromFee(new BN(10)), tickSpacing: 1 },
  { fee: fromFee(new BN(20)), tickSpacing: 5 },
  { fee: fromFee(new BN(50)), tickSpacing: 5 },
  { fee: fromFee(new BN(100)), tickSpacing: 10 },
  { fee: fromFee(new BN(300)), tickSpacing: 30 },
  { fee: fromFee(new BN(1000)), tickSpacing: 100 },
];
```

## Swap simulation

Swap simulation provides all data necessary to perform a swap.

```ts
export interface SimulateSwapInterface {
  xToY: boolean
  byAmountIn: boolean
  swapAmount: BN
  priceLimit?: BN
  slippage: BN
  ticks: Map<number, Tick>
  tickmap: Tickmap
  pool: PoolData
  maxVirtualCrosses: number | undefined
  maxCrosses: number | undefined
}

export interface SimulationResult {
  status: SimulationStatus
  amountPerTick: BN[]
  crossedTicks: number[]
  accumulatedAmountIn: BN
  accumulatedAmountOut: BN
  accumulatedFee: BN
  minReceived: BN
  priceImpact: BN
  priceAfterSwap: BN
}

export const simulateSwap = (swapParameters: SimulateSwapInterface): SimulationResult
```

### Input

| Name              | Type               | Description                                                                                                      |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| maxVirtualCrosses | number             | Limit for virtual crosses, should be set to `TICK_VIRTUAL_CROSSES_PER_IX`                                        |
| maxCrosses        | number             | Limit on the number of accounts that can be used for ticks                                                       |
| tickmap           | Tickmap            | Tickmap state                                                                                                    |
| pool              | Pool               | Pool state                                                                                                       |
| ticks             | Map<number, Tick\> | Map from tick index to tick account                                                                              |
| priceLimit        | BN                 | If omitted, allows the simulation to continue until reaching either the cross limit or the pool's limiting price |
| slippage          | BN                 | slippage to be applied on the price limit                                                                        |

### Output

| Name                 | Type             | Description                                                                       |
| -------------------- | ---------------- | --------------------------------------------------------------------------------- |
| status               | SimulationStatus | Contains an error if there was one                                                |
| crossedTicks         | number[]         | Contains the indexes of the ticks that are necessary for the swap to be performed |
| accumulatedAmountIn  | BN               | Contains the input amount for the swap                                            |
| accumulatedAmountOut | BN               | Expected output amount                                                            |
| accumulatedFee       | BN               | Fee amount that will be paid                                                      |
| minReceived          | BN               | Lowest amount of tokens that could be gained from the swap                        |
| priceImpact          | BN               | Impact on the price after the swap                                                |
| priceAfterSwap       | BN               | Estimated value of the price after the swap is completed                          |

The following is an example of usage.

```ts
const poolData = await market.getPool(pair);
const tickmap = await market.getTickmap(pair, pool);
const ticks = await market.getAllIndexedTicks(pair);

const simProps: SimulateSwapInterface = {
  xToY: true,
  byAmountIn: true,
  swapAmount: new BN(1e10),
  priceLimit: poolData.sqrtPrice,
  slippage: new BN(DENOMINATOR),
  ticks,
  tickmap,
  pool: poolData,
  maxCrosses: TICK_CROSSES_PER_IX,
};

const result = simulateSwap(simProps);

if (simulation.status != SimulationStatus.Ok) {
  throw new Error(simulation.status);
}
```

## NativeAtaUtils

These utils can be used for creating native ata instructions. These can be chained with protocol instructions to create an atomic transaction.

```ts
export const createNativeAtaInstructions = (
  nativeAccount: PublicKey,
  owner: PublicKey,
  network: Network
): WrappedEthInstructions
```

```ts
export const createNativeAtaWithTransferInstructions = (
  nativeAccount: PublicKey,
  owner: PublicKey,
  network: Network,
  nativeAmount: number
): WrappedEthTransferInstructions
```

### Params

| Name          | Type      | Description                                |
| ------------- | --------- | ------------------------------------------ |
| nativeAccount | PublicKey | Wrapped eth account address.               |
| owner         | PublicKey | Account that will own the new ata account. |
| network       | Network   | Used to determine rent exemption fee.      |
| nativeAmount  | number    | Amount of native tokens.                   |

### Output

```ts
export interface WrappedEthInstructions {
  createIx: TransactionInstruction;
  initIx: TransactionInstruction;
  unwrapIx: TransactionInstruction;
}
```

```ts
export interface WrappedEthTransferInstructions extends WrappedEthInstructions {
  transferIx: TransactionInstruction;
}
```

| Name       | Type                   | Description                                                          |
| ---------- | ---------------------- | -------------------------------------------------------------------- |
| createIx   | TransactionInstruction | Instruction used for creating new account.                           |
| initIx     | TransactionInstruction | Instruction used for initializing new account.                       |
| unwrapIx   | TransactionInstruction | Instruction used for removing ata after completed transaction.       |
| transferIx | TransactionInstruction | Transfer instruction only needed if you pass tokens to the protocol. |

# Types

## State types

State types are typescript representation of anchor accounts. `Raw` Prefix indicates that the wrapper types are still in `Decimal` form and must be parsed.

```ts
export interface Decimal {
  v: BN;
}
```

```ts
export interface State {
  admin: PublicKey;
  nonce: number;
  authority: PublicKey;
  bump: number;
}
```

```ts
export interface RawFeeTierStructure {
  fee: Decimal;
  tickSpacing: number;
  bump: number;
}
```

```ts
export interface FeeTierStructure {
  fee: BN;
  tickSpacing: number;
  bump: number;
}
```

```ts
export interface RawPoolStructure {
  tokenX: PublicKey;
  tokenY: PublicKey;
  tokenXReserve: PublicKey;
  tokenYReserve: PublicKey;
  positionIterator: BN;
  tickSpacing: number;
  fee: Decimal;
  protocolFee: Decimal;
  liquidity: Decimal;
  sqrtPrice: Decimal;
  currentTickIndex: number;
  tickmap: PublicKey;
  feeGrowthGlobalX: Decimal;
  feeGrowthGlobalY: Decimal;
  feeProtocolTokenX: BN;
  feeProtocolTokenY: BN;
  secondsPerLiquidityGlobal: Decimal;
  startTimestamp: BN;
  lastTimestamp: BN;
  feeReceiver: PublicKey;
  oracleAddress: PublicKey;
  oracleInitialized: boolean;
  bump: number;
}
```

```ts
export interface PoolStructure {
  tokenX: PublicKey;
  tokenY: PublicKey;
  tokenXReserve: PublicKey;
  tokenYReserve: PublicKey;
  positionIterator: BN;
  tickSpacing: number;
  fee: BN;
  protocolFee: BN;
  liquidity: BN;
  sqrtPrice: BN;
  currentTickIndex: number;
  tickmap: PublicKey;
  feeGrowthGlobalX: BN;
  feeGrowthGlobalY: BN;
  feeProtocolTokenX: BN;
  feeProtocolTokenY: BN;
  secondsPerLiquidityGlobal: BN;
  startTimestamp: BN;
  lastTimestamp: BN;
  feeReceiver: PublicKey;
  oracleAddress: PublicKey;
  oracleInitialized: boolean;
  bump: number;
}
```

```ts
export interface Tickmap {
  bitmap: number[];
}
```

```ts
export interface PositionList {
  head: number;
  bump: number;
}
```

```ts
export interface RawTick {
  pool: PublicKey;
  index: number;
  sign: boolean;
  liquidityChange: Decimal;
  liquidityGross: Decimal;
  sqrtPrice: Decimal;
  feeGrowthOutsideX: Decimal;
  feeGrowthOutsideY: Decimal;
  secondsPerLiquidityOutside: Decimal;
  bump: number;
}
```

```ts
export interface Tick {
  pool: PublicKey;
  index: number;
  sign: boolean;
  liquidityChange: BN;
  liquidityGross: BN;
  sqrtPrice: BN;
  feeGrowthOutsideX: BN;
  feeGrowthOutsideY: BN;
  secondsPerLiquidityOutside: BN;
  bump: number;
}
```

```ts
export interface RawPosition {
  owner: PublicKey;
  pool: PublicKey;
  id: BN;
  liquidity: Decimal;
  lowerTickIndex: number;
  upperTickIndex: number;
  feeGrowthInsideX: Decimal;
  feeGrowthInsideY: Decimal;
  secondsPerLiquidityInside: Decimal;
  lastSlot: BN;
  tokensOwedX: Decimal;
  tokensOwedY: Decimal;
  bump: number;
}
```

```ts
export interface Position {
  owner: PublicKey;
  pool: PublicKey;
  id: BN;
  liquidity: BN;
  lowerTickIndex: number;
  upperTickIndex: number;
  feeGrowthInsideX: BN;
  feeGrowthInsideY: BN;
  secondsPerLiquidityInside: BN;
  lastSlot: BN;
  tokensOwedX: BN;
  tokensOwedY: BN;
  bump: number;
}
```

```ts
export interface PositionStructure {
  tokenX: PublicKey;
  tokenY: PublicKey;
  feeTier: FeeTier;
  amountTokenX: BN;
  amountTokenY: BN;
  lowerPrice: BN;
  upperPrice: BN;
  unclaimedFeesX: BN;
  unclaimedFeesY: BN;
}
```

```ts
export interface FeeTier {
  fee: BN;
  tickSpacing: number;
}
```

## Cache Types

Cache types are a combination of queryable state information that must be passed if you wish to avoid querying additional data and maximize the speed.
`pool`, `positionList`, `tickmap`, `position` fields correspond to real state that can be fetched. In case of `positionList` you must additionally specify if the list is initialized (i.e. the account exists already).
`TickmapWithReserves` type serves as a thinner interface on pool state.

`tokenXProgram`/`tokenXProgramAddress` and `tokenYProgram`/`tokenYProgramAddress` are used to store the associated token program address (SPL or Token 2022).
`lowerTickExists` and `upperTickExists` indicate the state of the ticks for the position you wish to create.
`minRentExemption` contains the minimum amount of tokens that are needed for an account to be exempt from rent.

```ts
export interface PositionListCache {
  initialized: boolean;
  head: number;
}
```

```ts
export interface TickmapWithReserves {
  tokenXReserve: PublicKey;
  tokenYReserve: PublicKey;
  tickmap: PublicKey;
}
```

```ts
export interface InitPositionInstructionCache {
  pool?: TickmapWithReserves;
  positionList?: PositionListCache;
  tokenXProgramAddress?: PublicKey;
  tokenYProgramAddress?: PublicKey;
}
```

```ts
export interface InitPositionTransactionCache
  extends InitPositionInstructionCache {
  lowerTickExists?: boolean;
  upperTickExists?: boolean;
}
```

```ts
export interface CreateTickInstructionCache {
  pool?: { tickmap: PublicKey };
  tokenXProgramAddress?: PublicKey;
  tokenYProgramAddress?: PublicKey;
}
```

```ts
export interface CreatePoolCache {
  minRentExemption?: number;
  tokenXProgramAddress?: PublicKey;
  tokenYProgramAddress?: PublicKey;
}
```

```ts
export interface initPoolAndPositionCache extends CreatePoolCache {
  positionList?: PositionListCache;
}
```

```ts
export interface SwapCache {
  tickmap?: Tickmap;
  pool?: PoolStructure;
  tokenXProgram?: PublicKey;
  tokenYProgram?: PublicKey;
}
```

```ts
export interface ClaimFeeCache {
  position?: Position;
  pool?: PoolStructure;
  tokenXProgram?: PublicKey;
  tokenYProgram?: PublicKey;
}
```

```ts
export interface WithdrawProtocolFeeCache {
  pool?: PoolStructure;
  tokenXProgram?: PublicKey;
  tokenYProgram?: PublicKey;
}
```

```ts
export interface RemovePositionCache {
  pool?: PoolStructure;
  position?: Position;
  positionList?: PositionList;
  tokenXProgram?: PublicKey;
  tokenYProgram?: PublicKey;
}
```

```ts
export interface TransferPositionCache {
  ownerPositionList?: PositionList;
  recipientPositionList?: PositionList;
}
```

## Other

```ts
type TickAddresses = {
  tickAddresses: PublicKey[];
  tickCrosses?: never;
};
```

```ts
type TickCrosses = {
  tickCrosses: number;
  tickAddresses?: never;
};
```

```ts
type Ticks = NonNullable<TickAddresses | TickCrosses>;
```
