---
title: Get started

slug: /invariant_points/get_started
---

## How to Get Started with Invariant Points?

## Adding position

Let’s start by adding a liquidity position on Invariant. If you’ve never done this before, check out our beginner tutorial here(link).

### 1. Navigate to the Points Tab.

![Points Tab](/img/docs/app/invariant_points/points_tab.jpg)

### 2. All recommended pools are listed under Rewarded Pools. Add liquidity to one of these pools by clicking the “+” button.

![Recommended Pools](/img/docs/app/invariant_points/recommended_pools.jpg)

- **APR (Annual Percentage Rate)**: The simple annualized return of your position, calculated without considering compounding.
- **APY (Annual Percentage Yield)**: The annualized return of your position, including the effect of compounding over time.
- **Fee**: The fee tier of the pool. This is crucial to ensure you add liquidity to the correct fee tier. Adding liquidity to a non-recommended fee tier will not earn you points.
- **Points per 24h**: The fixed number of points distributed to all active positions in the pool over a 24-hour period.

### 3. Add liquidity

After clicking “**+**”, you will be redirected to the liquidity addition window.

![New position](/img/docs/app/invariant_points/new_position.png)

To earn points, pay special attention to two key factors:

- **Fee Tier**

  Ensure you are on the correct fee tier. The fee tier eligible for points will be highlighted with a gradient border (as shown in the image below).

  ![Fee tier](/img/docs/app/invariant_points/fee_tier.png)

- **Concentration**

  This is the most critical aspect of providing liquidity. The right concentration level can significantly increase your points. If ranking high is important to you, familiarize yourself with the concentration mechanism described in detail here.

  ![Concentration Slider](/img/docs/app/invariant_points/concentration_slider.png)

### 4. Check your position

Great! Now that you’ve added liquidity, you can view your new position in the **Portfolio tab**.

- **Position that is accruing points**

  Positions open in pools distributing points are marked with a colorful parachute icon. Hovering over it allows you to check how many points your pool is currently accruing.

  ![Active position](/img/docs/app/invariant_points/active_position.png)

- **Position that is not accruing points**

  If a position moves out of the set price range and stops earning fees and points, or if it was opened in a pool that doesn’t distribute points at all, the parachute will turn gray.

  ![Inactive position](/img/docs/app/invariant_points/inactive_position.png)

## Managing position

Now, let’s move on to the most important aspect of concentrated liquidity provision—managing your position. The key is to stay within the designated range, but this can be challenging. Depending on your level of concentration, you may need to rebalance your position frequently. In this section, we’ll guide you through the process.

### 1. Check if Your Position Is in Range

- **Active liquidity** (Position in Range)

  This example shows active liquidity, meaning the position is within the set price range. This is the desired outcome, as you earn both swap fees and points. If your position is in range, there’s nothing you need to do other than monitor it to ensure it remains there.

  ![Active liquidity](/img/docs/app/invariant_points/active_liquidity.png)

- **Inactive Liquidity** (Position Out of Range)

  This is an undesirable situation. The price has moved outside your set price range, rendering your liquidity inactive. It is no longer utilized in swaps, and you stop earning both fees and points. You will need to rebalance your position.

  ![Inactive liquidity](/img/docs/app/invariant_points/inactive_liquidity.png)

### 2. Rebalance Your Position

Let’s walk through the rebalancing process step by step.

- **Close Your Position** (\*Earned fees will be collected automatically)

  ![Close position](/img/docs/app/invariant_points/close_position.jpg)

- **Swap Your Tokens to Restore the Desired Ratio**

  As shown in the example, when your position falls out of range, the token ratio will shift depending on the direction of the price movement. To reopen your position, you must perform a swap to restore the desired token ratio based on your chosen level of concentration.

  ![Token ratio](/img/docs/app/invariant_points/token_ratio.png)

- **Reopen Your Position**

  Once you’ve restored the appropriate ratio for your desired concentration level, simply reopen the position. The rebalancing process is now complete.
