---
title: Minting a Position

slug: /eclipse/minting_position
---
## Introduction
After pool creation you can create position (see [`create_position.rs`](https://github.com/invariant-labs/protocol-eclipse/blob/main/programs/invariant/src/instructions/create_position.rs)).

You will learn how to create a new liquidity position, add liquidity, and then remove liquidity in this guide.
### FeeTier
FeeTier represents the amount of fee that would be deduced on a pool and tick spacing.

```ts
export interface FeeTier {
  fee: BN
  tickSpacing?: number
}
```

FeeTiers are created by the contract administrator, and the current list of them is stored in the sdk under `FEE_TIERS`
```ts
export const FEE_TIERS: FeeTier[] = [
  { fee: fromFee(new BN(10)), tickSpacing: 1 },
  { fee: fromFee(new BN(20)), tickSpacing: 5 },
  { fee: fromFee(new BN(50)), tickSpacing: 5 },
  { fee: fromFee(new BN(100)), tickSpacing: 10 },
  { fee: fromFee(new BN(300)), tickSpacing: 30 },
  { fee: fromFee(new BN(1000)), tickSpacing: 100 }
]
```

```ts
constructor(first: PublicKey, second: PublicKey, feeTier: FeeTier)

let pair = new Pair(tokenA, tokenB, feeTier)
```

### Pair
Pair is a pool identifier, that consists of feeTier, tokenX and tokenY.
```ts
export class Pair {
  public tokenX: PublicKey
  public tokenY: PublicKey
  public feeTier: FeeTier
  public feeTierAddress: PublicKey | null
  public tickSpacing: number
}
```
Note that the pair should newer be created manually since tokenX and Y must be sorted in the same way as the contract would sort them. To ensure that's the case use the dedicated constructor.
```ts
constructor(first: PublicKey, second: PublicKey, feeTier: FeeTier)

let pair = new Pair(tokenA, tokenB, feeTier)
```

### CreateTick
Market method used to create a tick.
```ts
export interface CreateTick {
  pair: Pair 
  index: number
  payer?: PublicKey
}

async createTick(createTick: CreateTick, signer: Keypair)
```
| Name      | Description                                                                        |
|-----------|------------------------------------------------------------------------------------|
| `index`   | Tick index                                                                         |
| `payer`   | Account that will pay for allocation                                               |
| `pair`    | Combination of `feeTier`, `tokenX`, and `tokenY` that uniquely identifies the pool |
| `signer`  | Account that will sign the transaction                                             |

### InitPosition
Market method used to create a position list.

```ts
export interface InitPosition {
  pair: Pair
  owner?: PublicKey
  userTokenX: PublicKey
  userTokenY: PublicKey
  lowerTick: number
  upperTick: number
  liquidityDelta: Decimal
  knownPrice: Decimal
  slippage: Decimal
}

async initPosition(initPosition: InitPosition, signer: Keypair)
```

| Name             | Description                                                                            |
|------------------|----------------------------------------------------------------------------------------|
| `owner`          | Account that will pay for allocation                                                   |
| `signer`         | Account that will sign the transaction                                                 |
| `pair`           | Combination of `feeTier`, `tokenX`, and `tokenY` that uniquely identifies the pool     |
| `lowerTick`      | Lower tick index for the position                                                      |
| `upperTick`      | Upper tick index for the position                                                      |
| `liquidityDelta` | liquidity of the position                                                              |
| `knownPrice`     | Price at which the position should be crated                                           |
| `slippage`       | Slippage is based on price impact and calculated by dividing by `DENOMINATOR` (10^12). |
| `userTokenX`     | User tokenX account                                                                    |
| `userTokenY`     | User tokenY account                                                                    |

### InitPoolAndPosition
Market method used to create a position list.

```ts
export interface InitPoolAndPosition {
  pair: Pair
  owner?: PublicKey
  userTokenX: PublicKey
  userTokenY: PublicKey
  lowerTick: number
  upperTick: number
  liquidityDelta: Decimal
  knownPrice: Decimal
  slippage: Decimal
  initTick?: number
}

async initPoolAndPosition(createPool: InitPoolAndPosition, signer: Keypair) 
```

| Name             | Description                                                                            |
|------------------|----------------------------------------------------------------------------------------|
| `owner`          | Account that will pay for allocation                                                   |
| `signer`         | Account that will sign the transaction                                                 |
| `pair`           | Combination of `feeTier`, `tokenX`, and `tokenY` that uniquely identifies the pool     |
| `lowerTick`      | Lower tick index for the position                                                      |
| `upperTick`      | Upper tick index for the position                                                      |
| `liquidityDelta` | liquidity of the position                                                              |
| `knownPrice`     | Price at which the position should be crated                                           |
| `slippage`       | Slippage is based on price impact and calculated by dividing by `DENOMINATOR` (10^12). |
| `userTokenX`     | User tokenX account                                                                    |
| `userTokenY`     | User tokenY account                                                                    |
| `initTick`       | Init tick that defines the starting price for the pool                                 |

### CreatePositionList
Market method used to create a position.

```ts
async createPositionList(owner: PublicKey, signer: Keypair)
```

| Name      | Description                                                                        |
|-----------|------------------------------------------------------------------------------------|
| `owner`   | Account that will pay for allocation                                               |
| `signer`  | Account that will sign the transaction                                             |

### RemovePosition
Market method used to create a position.

```ts
export interface RemovePosition {
  pair: Pair
  owner: PublicKey
  payer?: PublicKey
  index: number
  userTokenX: PublicKey
  userTokenY: PublicKey
}

async removePosition(removePosition: RemovePosition, signer)
```

| Name             | Description                                                                            |
|------------------|----------------------------------------------------------------------------------------|
| `owner`          | Account that will pay for transaction unless payer is specified                        |
| `payer`          | Account that will pay for transaction                                                  |
| `signer`         | Account that will sign the transaction                                                 |
| `pair`           | Combination of `feeTier`, `tokenX`, and `tokenY` that uniquely identifies the pool     |
| `userTokenX`     | User tokenX account                                                                    |
| `userTokenY`     | User tokenY account                                                                    |
| `index`          | Index of the position to remove                                                        |

## Examples
### Create position on existing pool
Ticks and position list for the position must be created if they don't exist already.
This can be done using createTick method.

```ts
// first the ticks must be created if they don't exist already
const createLowerTickVars: CreateTick = {
  pair,
  index: lowerTick,
  payer: owner.publicKey
}

const createUpperTickVars: CreateTick = {
  pair,
  index: upperTick,
  payer: owner.publicKey
}

const ticks = await market.getAllIndexedTicks(pair)
if (!ticks.get(lowerTick)) {
  await market.createTick(createLowerTickVars, owner)
}

if (!ticks.get(upperTick)) {
  await market.createTick(createUpperTickVars, owner)
}

// create position list if it doesn't exist yet
try {
  await market.getPositionList(positionOwner.publicKey)
} catch (e) {
  await market.createPositionList(positionOwner.publicKey, positionOwner)
}
```

The highest amount of the liquidity for the position can be calculated based on owned token amounts using the getLiquidity function.
```ts
export const getLiquidity = (
  x: BN,
  y: BN,
  lowerTick: number,
  upperTick: number,
  currentSqrtPrice: Decimal,
  roundingUp: boolean,
  tickSpacing?: number
): {
  x: BN
  y: BN
  liquidity: { v: BN }
}

const pool = await market.getPool(pair)
const {
  x,
  y,
  liquidity: liquidityDelta
} = getLiquidity(
  tokenXAmount,
  tokenYAmount,
  lowerTick,
  upperTick,
  pool.sqrtPrice,
  true,
  pool.tickSpacing
)

```
#### Create position on existing pool without wrapped ETH

Having all the necessary data position can be created using initPosition entrypoint.

```ts
const initPositionVars: InitPosition = {
  pair,
  owner: owner.publicKey,
  userTokenX: userTokenXAccount,
  userTokenY: userTokenYAccount,
  lowerTick,
  upperTick,
  liquidityDelta,
  knownPrice: pool.sqrtPrice,
  slippage: slippage
}
await market.initPosition(initPositionVars, positionOwner)
```
#### Create position on existing pool with wrapped ETH
```ts
let wethAmount: BN
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  wethAmount = x
} else {
  wethAmount = y
}

const createIx = SystemProgram.createAccount({
  fromPubkey: positionOwner.publicKey,
  newAccountPubkey: wrappedEthAccount.publicKey,
  lamports: await Token.getMinBalanceRentForExemptAccount(connection),
  space: 165,
  programId: TOKEN_PROGRAM_ID
})

const transferIx = SystemProgram.transfer({
  fromPubkey: positionOwner.publicKey,
  toPubkey: wrappedEthAccount.publicKey,
  lamports: wethAmount
})

const initIx = Token.createInitAccountInstruction(
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  wrappedEthAccount.publicKey,
  positionOwner.publicKey
)

const unwrapIx = Token.createCloseAccountInstruction(
  TOKEN_PROGRAM_ID,
  wrappedEthAccount.publicKey,
  positionOwner.publicKey,
  positionOwner.publicKey,
  []
)

const slippage = toDecimal(0, 0)

let initPositionVars: InitPosition

if (wrappedEthPair.tokenX === NATIVE_MINT) {
  initPositionVars = {
    pair: wrappedEthPair,
    owner: positionOwner.publicKey,
    userTokenX: wrappedEthAccount.publicKey,
    userTokenY: userTokenAccount,
    lowerTick,
    upperTick,
    liquidityDelta,
    knownPrice: pool.sqrtPrice,
    slippage: slippage
  }
} else {
  initPositionVars = {
    pair: wrappedEthPair,
    owner: positionOwner.publicKey,
    userTokenX: userTokenAccount,
    userTokenY: wrappedEthAccount.publicKey,
    lowerTick,
    upperTick,
    liquidityDelta,
    knownPrice: pool.sqrtPrice,
    slippage: slippage
  }
}

const initPositionIx = await market.initPositionTx(initPositionVars)
const tx = new Transaction()
  // first 3 ixs create a weth account
  // last one returns the funds to the wallet
  .add(createIx)
  .add(transferIx)
  .add(initIx)
  .add(initPositionIx)
  .add(unwrapIx)
await signAndSend(tx, [positionOwner, wrappedEthAccount], connection)
```

### Create pool and position
Pools price is defined by a tick index, it can be calculated as follows based on real price of the tokens. Additionally to compute the 
```ts
  const decimalsX = await tokenX.getMintInfo().then(mint => mint.decimals)
  const decimalsY = await tokenY.getMintInfo().then(mint => mint.decimals)

  const realPrice = 64000 // y to x token ratio
  const priceWithDecimals = (realPrice * Math.pow(10, decimalsX)) / Math.pow(10, decimalsY)
  const initTickPool = alignTickToSpacing(
    priceToTick(priceWithDecimals),
    otherFeeTier.tickSpacing!
  )
  const startingPrice = calculatePriceSqrt(initTickPool)
```
From this point the 
```ts
  // liquidity can be calculated using the getLiquidity function
  // it will return an amount of liquidity that can be payed for with both tokens
  const tokenXAmount = new BN(20000000)
  const tokenYAmount = new BN(20000000)
  const {
    x,
    y,
    liquidity: liquidityDelta
  } = getLiquidity(
    tokenXAmount,
    tokenYAmount,
    lowerTick,
    upperTick,
    startingPrice,
    true,
    otherPair.feeTier.tickSpacing
  )

  // the price that is calculated might differ slightly due to floating point and sdk inaccuracies so a small amount of slippage is required
  const slippage = toDecimal(1, 2)

  const initPositionVars: InitPoolAndPosition = {
    pair: otherPair,
    owner: positionOwner.publicKey,
    userTokenX: userTokenXAccount,
    userTokenY: userTokenYAccount,
    lowerTick,
    upperTick,
    liquidityDelta,
    knownPrice: startingPrice,
    slippage: slippage,
    initTick: initTickPool
  }

  await market.initPoolAndPosition(initPositionVars, positionOwner)
```
### RemovePosition
To remove a position you need to find the id of your position. Easiest way to do that is by querying all the positions.
```ts
const positionList: Position[] = (
  await market.program.account.position.all([
    {
      memcmp: { bytes: bs58.encode(positionOwner.publicKey.toBuffer()), offset: 8 }
    }
  ])
).map(({ account }) => account) as Position[]

// This can be picked based on the position list
const positionToRemove = 0

const positionId = positionList[positionToRemove].id.toNumber()
```
#### Remove position

```ts
const removePosition: RemovePosition = {
  pair,
  owner: positionOwner.publicKey,
  index: positionId,
  userTokenX: userTokenXAccount,
  userTokenY: userTokenYAccount
}

await market.removePosition(removePosition, positionOwner)
```

#### Remove position with wrapped eth
```ts
const wrappedEthAccount = Keypair.generate()

const createIx = SystemProgram.createAccount({
  fromPubkey: positionOwner.publicKey,
  newAccountPubkey: wrappedEthAccount.publicKey,
  lamports: await Token.getMinBalanceRentForExemptAccount(connection),
  space: 165,
  programId: TOKEN_PROGRAM_ID
})

const initIx = Token.createInitAccountInstruction(
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  wrappedEthAccount.publicKey,
  positionOwner.publicKey
)

const unwrapIx = Token.createCloseAccountInstruction(
  TOKEN_PROGRAM_ID,
  wrappedEthAccount.publicKey,
  positionOwner.publicKey,
  positionOwner.publicKey,
  []
)

let token: Token
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  if (wrappedEthPair.tokenY === pair.tokenX) {
    token = tokenX
  } else {
    token = tokenY
  }
} else {
  if (wrappedEthPair.tokenX === pair.tokenX) {
    token = tokenX
  } else {
    token = tokenY
  }
}

let userTokenX
let userTokenY

const userTokenAccount = await token.createAccount(positionOwner.publicKey)
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  userTokenX = wrappedEthAccount.publicKey
  userTokenY = userTokenAccount
} else {
  userTokenX = userTokenAccount
  userTokenY = wrappedEthAccount.publicKey
}
const removePosition: RemovePosition = {
  pair: wrappedEthPair,
  owner: positionOwner.publicKey,
  index: positionId,
  userTokenX,
  userTokenY
}

const removePositionIx = await market.removePositionInstruction(removePosition)
const tx = new Transaction()
tx.add(createIx).add(initIx).add(removePositionIx).add(unwrapIx)

await signAndSend(tx, [positionOwner, wrappedEthAccount], connection)
```