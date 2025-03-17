---
title: Autoswap

slug: /invariant_features/autoswap
---

### Concept

Providing liquidity to a concentrated liquidity pool requires supplying two tokens in a precise ratio. This ratio is determined by the current market price and your chosen price range (tick range). If your assets don't match this exact ratio, some of your tokens may remain unused, decreasing the efficiency of your liquidity position.

The **Autoswap** feature simplifies this process by automatically balancing your assets, allowing you to enter a liquidity position even if you initially hold only one token or an unbalanced token ratio. With Autoswap, you don't have to manually calculate or execute swaps to achieve the right balance, protocol does it seamlessly for you.

### How Autoswap works

When you're setting up a liquidity position, the Autoswap feature:

1. **Analyzes your tokens**: It checks how your supplied tokens match the required ratio for the chosen liquidity range.

2. **Identifies imbalance**: Determines if one asset is insufficient (the "lacking asset").

3. **Automatic swapping**: Executes a swap to convert the excess asset into the lacking asset, achieving the exact required balance while creating position.

### User-Configurable Options

Autoswap allows customization to match your preferences:

- **Minimal utilization percentage**: Define the minimum acceptable capital utilization after the swap.

- **Maximum price impact**: Limit how significantly your swap can affect the pool price.

- **Swap slippage**: Control allowable price changes during the swap.

- **Create position slippage**: Specify acceptable slippage when the position is created.

### Practical Example

Imagine you want to create a liquidity position with SOL and USDC, but you're unsure if your tokens match the required ratio. With Autoswap, you don't need to worry about manually achieving the perfect balance. Here's how simple it is:

1. **Select Tokens**:
   Choose the tokens you wish to supply—e.g., SOL and USDC.

2. **Set Your Desired Price Range**:
   Determine the price range within which you'd like your liquidity position to be active (e.g., between 143.42 and 146.02 USDC per SOL).

3. **Set Token Amounts**:
   Enter the amounts of SOL and USDC you'd like to contribute. You can input any quantities, regardless of the current ratio.

4. **Let Autoswap Do the Rest**: Autoswap will automatically calculate and execute the swap necessary to achieve the perfect token ratio durning position creation.

![Position](/img/docs/app/general/autoswap_position.png)

### Technical details

Autoswap ensures precision by simulating the swap and liquidity provisioning before actual execution. Importantly, the entire operation (swap and position creation) is atomic, meaning it either fully succeeds or fully fails without partial execution.

Simulation Types:

- **Same-Pool Simulation**: Used when the liquidity position and swap occur in the same pool. This simulation directly utilizes the current pool price.

- **Different-pool Simulation**: Employed when your position is created in a different pool. It allows for independent slippage settings and additional configuration parameters for precise simulations for each pool used.

#### Iterative Optimization:

Autoswap calculates the optimal swap amount through an iterative process rather than a simple formula. Because liquidity provisioning and token balances directly influence each other (especially after swaps), the optimal ratio must be determined by repeatedly simulating various swap scenarios. Using a binary search method, the system:

- Simulates swaps and evaluates resulting balances.

- Adjusts swap amounts based on utilization and target liquidity.

- Iteratively refines until the optimal balance is found.

#### Why Predefined Pools?

Autoswap is only available for specific, predefined token pairs to maintain system reliability. By executing swaps in predefined pools, Autoswap ensures:

- Consistent liquidity availability.

- Reduced RPC endpoint failures.

- Minimal price impact.
