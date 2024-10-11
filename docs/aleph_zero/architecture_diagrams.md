---
title: Architecture diagrams

slug: /aleph_zero/architecture_diagrams
---

This document contains architecture diagrams that provide detailed representations of the system's individual functions. Each diagram describes key components and their interactions, making it easier to understand the structure and operation of the application.

## Init DEX

The init_dex entrypoint initializes the decentralized exchange (DEX) by setting up the initial state of the contract. It performs the following steps:

- Sets the caller as the administrator of the contract.
- Configures default values such as protocol fees and data structures related to user positions and liquidity pools.
- Initializes essential mappings and structures to prepare the DEX for further operations, such as adding liquidity and executing trades.

![init_dex](/img/docs/app/architecture_diagrams/init_dex.png)

## Add fee tier

```rust
#[ink(message)]
pub fn add_fee_tier(&mut self, fee_tier: FeeTier) -> Result<(), InvariantError>;
```

This function enables the addition of a new fee tier, which users can subsequently utilize when creating pools. Please note that this action is restricted to administrators.

![change_protocol_fee](/img/docs/app/architecture_diagrams/add_fee_tier.png)

## Calculate swap

```rust
#[ink(message)]
pub fn swap(
    &mut self,
    pool_key: PoolKey,
    x_to_y: bool,
    amount: TokenAmount,
    by_amount_in: bool,
    sqrt_price_limit: SqrtPrice,
) -> Result<CalculateSwapResult, InvariantError>;
```

This function executes a swap based on the provided parameters. It transfers tokens from the user's address to the contract's address and vice versa. The swap will fail if the user does not have enough tokens, has not approved enough tokens, or if there is insufficient liquidity.

![calculate_swap](/img/docs/app/architecture_diagrams/calculate_swap.png)

## Change admin

```rust
#[ink(message)]
fn change_admin(&mut self, new_admin: AccountId) -> Result<(), InvariantError>
```

Updates admin accountId. Please note that this action is restricted to administrators.

![change_admin](/img/docs/app/architecture_diagrams/change_admin.png)

## Change liquidity

```rust
#[ink(message)]
fn change_liquidity(
    &mut self,
    index: u32,
    delta_liquidity: Liquidity,
    add_liquidity: bool,
    slippage_limit_lower: SqrtPrice,
    slippage_limit_upper: SqrtPrice,
) -> Result<(), InvariantError>
```

This entrypoint changes the liquidity of an existing position. If the liquidity is added tokens corresponding to the liquidity amount will be deducted from user's balance. Removing liquidity results in tokens being returned to the user.

![change_liquidity](/img/docs/app/architecture_diagrams/change_liquidity.png)

## Change protocol fee

```rust
#[ink(message)]
pub fn change_protocol_fee(&mut self, protocol_fee: Percentage) -> Result<(), InvariantError>;
```

This function allows for the adjustment of the current protocol fee percentage. Note that this operation is restricted to administrators.

![change_protocol_fee](/img/docs/app/architecture_diagrams/change_protocol_fee.png)

## Change fee receiver

```rust
#[ink(message)]
pub fn change_fee_receiver(
    &mut self,
    pool_key: PoolKey,
    fee_receiver: AccountId,
) -> Result<(), InvariantError>;
```

This function allows for the modification of the fee receiver of a pool. Please note that this action is exclusively available to administrators.

![change_protocol_fee](/img/docs/app/architecture_diagrams/change_fee_receiver.png)

## Claim fee

```rust
#[ink(message)]
pub fn claim_fee(
    &mut self,
    index: u32,
) -> Result<(TokenAmount, TokenAmount), InvariantError>;
```

This function allows the user to claim fees from an existing position. Tokens will be sent to the user's address.

![claim_fee](/img/docs/app/architecture_diagrams/claim_fee.png)

## Create pool

```rust
#[ink(message)]
pub fn create_pool(
    &mut self,
    token_0: AccountId,
    token_1: AccountId,
    fee_tier: FeeTier,
    init_sqrt_price: SqrtPrice
    init_tick: i32,
) -> Result<(), InvariantError>;
```

This function creates a pool based on a pair of tokens and the specified fee tier. The order of the tokens is irrelevant, and only one pool can exist with a specific combination of two tokens and a fee tier.

![create_pool](/img/docs/app/architecture_diagrams/create_pool.png)

## Create position

```rust
#[ink(message)]
pub fn create_position(
    &mut self,
    pool_key: PoolKey,
    lower_tick: i32,
    upper_tick: i32,
    liquidity_delta: Liquidity,
    slippage_limit_lower: SqrtPrice,
    slippage_limit_upper: SqrtPrice,
) -> Result<Position, InvariantError>;
```

This function creates a position based on the provided parameters. The amount of tokens specified in liquidity delta will be deducted from the user's token balances. Position creation will fail if the user does not have enough tokens or has not approved enough tokens.

![create_position](/img/docs/app/architecture_diagrams/create_position.png)

## Update position seconds per liquidity

```rust
#[ink(message)]
fn update_position_seconds_per_liquidity(&mut self, index: u32) -> Result<(), InvariantError>
```

Updates seconds per liquidity parameter for a given position.

![update_position_spr](/img/docs/app/architecture_diagrams/update_position_spr.png)

## Remove fee tier

```rust
#[ink(message)]
pub fn remove_fee_tier(&mut self, key: FeeTier) -> Result<(), InvariantError>;
```

This function removes a fee tier based on the provided fee tier key. After removal, the fee tier will no longer be available for use in pool creation. It is important to note that existing pools with that fee tier will remain unaffected. This action is exclusively available to administrators.

![change_protocol_fee](/img/docs/app/architecture_diagrams/remove_fee_tier.png)

## Remove position

```rust
#[ink(message)]
pub fn remove_position(
    &mut self,
    index: u32,
) -> Result<(TokenAmount, TokenAmount), InvariantError>;
```

This function removes a position from the user's position list and transfers the tokens used to create the position to the user's address.

![remove_position](/img/docs/app/architecture_diagrams/remove_position.png)

## Set code

```rust
#[ink(message)]
fn set_code(&mut self, code_hash: Hash) -> Result<(), InvariantError>
```

Updates code of the contract. Ensure that the new code has the same memory layout for the types used in storage. Please note that this action is restricted to administrators

![set_code](/img/docs/app/architecture_diagrams/set_code.png)

## Swap route

```rust
#[ink(message)]
pub fn swap_route(
    &mut self,
    amount_in: TokenAmount,
    expected_amount_out: TokenAmount,
    slippage: Percentage,
    swaps: Vec<SwapHop>,
) -> Result<(), InvariantError>;
```

This function facilitates atomic swaps between the user's address and the contract's address, executing multiple swaps based on the provided parameters. Tokens are transferred bidirectionally, from the user to the contract and vice versa, all within a single transaction. The swap is designed to be atomic, ensuring that it either completes entirely or reverts entirely. The success of the swap depends on factors such as the user having sufficient tokens, having approved the necessary token amounts, and the presence of adequate liquidity. Any failure in meeting these conditions will result in the swap transaction being reverted.

![swap_route](/img/docs/app/architecture_diagrams/swap_route.png)

## Transfer position

```rust
#[ink(message)]
pub fn transfer_position(
    &mut self,
    index: u32,
    receiver: AccountId,
) -> Result<(), InvariantError>;
```

This function changes ownership of an existing position based on the position index in the user's position list. You can only change ownership of positions that you own; otherwise, it will return an error.

![transfer_position](/img/docs/app/architecture_diagrams/transfer_position.png)

## Withdraw all wzero

```rust
#[ink(message)]
fn withdraw_all_wazero(&self, address: AccountId) -> Result<(), InvariantError>
```

Unwraps wAZERO tokens on behalf of the caller by transferring all the balance
from the users account to the contract, withdrawing all wAZERO, and transferring AZERO back to the user.

![withdraw_all_wzero](/img/docs/app/architecture_diagrams/withdraw_all_wzero.png)

## Withdraw protocol fee

```rust
#[ink(message)]
pub fn withdraw_protocol_fee(&mut self, pool_key: PoolKey) -> Result<(), InvariantError>;
```

This operation enables the withdrawal of protocol fees associated with a specific pool, based on the provided pool key. The withdrawn funds are sent to the fee receiver wallet. Please note that this action can only be performed by fee receiver.

![withdraw_protocol_fee](/img/docs/app/architecture_diagrams/withdraw_protocol_fee.png)
