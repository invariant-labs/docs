---
title: Minting a Position

slug: /eclipse/minting_position
---

## Introduction

After pool creation you can create position (see [`create_position.rs`](https://github.com/invariant-labs/protocol-eclipse/blob/main/programs/invariant/src/instructions/create_position.rs)).

You will learn how to create a new liquidity position, add liquidity, and then remove liquidity in this guide.

## Examples

### Create position on existing pool

Ticks and position list for the position must be created if they don't exist already.
This can be done using createTick method.

```ts
// first the ticks must be created if they don't exist already
const createLowerTickVars: CreateTick = {
  pair,
  index: lowerTick,
  payer: owner.publicKey,
};

const createUpperTickVars: CreateTick = {
  pair,
  index: upperTick,
  payer: owner.publicKey,
};

const ticks = await market.getAllIndexedTicks(pair);
if (!ticks.get(lowerTick)) {
  await market.createTick(createLowerTickVars, owner);
}

if (!ticks.get(upperTick)) {
  await market.createTick(createUpperTickVars, owner);
}

// create position list if it doesn't exist yet
try {
  await market.getPositionList(positionOwner.publicKey);
} catch (e) {
  await market.createPositionList(positionOwner.publicKey, positionOwner);
}
const positionList = await market.getPositionList(positionOwner.publicKey);
```

The highest amount of the liquidity for the position can be calculated based on owned token amounts using the `getLiquidity` function.

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
  liquidity: BN
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

#### Create position on existing pool

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
  slippage: slippage,
};
await market.initPosition(initPositionVars, positionOwner, {
  positionList: { head: positionList.head, initialized: true },
  lowerTickExists: true,
  upperTickExists: true,
  pool,
  tokenXProgramAddress: TOKEN_PROGRAM_ID,
  tokenYProgramAddress: TOKEN_PROGRAM_ID,
});
```

#### Create position on existing pool with wrapped ETH

```ts
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  wethAmount = x;
} else {
  wethAmount = y;
}
const { createIx, initIx, transferIx, unwrapIx } =
  createNativeAtaWithTransferInstructions(
    wrappedEthAccount.publicKey,
    positionOwner.publicKey,
    Network.LOCAL,
    wethAmount
  );

const slippage = toDecimal(0, 0);

let initPositionVars: InitPosition;

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
    slippage: slippage,
  };
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
    slippage: slippage,
  };
}

const initPositionIx = await market.initPositionTx(initPositionVars);
const tx = new Transaction()
  // first 3 ixs create a weth account
  // last one returns the funds to the wallet
  .add(createIx)
  .add(transferIx)
  .add(initIx)
  .add(initPositionIx)
  .add(unwrapIx);
await signAndSend(tx, [positionOwner, wrappedEthAccount], connection);
```

### Create pool and position

Pools price is defined by a tick index, it can be calculated as follows based on real price of the tokens.

```ts
const decimalsX = await tokenX.getMintInfo().then((mint) => mint.decimals);
const decimalsY = await tokenY.getMintInfo().then((mint) => mint.decimals);

const realPrice = 64000; // y to x token ratio
const priceWithDecimals =
  (realPrice * Math.pow(10, decimalsX)) / Math.pow(10, decimalsY);
const initTickPool = alignTickToSpacing(
  priceToTick(priceWithDecimals),
  otherFeeTier.tickSpacing!
);
const startingPrice = calculatePriceSqrt(initTickPool);
```

`getLiquidity` function can be used to calculate token amounts based on current balances.

```ts
const userTokenXAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  positionOwner,
  pair.tokenX,
  positionOwner.publicKey
).then((ata) => ata.address);
const userTokenYAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  positionOwner,
  pair.tokenY,
  positionOwner.publicKey
).then((ata) => ata.address);

// liquidity can be calculated using the getLiquidity function
// it will return an amount of liquidity that can be payed for with both tokens
const tokenXAmount = new BN(20000000);
const tokenYAmount = new BN(20000000);
const {
  x,
  y,
  liquidity: liquidityDelta,
} = getLiquidity(
  tokenXAmount,
  tokenYAmount,
  lowerTick,
  upperTick,
  startingPrice,
  true,
  otherPair.feeTier.tickSpacing
);

// the price that is calculated might differ slightly due to floating point and sdk inaccuracies so a small amount of slippage is required
const slippage = toDecimal(1, 2);

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
  initTick: initTickPool,
};

await market.initPoolAndPosition(initPositionVars, positionOwner);
```

### RemovePosition

To remove a position you need to find the id of your position. Easiest way to do that is by querying all the positions.

```ts
const positionList = await market.getAllUserPositionsWithIds(
  positionOwner.publicKey
);
// Index can be picked based on the position list
const positionToRemove = 0;
const removedPosition = positionList.find((p) => p[0] == positionToRemove);

console.log(removedPosition);

const positionId = positionList[positionToRemove][0];
```

#### Remove position

```ts
const removePosition: RemovePosition = {
  pair,
  owner: positionOwner.publicKey,
  index: positionId,
  userTokenX: userTokenXAccount,
  userTokenY: userTokenYAccount,
};

await market.removePosition(removePosition, positionOwner);
```

#### Remove position with wrapped eth

```ts
const wrappedEthAccount = Keypair.generate();

const { createIx, initIx, unwrapIx } = createNativeAtaInstructions(
  wrappedEthAccount.publicKey,
  positionOwner.publicKey,
  Network.LOCAL
);

let token: Token;
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  if (wrappedEthPair.tokenY === pair.tokenX) {
    token = tokenX;
  } else {
    token = tokenY;
  }
} else {
  if (wrappedEthPair.tokenX === pair.tokenX) {
    token = tokenX;
  } else {
    token = tokenY;
  }
}

let token: PublicKey;
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  token = wrappedEthPair.tokenY;
} else {
  token = wrappedEthPair.tokenX;
}

let userTokenX: PublicKey;
let userTokenY: PublicKey;
const userTokenAccount = getAssociatedTokenAddressSync(
  token,
  positionOwner.publicKey
);

if (wrappedEthPair.tokenX === NATIVE_MINT) {
  userTokenX = wrappedEthAccount.publicKey;
  userTokenY = userTokenAccount;
} else {
  userTokenX = userTokenAccount;
  userTokenY = wrappedEthAccount.publicKey;
}

const removePosition: RemovePosition = {
  pair: wrappedEthPair,
  owner: positionOwner.publicKey,
  index: positionId,
  userTokenX,
  userTokenY,
};

const removePositionIx = await market.removePositionInstruction(removePosition);
const tx = new Transaction();
tx.add(createIx).add(initIx).add(removePositionIx).add(unwrapIx);

await signAndSend(tx, [positionOwner, wrappedEthAccount], connection);
```
