---
title: How to swap?

slug: /alephium/user_guide/how_to_swap
---

Here's a step-by-step guide to get started:

1. Navigate to the **Exchange** page.

2. Select the tokens you wish to swap. For instance, if you want to swap **ALPH** tokens, click on the **ALPH** token. A modal will appear where you can choose a specific token by either entering its name or selecting one from the list. Additionally, you can add a token by clicking the plus button and providing its token address. In this example, we're swapping from **ALPH** to **USDC**.

![token](/img/docs/app/alph/alph_token.png)

![chose token](/img/docs/app/alph/alph_select_token_list.png)

3. Enter the amount of tokens you want to swap. To swap all tokens from your wallet, simply click the **Max** button.

![swap](/img/docs/app/alph/alph_exchange_light.jpg)

4. Check the **current price** of the tokens and their **contract addresses**. We highly recommend checking if the contract addresses of the tokens are correct to avoid any mistakes.

![price window](/img/docs/app/alph/alph_stats.jpg)

- Here you can copy the address of the token you want to exchange to the clipboard.

![copy address](/img/docs/app/alph/alph_contract.jpg)

- Clicking this little icon next to the **token ticker** will redirect you to the token details on [Alephium Explorer](https://testnet.alephium.org/) page.

![redirections](/img/docs/app/alph/alph_contractaddress.jpg)

1. Review the **Transaction details** to see specific information about your transaction:

![transaction details](/img/docs/app/alph/alph_show_transaction_details.jpg)

![transaction details2](/img/docs/app/alph/alph_transactiondetails.png)

- **Exchange rate** - Indicates how much of one token you'll receive for another (e.g., **1 ALPH** = **1.89 USDC**), helping you understand the trade's impact on your holdings.
- **Fee** - Represents the cost associated with using a particular liquidity pool to execute a transaction. It shows the amount paid to liquidity providers as an incentive for supplying liquidity.
- **Price impact** - Measures how much a trade affects the price of a cryptocurrency, providing insight into its potential market impact.
- **Slippage tolerance** - Sets the maximum difference between the expected and actual price of a trade, ensuring execution within a specified price range even if market conditions change.

You can also swap the exchange rate by clicking on the token's price.

![tokens ratio](/img/docs/app/alph/alph_ratio.jpg)

1. In the top right corner, you can optionally set your slippage tolerance (defaults to 1%).

- This value is a percentage, where 1% is represented by 1.
- Clicking the **Auto** button sets the slippage tolerance to 1%.
- Maximum possible value is 50%.
- Invariant remembers your slippage tolerance setting for future use, even after you close your browser.

![slippage](/img/docs/app/alph/alph_slippagelight.jpg)

![slippage settings](/img/docs/app/a0/a0_slippagesettings.png)

7. Before initiating a swap, you have the option to refresh token prices by clicking the **"refresh button"**. This action helps mitigate the risk of encountering high slippage during the transaction by providing updated pricing information.

![refresher](/img/docs/app/a0/a0_refresher.png)

8. Once you've configured everything, click **Exchange**.

![exchange](/img/docs/app/alph/alph_exchange_light.jpg)

9. Confirm the transaction in your wallet.

![Transaction approve](/img/docs/app/alph/alph_sign_transaction.jpg)

10. That's it! After a few seconds, you should see your swapped tokens in your wallet.
