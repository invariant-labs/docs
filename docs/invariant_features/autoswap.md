---
title: Autoswap

slug: /invariant_features/autoswap
---

### 💡 Concept

Providing liquidity to a concentrated liquidity pool requires supplying two tokens in a precise ratio. This ratio is determined by the current market price and your chosen price range (tick range). If your assets don't match this exact ratio, some of your tokens may remain unused — decreasing the efficiency of your liquidity position.

The **AutoSwap** feature simplifies this process by automatically balancing your assets. It allows you to enter a liquidity position even if you initially hold only one token or have an unbalanced token ratio. With AutoSwap, you don’t need to calculate or execute swaps manually — the protocol does it seamlessly for you.

#### 🧪 Origin & Context

This feature was originally developed during the Sonic Hackathon, inspired by the challenges of adding liquidity — particularly in environments where DeFi infrastructure is still emerging but has strong potential for rapid growth, just like on Sonic, where AutoSwap is currently deployed and being tested exclusively.

📘 For the full mathematical breakdown, see the [AutoSwap paper](https://invariant.app/autoswap.pdf).

### ⚙️ How AutoSwap Works

When you're setting up a liquidity position, AutoSwap:

1. **Analyzes your tokens** Evaluates how your supplied tokens compare to the required ratio for your chosen price range.

2. **Identifies imbalance** Detects which asset is lacking and which is in excess.

3. **Executes the swap** Performs a swap from the excess asset to the lacking one, then immediately opens the position — all within one atomic transaction.

### 🔧 User-Configurable Options

AutoSwap supports several advanced options, allowing you to fine-tune execution based on your preferences:

- **Minimum Token Utilization** – Ensures most of your capital ends up in the LP position.
- **Maximum Price Impact** – Limits how much the swap can move the pool price.
- **Swap Slippage Tolerance** – Controls allowable price changes during the swap itself.
- **Position Creation Slippage** – Adds buffer for small price shifts when the LP position is finalized.

---

### 🧪 Practical Example

Let’s say you want to provide liquidity in the **SOL/USDC** pool, but you're not sure your token amounts match the required ratio. With AutoSwap, you don’t need to worry — here's what the process looks like:

1. **Select Tokens** Choose tokens you want to deposit (e.g., SOL and USDC).

2. **Set Your Price Range** Define the range for your position (e.g., 130.82 – 133.20 USDC per SOL).

3. **Enter Token Amounts** Input any amounts — they don’t need to match the required ratio.

![Position](/img/docs/app/general/preview_autoswap_position.png)

4. **AutoSwap Handles the Rest** The system calculates and executes the necessary swap, then opens your LP position automatically. In our case, a small portion of SOL has been swapped to USDC to achieve the optimal ratio for the current price.

![Position Balance](/img/docs/app/general/balanced_autoswap_position.png)

The settings can be adjusted directly in the app under **AutoSwap Settings**, available when adding liquidity. They are organized into two tabs: **Basic** and **Advanced**, so users can choose between a simplified or detailed configuration.

### 🧩 Basic Settings

![Basic Settings](/img/docs/app/general/autoswap_basic_settings.png)

#### 1. Minimum Token Utilization

This setting determines how much of your capital must be deposited into the pool after AutoSwap. In volatile or low-liquidity pools, not all tokens may be converted optimally. This threshold prevents AutoSwap from proceeding unless most of your tokens will be used.

**Available options:**

| Utilization            | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| 90% (Volatile Market)  | Safe for dynamic conditions.                            |
| 95% (Default)          | Balanced for most scenarios.                            |
| 99% (Maximize Capital) | Near full usage, but may revert in fast-moving markets. |

#### 2. Maximum Price Impact

Controls how much your swap can shift the market price. Useful to avoid unexpected costs, especially in smaller pools.

**Available options:**

| Price Impact          | Description                                    |
| --------------------- | ---------------------------------------------- |
| 0.1% (Low Impact)     | For stable assets or large swaps.              |
| 0.3% (Default)        | Balanced for general use.                      |
| 0.5% (High Tolerance) | Allows greater movement in exchange for speed. |

### Advanced Settings

![Advanced Settings](/img/docs/app/general/autoswap_advanced_settings.png)

#### 3. Swap Slippage Tolerance

Sets the acceptable deviation between the quoted and executed swap price. Useful for minimizing risk in volatile conditions.

**Available options:**

| Slippage            | Description                                     |
| ------------------- | ----------------------------------------------- |
| 0.3% (Low Slippage) | Precise execution, more likely to revert.       |
| 0.5% (Default)      | Safe and flexible.                              |
| 1% (High Tolerance) | Best for high-speed, low-sensitivity use cases. |

<!-- --- -->

#### 4. Position Creation Slippage

After the swap, AutoSwap opens the LP position. This setting defines how much price movement is acceptable before that final step fails.

**Available options:**

| Slippage            | Description                                       |
| ------------------- | ------------------------------------------------- |
| 1% (Low Slippage)   | Ideal for tight ranges and stable markets.        |
| 2.5% (Default)      | Works for most token pairs.                       |
| 5% (High Tolerance) | Suitable for volatile conditions and wide ranges. |

---

### Technical Details

**AutoSwap** is an atomic, constraint-aware mechanism for capital-efficient liquidity provisioning in the Invariant protocol.
It performs a token swap and opens a liquidity position within a **single atomic transaction** — either everything executes successfully, or nothing changes.

#### ⚙️ How It Works

AutoSwap operates in a multi-step simulation and optimization flow:

1. **User input** — token pair, price range, token amounts, and optional constraints (e.g. `maxPriceImpact`, `minLiquidityUsage`).
2. **Token analysis** — detects imbalance between the provided token amounts and the required liquidity ratio.
3. **Simulation engine** — simulates swap outcomes using current market data.
4. **Binary search** — iteratively finds the optimal swap amount that meets all constraints.
5. **Atomic execution** — once a valid configuration is found, both the swap and position creation are executed atomically.

If any condition fails during the process, the entire transaction reverts, ensuring no partial state changes or capital loss.

#### 🔁 Simulation Modes

- **Same-pool simulation**:
  Applied when the swap and liquidity position occur in the **same pool**. This allows precise price usage and full capital feedback control.

- **Cross-pool simulation**:
  Used when the liquidity position is created in a **different pool** than the swap. This enables AutoSwap to support multi-market strategies.

#### 🧠 Iterative Optimization

Rather than relying on static formulas, AutoSwap uses **iterative binary search** to calculate the optimal swap amount. Because token ratios and price impact are dynamic (especially under concentrated liquidity), the system:

- Simulates swap outcomes across different swap amounts,
- Measures resulting liquidity utilization and price impact,
- Refines swap size until the optimal configuration is found under user-defined constraints.

#### 📌 Why Predefined Pools?

AutoSwap is limited to **predefined token pairs and pool routes** to ensure operational safety and execution consistency. By routing swaps through vetted, audited pools, AutoSwap ensures **sufficient liquidity depth** and reduces the likelihood of slippage or failed transactions.
