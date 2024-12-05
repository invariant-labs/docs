---
title: Swap

slug: /eclipse/swap
---

### Swap

Swaps are the most common interaction with the Invariant protocol. The following code shows you how to implement a single swap:

```ts
// swap params
const xToY = false;
const byAmountIn = true;
const swapAmount = new BN(1000);
const slippage = toDecimal(0, 0);

let maxCrosses = TICK_CROSSES_PER_IX;

// if native token is involved the amount of accounts that can be used for ticks is lower
const isTokenNative =
  pair.tokenX.equals(NATIVE_MINT) || pair.tokenY.equals(NATIVE_MINT);

const referralAccount: PublicKey | undefined = undefined;
if (isTokenNative) {
  maxCrosses = TICK_CROSSES_PER_IX_NATIVE_TOKEN;
}

if (referralAccount) {
  maxCrosses -= 1;
}

const simulation = await swapSimulation(
  xToY,
  byAmountIn,
  swapAmount,
  undefined,
  slippage,
  market,
  pair.getAddress(market.program.programId),
  maxCrosses,
  TICK_VIRTUAL_CROSSES_PER_IX
);

if (simulation.status !== SimulationStatus.Ok) {
  throw new Error(simulation.status);
}

const swapSlippage = toDecimal(0, 0);

const txHash = await market.swap(
  {
    xToY,
    estimatedPriceAfterSwap: simulation.priceAfterSwap,
    pair,
    amount: swapAmount,
    slippage: swapSlippage,
    byAmountIn,
    accountX,
    accountY,
    owner: owner.publicKey,
  },
  owner
);
```

#### ETH swap

If your transaction includes ETH you must first wrap the tokens and manually create an account. It's possible to do it within one transaction but you must create a token account and transfer funds using additional instructions. This must be accounted for, when considering the amount of tick addresses passed and that's why `TICK_CROSSES_PER_IX_NATIVE_TOKEN` is used as the limit for the simulation.

```ts
// swap params
const xToY = false;
const byAmountIn = true;
const swapAmount = new BN(10000);
const slippage = toDecimal(0, 0);

// lower max cross count
let maxCrosses = TICK_CROSSES_PER_IX_NATIVE_TOKEN;

const referralAccount: PublicKey | undefined = undefined;

if (referralAccount) {
  maxCrosses -= 1;
}

const simulation = await swapSimulation(
  xToY,
  byAmountIn,
  swapAmount,
  undefined,
  slippage,
  market,
  wrappedEthPair.getAddress(market.program.programId),
  maxCrosses,
  TICK_VIRTUAL_CROSSES_PER_IX
);

const isWrappedEthInput =
  (xToY && wrappedEthPair.tokenX.equals(NATIVE_MINT)) ||
  (!xToY && wrappedEthPair.tokenY.equals(NATIVE_MINT));

if (simulation.status !== SimulationStatus.Ok) {
  throw new Error(simulation.status);
}

const swapSlippage = toDecimal(0, 0);
```

These additional instructions are used when performing ETH swap. Helper functions `createNativeAtaWithTransferInstructions` and `createNativeAtaInstructions` can be used to generate these instructions.

```ts
const wrappedEthAccount = Keypair.generate();

let wethTxs: WrappedEthInstructions | WrappedEthTransferInstructions;
if (isWrappedEthInput) {
  wethTxs = createNativeAtaWithTransferInstructions(
    wrappedEthAccount.publicKey,
    owner.publicKey,
    Network.LOCAL,
    swapAmount
  );
} else {
  wethTxs = createNativeAtaInstructions(
    wrappedEthAccount.publicKey,
    owner.publicKey,
    Network.LOCAL
  );
}

const { createIx, initIx, unwrapIx } = wethTxs;
```

Select accounts based on token pair.

```ts
let token: PublicKey;
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  token = wrappedEthPair.tokenY;
} else {
  token = wrappedEthPair.tokenX;
}
let accountX: PublicKey;
let accountY: PublicKey;
const userTokenAccount = getAssociatedTokenAddressSync(
  // connection,
  // owner,
  token,
  owner.publicKey
);
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  accountX = wrappedEthAccount.publicKey;
  accountY = userTokenAccount;
} else {
  accountX = userTokenAccount;
  accountY = wrappedEthAccount.publicKey;
}
```

Create swap ix and tx. It's important to sign it with both wallet and wrappedEthAccount keypair.

```ts
const swapIx = await market.swapInstruction(
  {
    xToY,
    estimatedPriceAfterSwap: simulation.priceAfterSwap,
    pair: wrappedEthPair,
    amount: simulation.accumulatedAmountIn,
    slippage: swapSlippage,
    byAmountIn,
    accountX,
    accountY,
    owner: owner.publicKey,
  },
  undefined,
  {
    tickCrosses: maxCrosses,
  }
);

const tx = new Transaction().add(createIx);

if (isWrappedEthInput) {
  tx.add((wethTxs as WrappedEthTransferInstructions).transferIx);
}

tx.add(initIx).add(swapIx).add(unwrapIx);
const txHash = await signAndSend(tx, [owner, wrappedEthAccount], connection);
```

#### Optimally querying ticks

Not all tick accounts are necessary to perform a swap. To get the optimal amount it's enough to query up to max tick limit, which exists due to max accounts limitations on Solana. Additionally there's a compute limit based limit to how far the price can move which is covered by the range limit. These two limits with the knowledge of the current tickmap and pool state allow to restrict the query amount and sizes to minimum.

```ts
// fetch all accounts except for ticks
const [pool, tokenXProgram, tokenYProgram] = await Promise.all([
  market.getPool(pair),
  getTokenProgramAddress(connection, pair.tokenX),
  getTokenProgramAddress(connection, pair.tokenY),
]);
const tickmap = await market.getTickmap(pair, pool);

// optimally ticks should be queried in the direction of the swap
// adding one tick in the opposite direction is recommended in case of a price change that could benefit the user
const startTickIndex = pool.currentTickIndex;
const amountLimit = TICK_CROSSES_PER_IX;
const amountLimitBackward = 1;
const amountLimitForward = amountLimit - amountLimitBackward;
const xToY = true;
const priceDirection = xToY ? "down" : "up";
const oppositePriceDirection = xToY ? "up" : "down";

// minimum range for simulation to work
const rangeLimitForward =
  TICK_SEARCH_RANGE * (TICK_VIRTUAL_CROSSES_PER_IX + amountLimitForward);
// this can be an arbitrary number the current limit accounts for 2.5% - 30% price change in the opposite direction than the swap scaling up with tick spacing
const rangeLimitBackward = TICK_SEARCH_RANGE * amountLimitBackward;

const tickIndexesForward = findClosestTicks(
  tickmap.bitmap,
  startTickIndex,
  pool.tickSpacing,
  amountLimitForward,
  rangeLimitForward,
  priceDirection
);

const tickIndexesBackwards = findClosestTicks(
  tickmap.bitmap,
  startTickIndex + (xToY ? pool.tickSpacing : -pool.tickSpacing),
  pool.tickSpacing,
  amountLimitBackward,
  rangeLimitBackward,
  oppositePriceDirection
);

const tickIndexes = tickIndexesForward.concat(tickIndexesBackwards);

const tickAddresses = tickIndexes.map(
  (t) => market.getTickAddress(pair, t).tickAddress
);

const tickAccounts = await market.program.account.tick.fetchMultiple(
  tickAddresses
);

if (tickAccounts.find((v) => v === null)) {
  throw new Error("Tick accounts need to be fetched again");
}

// preparing ticks for simulation
const ticks = new Map<number, Tick>();
tickAccounts.forEach((v) => {
  if (v) {
    let tick = v as Tick;
    ticks.set(tick.index, tick);
  }
});

const byAmountIn = true;
const swapAmount = new BN(1000);
const slippage = toDecimal(1, 0);

const simulation = simulateSwap({
  tickmap,
  xToY,
  byAmountIn,
  swapAmount,
  slippage,
  ticks: ticks,
  pool,
  maxCrosses: amountLimitForward,
});

// only the addresses that were crossed are necessary
// one extra tick is added in the opposite direction
const tickAddressesRequired = simulation.crossedTicks
  .concat(tickIndexesBackwards)
  .map((v) => market.getTickAddress(pair, v).tickAddress);

const ix = await market.swapInstruction(
  {
    pair,
    xToY,
    slippage,
    estimatedPriceAfterSwap: simulation.priceAfterSwap,
    amount,
    byAmountIn,
    owner: owner.publicKey,
    accountX,
    accountY,
    referralAccount,
  },
  {
    pool,
    tokenXProgram,
    tokenYProgram,
  },
  {
    tickAddresses: tickAddressesRequired,
  }
);

const tx = new Transaction().add(ix);
const txHash = await signAndSend(tx, [owner], connection);
console.log(txHash);
```
