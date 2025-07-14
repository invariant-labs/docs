---
title: Single-Sided Liquidity

slug: /invariant_points/espools
---

![Content program](/img/docs/app/invariant_points/es5.png)

Adding **single-sided liquidity** is a powerful DeFi technique that many users overlook or don’t fully understand. Unlike the standard **50:50** setup (where you must deposit equal value of both tokens), **single-sided liquidity** lets you concentrate your liquidity entirely on one side of the pair, giving you more control over how your assets are used.

Think of it like setting a **limit order** on a traditional exchange: you’re choosing a price range where you’re willing to trade one asset for another. Outside of that range, you simply hold your chosen asset. It’s a bit like saying, "Will sell my **USDC** for **ES** only if **ES** drops to my target price range." This approach can be more capital-efficient and strategic, but it requires careful planning.

### Quick tutorial step by step

1. Make sure you’re in **"Range"** mode and have AutoSwap set to **"Basic"**, just like in the screenshot below.

![Content program](/img/docs/app/invariant_points/es1.jpg)

2. Take a look at the **Current Price** value, which is shown on the chart as a vertical yellow line. We’ll be setting up single-sided liquidity relative to this value. The **Current Price** for the **ES** token is currently set at 0.6 USDC.

![Content program](/img/docs/app/invariant_points/es4.jpg)

3. The default range is distributed symmetrically around the **Current Price**. In this setup, you get a **50:50** ratio, which means you need to add equal value of both tokens. To provide single-sided liquidity, the **"MIN"** and **"MAX"** indicators must be positioned to the left of the line marking the **Current Price**.

![Content program](/img/docs/app/invariant_points/es3.jpg)

4. As you can see in the screenshot below, I’ve set the price range around **$0.49–$0.57**. How will my position behave now and after the ES token launch? Let's break it down.

![Content program](/img/docs/app/invariant_points/es2.jpg)

**Currently **– The position will remain inactive because trading for ES hasn’t started yet.

**After TGE (starting price $0.6)** – Trading for the ES token has started, but its price is outside my price range. The position remains inactive.

**After TGE (price drop to $0.56)** – The position becomes active because the market price of ES has entered my price range. Part of the USDC I previously added to the position gets swapped for ES tokens. Current position ratio: **USDC 85:15 ES**.

**After TGE (price drop to $0.53)** – The position is active, and the ES price is now exactly in the middle of my price range. More of the USDC I added earlier gets swapped for ES tokens. Current position ratio: **USDC _50:50_ ES**.

**After TGE (price drop to $0.48)** – The position is inactive because the ES price is now below my price range. All of the USDC I added earlier has been swapped for ES tokens. Current position ratio: **USDC 0:100 ES**.

What happens if the ES price starts going back up? The same process, just in reverse: if the price moves above my price range, the position will shift back to **100% USDC**, just as it was when it was originally added. Meanwhile, I will be earning a significant amount of **fees**, especially when the price is volatile, as well as **Invariant Points** thanks to adding single-sided liquidity ahead of other users.
