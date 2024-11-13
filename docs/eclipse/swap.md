---
title: Swap

slug: /eclipse/swap
---
### Swap
Swaps are the most common interaction with the Invariant protocol. The following code shows you how to implement a single swap:

```ts
export interface Swap {
  pair: Pair
  owner?: PublicKey
  xToY: boolean
  amount: BN
  estimatedPriceAfterSwap: Decimal
  slippage: Decimal
  accountX: PublicKey
  accountY: PublicKey
  byAmountIn: boolean
  referralAccount?: PublicKey
};

const swapVars: Swap = {...} 

await market.swap(swapVars, owner);
```
##### Swap interface
| Name                      | Description                                                                                                                   |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `slippage`                | Slippage is based on price impact and calculated by dividing by `DENOMINATOR` (10^12).                                        |
| `estimatedPriceAfterSwap` | Variable affected by slippage; swap will fail if the final price exceeds the slippage-adjusted target price.                  |
| `pair`                    | Combination of `feeTier`, `tokenX`, and `tokenY` that uniquely identifies the pool.                                           |
| `accountX`                | User's account for `tokenX`; must exist before the swap is performed.                                                         |
| `accountY`                | User's account for `tokenY`; must exist before the swap is performed.                                                         |
| `byAmountIn`              | Specifies whether the `amount` is used as input (`True`) or output (`False`).                                                 |
| `xToY`                    | Determines the direction of the swap, either from `tokenX` to `tokenY` or vice versa.                                         |
| `referralAccount`         | Optional parameter that allows the user to specify if the referral fees should be applied                                     |
| `referralAccount`         | Optional parameter that allows the user to specify if the referral fees should be applied                                     |

:::note
`pair` variable should be created by using the constructor of the `Pair` class.<br/>
Creating pair manually may result in incorrectly sorted tokens.<br/>
:::

#### swapInstruction

To get the raw instruction `swapInstruction` method can be used. It allows for setting the maximum amount of tick accounts that can be used in a swap. This is useful for swaps using the native token. Account limit in that case is given by const `TICK_CROSSES_PER_IX_NATIVE_TOKEN`. This function accounts for referral account being present and reduces the amount of ticks being fetched.

```ts
async swapInstruction(swap: Swap, tickCrosses: number = TICK_CROSSES_PER_IX)
```

#### swapInstructionSync

Third option is `swapInstructionSync`. It allows for creating the instruction without any additional fetches. This also means data that would otherwise be fetched must be provided. `tokenXProgram` and `tokenYProgram` should correspond to `tokenX` and `tokenY` in the `Pair` object, `pool` is state of the pool before the swap and `tickAddresses` contains the addresses of the ticks that should be used in the transaction.

```ts
export interface SwapSync extends Swap {
  tickAddresses: PublicKey[]
  pool: PoolStructure
  tokenXProgram: PublicKey
  tokenYProgram: PublicKey
}

swapInstructionSync(swap: SwapSync)
```
#### ETH swap
If your transaction includes ETH you must first wrap the tokens and manually create an account. It's possible to do it within one transaction but you must create a token account and transfer funds using additional instructions. This must be accounted for, when considering the amount of tick addresses passed and that's why `TICK_CROSSES_PER_IX_NATIVE_TOKEN` is used as the limit for the simulation.

```ts
const xToY = false
const byAmountIn = true
const swapAmount = new BN(10000)
const slippage = toDecimal(0, 0)

// lower max cross count than in a normal swap
let maxCrosses = TICK_CROSSES_PER_IX_NATIVE_TOKEN

const referralAccount: PublicKey | undefined = undefined

if (referralAccount) {
  maxCrosses -= 1
}

const simulation = await swapSimulation(
  xToY,
  byAmountIn,
  swapAmount,
  undefined, // passing undefined to the price limit to allow for max price change
  slippage,
  market,
  wrappedEthPair.getAddress(market.program.programId),
  maxCrosses,
  TICK_VIRTUAL_CROSSES_PER_IX
)

if (simulation.status !== SimulationStatus.Ok) {
  throw new Error(simulation.status)
}

const isWrappedEthInput =
  (xToY && wrappedEthPair.tokenX.equals(NATIVE_MINT)) ||
  (!xToY && wrappedEthPair.tokenY.equals(NATIVE_MINT))
```
These additional instructions are used when performing ETH swap.
```ts
const wrappedEthAccount = Keypair.generate()
const createIx = SystemProgram.createAccount({
  fromPubkey: owner.publicKey,
  newAccountPubkey: wrappedEthAccount.publicKey,
  lamports: await Token.getMinBalanceRentForExemptAccount(connection),
  space: 165,
  programId: TOKEN_PROGRAM_ID
})

const transferIx = SystemProgram.transfer({
  fromPubkey: owner.publicKey,
  toPubkey: wrappedEthAccount.publicKey,
  lamports: isWrappedEthInput ? swapAmount : 0
})

const initIx = Token.createInitAccountInstruction(
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  wrappedEthAccount.publicKey,
  owner.publicKey
)

const unwrapIx = Token.createCloseAccountInstruction(
  TOKEN_PROGRAM_ID,
  wrappedEthAccount.publicKey,
  owner.publicKey,
  owner.publicKey,
  []
)
```

Select accounts based on token pair.
```ts
if (wrappedEthPair.tokenX === NATIVE_MINT) {
  accountX = wrappedEthAccount.publicKey
  accountY = userTokenAccount
} else {
  accountX = userTokenAccount
  accountY = wrappedEthAccount.publicKey
}
```
Create swap ix and tx. It's important to sign it with both wallet and wrappedEthAccount keypair.

```ts
const swapIx = await market.swapInstruction(
  {
    xToY,
    estimatedPriceAfterSwap: { v: simulation.priceAfterSwap },
    pair: wrappedEthPair,
    amount: tou64(simulation.accumulatedAmountIn),
    slippage: swapSlippage,
    byAmountIn,
    accountX,
    accountY,
    owner: owner.publicKey
  },
  maxCrosses
)

const tx = new Transaction().add(createIx)

if (isWrappedEthInput) {
  tx.add(transferIx)
}

tx.add(initIx).add(swapIx).add(unwrapIx)
const txHash = await signAndSend(tx, [owner, wrappedEthAccount], connection)
```

### Swap simulation

Swap simulation provides all data necessary to perform a swap.
```ts
export interface SimulateSwapInterface {
  xToY: boolean
  byAmountIn: boolean
  swapAmount: BN
  priceLimit?: Decimal
  slippage: Decimal
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
##### Input
| Name                       | Description                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `maxVirtualCrosses`        | Limit for virtual crosses, should be set to `TICK_VIRTUAL_CROSSES_PER_IX`                                        |
| `maxCrosses`               | Limit on the number of accounts that can be used for ticks                                                       |
| `tickmap`, `pool`,         | States of the accounts that will be used in the swap                                                             |
| `ticks`                    | Map from tick index to tick account                                                                              |
| `priceLimit`               | If omitted, allows the simulation to continue until reaching either the cross limit or the pool's limiting price |
| `slippage`                 | slippage to be applied on the price limit                                                                        |

##### Output
| Name                   | Description                                                                       |
|------------------------|-----------------------------------------------------------------------------------|
| `status`               | Contains an error if there was one                                                |
| `crossedTicks`         | Contains the indexes of the ticks that are necessary for the swap to be performed |
| `accumulatedAmountIn`  | Contains the input amount for the swap                                            |
| `accumulatedAmountOut` | Expected output amount                                                            |
| `accumulatedFee`       | Fee amount that will be paid                                                      |
| `minReceived`          | Lowest amount of tokens that could be gained from the swap                        |
| `priceImpact`          | Impact on the price after the swap                                                |
| `priceAfterSwap`       | Estimated value of the price after the swap is completed                          |


The following is an example of usage.

```ts
const poolData = await market.getPool(pair);
const tickmap = await market.getTickmap(pair, pool)
const ticks = await market.getAllIndexedTicks(pair)

const simProps: SimulateSwapInterface = {
  xToY: true,
  byAmountIn: true,
  swapAmount: new BN(1e10),
  priceLimit: poolData.sqrtPrice,
  slippage: { v: new BN(DENOMINATOR) },
  ticks,
  tickmap,
  pool: poolData,
  maxCrosses: 
};

const result = simulateSwap(simProps);

if (simulation.status != SimulationStatus.Ok) {
  throw new Error(simulation.status)
}
```

#### Optimally querying ticks
Not all tick accounts are necessary to perform a swap. To get the optimal amount it's enough to query up to max tick limit, which exists due to max accounts limitations on Solana. Additionally there's a cu to how far the price can move which is covered by the range limit. These two limits with the knowledge of the current tickmap and pool state allow to restrict the query amount and sizes to minimum.
```ts
    // fetch all accounts except for ticks
    const [pool, tokenXProgram, tokenYProgram] = await Promise.all([
      market.getPool(pair),
      getTokenProgramAddress(connection, pair.tokenX),
      getTokenProgramAddress(connection, pair.tokenY)
    ])
    const tickmap = await market.getTickmap(pair, pool)

    // optimally ticks should be queried in the direction of the swap
    // adding one tick in the opposite direction is recommended in case of a price change that could benefit the user
    const startTickIndex = pool.currentTickIndex
    const amountLimit = TICK_CROSSES_PER_IX
    const amountLimitBackward = 1
    const amountLimitForward = amountLimit - amountLimitBackward
    const xToY = true
    const priceDirection = xToY ? 'down' : 'up'
    const oppositePriceDirection = xToY ? 'up' : 'down'

    // minimum range for simulation to work
    const rangeLimitForward = TICK_SEARCH_RANGE * (TICK_VIRTUAL_CROSSES_PER_IX + amountLimitForward)
    // this can be an arbitrary number the current limit accounts for 2.5% - 30% price change in the opposite direction than the swap scaling up with tick spacing
    const rangeLimitBackward = TICK_SEARCH_RANGE * amountLimitBackward

    const tickIndexesForward = findClosestTicks(
      tickmap.bitmap,
      startTickIndex,
      pool.tickSpacing,
      amountLimitForward,
      rangeLimitForward,
      priceDirection
    )

    const tickIndexesBackwards = findClosestTicks(
      tickmap.bitmap,
      startTickIndex + (xToY ? pool.tickSpacing : -pool.tickSpacing),
      pool.tickSpacing,
      amountLimitBackward,
      rangeLimitBackward,
      oppositePriceDirection
    )

    const tickIndexes = tickIndexesForward.concat(tickIndexesBackwards)

    const tickAddresses = tickIndexes.map(t => market.getTickAddress(pair, t).tickAddress)

    const tickAccounts = await market.program.account.tick.fetchMultiple(tickAddresses)

    if (tickAccounts.find(v => v === null)) {
      throw new Error('Tick accounts need to be fetched again')
    }

    // preparing ticks for simulation
    const ticks = new Map<number, Tick>()
    tickAccounts.forEach(v => {
      if (v) {
        let tick = v as Tick
        ticks.set(tick.index, tick)
      }
    })

    const byAmountIn = true
    const swapAmount = new BN(1000)
    const slippage = toDecimal(1, 0)

    const simulation = simulateSwap({
      tickmap,
      xToY,
      byAmountIn,
      swapAmount,
      slippage,
      ticks: ticks,
      pool,
      maxCrosses: amountLimitForward
    })

    // only the addresses that were crossed are necessary
    // one extra tick is added in the opposite direction
    const tickAddressesRequired = simulation.crossedTicks
      .concat(tickIndexesBackwards)
      .map(v => market.getTickAddress(pair, v).tickAddress)
    
    const ix = market.swapInstructionSync({
      pair,
      xToY,
      slippage,
      estimatedPriceAfterSwap: { v: simulation.priceAfterSwap },
      amount,
      byAmountIn,
      tickAddresses: tickAddressesRequired,
      pool,
      owner: owner.publicKey,
      accountX,
      accountY,
      tokenXProgram,
      tokenYProgram,
      referralAccount
    })

    const tx = new Transaction().add(ix)
    const txHash = await signAndSend(tx, [owner], connection)
    console.log(txHash)
```
