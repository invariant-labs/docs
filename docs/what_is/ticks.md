---
title: Ticks

slug: /what_is/ticks
---

### Overview

To achieve concentrated liquidity, the once continuous spectrum of price space has been partitioned with ticks.

Ticks are the boundaries between discrete areas in price space. Ticks are spaced such that an increase or decrease of 1 tick represents a $0.01\%$ increase or decrease in price at any point in price space. Ticks function as boundaries for liquidity positions. When a position is created, the provider must choose the lower and upper tick that will represent their position's borders.

As the spot price changes during swapping, the pool contract will continuously exchange the outbound asset for the inbound, progressively using all the liquidity available within the current tick interval until the next tick is reached. At this point, the contract switches to a new tick and activates any dormant liquidity within a position that has a boundary at the newly active tick.

While each pool has the same number of underlying ticks, in practice only a portion of them are able to serve as active ticks. Due to the nature of the v3 smart contracts, tick spacing is directly correlated to the swap fee. Lower fee tiers allow closer potentially active ticks, and higher fees allow a relatively wider spacing of potential active ticks.

While inactive ticks have no impact on transaction cost during swaps, crossing an active tick does increase the cost of the transaction in which it is crossed, as the tick crossing will activate the liquidity within any new positions using the given tick as a border.

In areas where capital efficiency is paramount, such as stable coin pairs, narrower tick spacing increases the granularity of liquidity provisioning and will likely lower price impact when swapping - the result being significantly improved prices for stable coin swaps.

Without ticks, there is no possible way to make concentrated liquidity work.

### Example

Ticks are the boundaries between discrete areas in price space. It represents a $0.01\%$ difference in the price.

To better illustrate what a tick is, we will show it with an example.
Imagine, than you are creating liquidity position, and you have to choose price range.

![One side liquidity](/img/docs/app/price_range.png)

Every time a price is calculated by multiplying it by the previous price by $1.0001$, then the price change is always the same as $0.01 \%$.

There is also the concept _of tick spacing_ for each pool e.g., a tick spacing of 5 requires ticks to be initialized every 5th tick i.e., ..., -10, -5, 0, 5, 5, ...

For more information on fee levels and their correlation to tick spacing, see the [whitepaper](https://t.co/Ms1dYZPrZx).
