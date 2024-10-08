---
title: Glossary

slug: /what_is/glossary
---

### Automated Market Maker

An Automated Market Maker is a type of smart contract that maintains liquidity reserves, usually consisting of two different tokens. Users can trade against these reserves, with prices determined by a predefined mathematical formula. Anyone can contribute liquidity to these contracts, earning proportional trading fees in return. AMMs remove the need for traditional market makers, who manually set prices for assets, by automating the process with algorithms.

### Concentrated Liquidity

Concentrated liquidity refers to the allocation of liquidity within a specific price range. Liquidity providers can choose to provide liquidity in a more targeted range rather than across the entire price spectrum, allowing for more efficient use of capital and higher potential returns, though this also increases the risk of impermanent loss within that range.

### Constant Product Formula#

The constant product formula ${x\cdot y=k}$, is the equation that governs most automated market maker models, such as Uniswap. In this formula, xxx and yyy represent the reserves of two tokens in the liquidity pool, and kkk is a constant value. This ensures that the product of the quantities of the two tokens remains constant after each trade, dynamically adjusting prices based on the relative supply of each token.

### Liquidity Provider / "LP"

A Liquidity Provider is an individual or entity that deposits tokens into a liquidity pool. In exchange for providing liquidity, LPs take on the risk of price fluctuations and potential impermanent loss but are compensated with a portion of the trading fees generated by the pool.

### Liquidity

Liquidity refers to the digital assets stored in a smart contract, typically in an AMM-based decentralized exchange (DEX). These assets are available for traders to swap against. The depth and volume of liquidity in a pool directly affect the efficiency and stability of trading within that pool.

### Pool

A pool is a smart contract that pairs two assets and holds their liquidity. Different pools can exist for the same token pair but may have varying fee structures or conditions. For example, one pool might have a lower fee designed for more frequent trades, while another might be optimized for larger, less frequent transactions.

### Position

A position in a liquidity pool refers to a specific amount of liquidity that is deposited within a defined range between an upper and lower tick (price boundary). The position accrues fees as trades happen within that range, but if the price moves outside of the range, the position no longer earns fees.

### Price Impact

Price impact refers to the difference between the "mid-price" (the average market price) and the execution price of a trade. Larger trades can significantly move the price in a liquidity pool, creating slippage for the trader and potentially reducing the trade's profitability.

### Protocol Fees

Protocol fees are fees collected by the protocol itself, rather than being distributed to liquidity providers. These fees may be used to fund development, reward governance participants, or provide a revenue stream for the protocol.

### Range

A range in AMMs refers to the interval between two specific price ticks. Liquidity providers can choose to allocate liquidity across a particular range to optimize capital efficiency and returns, though liquidity outside this range will not be used for trading.

### Range Order

A range order functions similarly to a limit order in traditional markets, but it’s specific to AMMs. In a range order, a single asset is provided as liquidity within a specific price range. As the market price moves through this range, the asset is gradually converted to the other asset in the pair.

### Slippage

Slippage is the difference between the expected price of a trade when it’s submitted and the actual price when it’s executed. High slippage can occur during periods of low liquidity or high market volatility, leading to less favorable trading outcomes for users.

### Swap Fees

Swap fees are the transaction fees collected when a trade occurs in a liquidity pool. These fees are typically distributed to liquidity providers, compensating them for the risk they take on by supplying liquidity.

### Tick

A tick defines the boundaries between different price ranges in an AMM with concentrated liquidity. Liquidity can be allocated between ticks, and as the market price moves, the liquidity within that tick range is used for trading.

### Tick Interval

The tick interval is the smallest price increment between two ticks in the liquidity pool’s price space. The size of the interval determines how granular the liquidity can be distributed and adjusted within the pool.
