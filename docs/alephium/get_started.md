---
title: Get Started

slug: /alephium/get_started
---

This guide will walk you through the essential steps to get started on our [platform](https://alph.invariant.app/), from connecting your wallet and requesting an airdrop to adding a liquidity position, swapping tokens, claiming fees, and closing your position. If you encounter any issues, check out the more detailed User Guide. If you have any questions, feel free to join our community on [Invariant's Discord](https://discord.gg/w6hTeWTJvG) for support. Please note that this walkthrough is on the testnet.

### Connect your wallet

To begin using Invariant, you'll need to [connect your wallet](/docs/alephium/user_guide/how_to_connect_your_wallet). Follow these steps:

1. Click on the **"Connect wallet"** button at the top right corner of the page or or in the swap area.
   ![Connect wallet](/img/docs/app/alph/alph_connectwallet.jpg)

2. Upon clicking the **"Connect Wallet"** button, a modal will appear with several options:

- **Extension Wallet** - Clicking this option will connect to the wallet installed in your browser.
- **Desktop Wallet** - Clicking this option will connect you to a desktop wallet.
- **Wallet Connect** - Clicking this option will allow you to connect using [WalletConnect](https://walletconnect.network/), enabling you to link your mobile wallet by scanning a QR code or through a deep link.

![wallet list](/img/docs/app/alph/alph_connectwallet_modal.png)

3. Follow the prompts to authorize the connection, and you are ready to go with your wallet connected.

![wallet list](/img/docs/app/alph/alph_sign_connect.jpg)

### Request airdrop from Alephium Faucet

To start interacting with the Invariant platform on the Alephium testnet, you will need some [testnet tokens](/docs/alephium/user_guide/faucet). You can request these tokens from the Alephium Faucet.

1. Open your wallet and click **"Add funds"** button.

![Add funds](/img/docs/app/alph/alph_add_funds.jpg)

2. Confirm by clicking **"Request $ALPH"** button.

![Request funds](/img/docs/app/alph/alph_request.jpg)

3. Your testnet **ALPH** tokens should appear in your wallet after couple seconds.

### Request airdrop from Invaraint Faucet

Now that you have testnet tokens to approve transactions on the Alephium Testnet, you can request an airdrop from Invariant. You will receive testnet BTC, ETH, and USDC.

1. Click the **"Faucet"** button on Invariant site.

![Buttons](/img/docs/app/alph/alph_faucet.jpg)

2. Sign transaction in your wallet.

![Approve transaction](/img/docs/app/alph/alph_sign_transaction.jpg)

3. After a while, you should have airdropped tokens in your wallet.

### Add liquidity

Adding a liquidity position allows you to earn fees from trades on the Invariant DEX. To [add a position](/docs/alephium/user_guide/how_to_add_liquidity) follow these steps:

1. Go to the **"Liqudity"** tab and click on **"Add Position"** button.

![add position](/img/docs/app/a0/a0_addposition.png)

2. Choose the tokens you want to provide liquidity for.

![alphusdc](/img/docs/app/alph/alph_select_tokens.jpg)

3. Select fee tier. The fee tier determines the percentage of tokens deducted from a user who makes a swap, thus defining the amount of fees you will earn when a user utilizes your liquidity in the swap. Each fee tier represents a different liquidity pool.

![feetier](/img/docs/app/alph/alph_select_feetier.jpg)

4. Specify the price range within which you want to provide liquidity This range determines where your tokens will be active in the market. You will earn fees only when trades occur within this range. Adjust the min and max price sliders to set your range.

![pricerange](/img/docs/app/alph/alph_price_range.jpg)

5. Enter the amount you want to contribute to the liquidity pool. Please note that you need to provide both tokens in the correct ratio.

![Deposit amount](/img/docs/app/alph/alph_add_position.jpg)

6. Click **"Add Position"** button

### Exchange tokens

Now you can use testnet tokens, that you received form Airdrop. This point will show you [how to perform swap](/docs/alephium/user_guide/how_to_swap) with this tokens.

1. Navigate to **"Exchange tab"**.

2. Select the tokens you wish to swap. A modal will appear where you can choose a specific token by either entering its name or selecting one from the list. Additionally, you can add a token by clicking the plus button and providing its token address. In this example, we're swapping from AZERO to USDC.

![chose token](/img/docs/app/alph/alph_select_token_list.png)

3. Enter the amount of tokens you want to swap. To swap all tokens from your wallet, simply click **“Max”**.

![swap](/img/docs/app/alph/alph_exchange_light.jpg)

4. Click **"Exchange"** and confirm the transaction in your wallet. Your swapped tokens will appear in your wallet once the transaction is completed.

**Potential problems:**

- **Insufficient balance** - this means that your balance is smaller than the amount of tokens you want to swap. To fix this, try swapping fewer tokens.

![Swap](/img/docs/app/alph/alph_insufficient_balance.jpg)

- **Insufficient liquidity** - this means that there is not enough liquidity in the pool to perform your swap. To fix this, add more liquidity or decrease the amount of tokens you want to swap.

![Swap](/img/docs/app/alph/alph_insufficient_liquidity.jpg)

- **Insufficient volume** - this means that you probably did not enter any tokens in the exchange window.

![Swap](/img/docs/app/alph/alph_insufficient_volume.jpg)

### Claim fees

As a liquidity provider, you can [claim your earned fees](/docs/alephium/user_guide/how_to_claim_fee). To claim fees:

- Navigate to the **"Liquidity"** section and open the position from which you want to claim fees.

- Click on **"Claim Fee"** to initiate the transaction.

![Claim fees](/img/docs/app/alph/alph_claim_fee.jpg)

- Confirm the transaction in your wallet.
- Your claimed fees will be added to your wallet balance.

### Close position

If you want to [close your position](/docs/alephium/user_guide/how_to_remove_liquidity) and remove liquidity, you can do this even if your fees are unclaimed. The fees after closing the position will be sent to your wallet along with the liquidity.

- Navigate to the **"Liquidity"** section and open the position which you want to close.

- Click **"Close Position"** and confirm the transaction in your wallet. Deposited tokens as well as unclaimed fees will be transferred to your wallet

![Position details](/img/docs/app/alph/alph_close_position.jpg)
