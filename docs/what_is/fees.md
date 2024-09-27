---
title: Fees

slug: /what_is/fees
---

### Overview

Swap fees are a small percentage of each trade paid by users (swappers) when they exchange tokens in a **liquidity pool**. These fees are collected and distributed to **liquidity providers** (LPs) as a reward for providing liquidity.

In simpler terms, every time a trade (swap) happens in a pool, a small fee is charged. This fee is expressed as a fraction of a percent (usually in hundredths of a percent) and is predefined for each pool when it's created.

### Swap Fees

Fee, is a mathematical representation of the fee paid by swappers in hundredths of a percent, and it is initialized with a predetermined value in each pool.

### How are fees tracked?

To track fees effectively, the system uses two main values:

`fee_growth_global_x`: Tracks the total fees accrued for token **X**.

`fee_growth_global_y`: Tracks the total fees accrued for token **Y**.

These global fee values increase as more swaps occur in the pool, and the fees earned by LPs grow as well. Whenever a swap happens, these values are updated to reflect the new fees. However, only $L$ changes when liquidity is provided or removed.

### Technical insight

When the tick is crossed, the contract must keep track of the amount of gross liquidity that should be added or withdrawn, as well as the fees received above and below the tick, in order to be effective. When the tick indexes are updated, the variables in the tick-indexed state are updated. Consider that, after updating the contract's global state, the pool changes the fees collected and liquidity at the precise price point, which is upper tick and lower tick in the contract's global state (lower tick).

### Protocol Fees

In addition to the fees earned by liquidity providers, a small portion of swap fees (often set at 0.1%) is collected by the protocol itself. This portion is a part of the total fees that swappers pay, and it helps support the ongoing development and sustainability of the protocol.
