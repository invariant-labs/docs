---
title: Concentrated Liquidity

slug: /what_is/concentrated_liquidity
---

### Overview

Concentrated Liquidity is a flagship feature of Invariant. Designed to maximize capital efficiency in a way that traditional liquidity pools cannot. In most common liquidity pools, liquidity is distributed evenly across the entire price curve, which often results in much of the capital remaining unused or underutilized.

With this approach, you have the ability to concentrate your liquidity within a specific, targeted price range of your choice. This means that the entire amount of your capital is actively working for you within this selected range, as opposed to being spread thin across price points that may not be relevant to the market at that moment.

This targeted strategy can lead to a remarkable increase in capital efficiency, potentially up to 40,000 times more effective than conventional methods. By allowing you to focus your resources where they are needed most, Invariant ensures that your investments are working smarter and generating optimal returns.

### Technical sight

In Invariant we can allocate liquidity within a custom price range. It means that user sets a price range $[p_l, p_u]$, where $p_l, p_u$ means lower and the upper price of a specific range.

Also our protocol allows to set price range on entire price space, ie. the $(0, \infty)$ integral. It means that user gives liquidity on every initialized tick (the concept about we will talk more in later part).

With Invariant LPs may concentrate their capital to smaller price intervals than $(0,\infty)$. A good example is pool of stablecoins. The liquidity outside the typical price range of a stablecoin pair is rarely touched. For example, an LP may choose to allocate capital solely to the $(0.99, 1.01)$ range. As a result, traders are offered deeper liquidity around the mid-price, and LPs earn more trading fees with their capital. We call liquidity concentrated to a finite interval a position. LPs may have many different positions per pool, creating individualized price curves that reflect the preferences of each LP.

### Active Liquidity

As the price of an asset rises or falls, it may exit the price bounds that LPs have set in a position. When the price exits a position's interval, the position's liquidity is no longer active and no longer earns fees.

As price moves in one direction, LPs gain more of the one asset as swappers demand the other, until their entire liquidity consists of only one asset. If the price ever reenters the interval, the liquidity becomes active again, and in-range LPs begin earning fees once more.

Importantly, LPs are free to create as many positions as they see fit, each with its own price interval. Concentrated liquidity serves as a mechanism to let the market decide what a sensible distribution of liquidity is, as rational LPs are incentivized to concentrate their liquidity while ensuring that their liquidity remains active.
