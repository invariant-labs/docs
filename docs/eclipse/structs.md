---
title: Accounts

slug: /eclipse/accounts
---

# Structs

This section provides an in-depth exploration of key data structures integral to the Invariant protocol's storage mechanism. These structs are specifically crafted to facilitate the sharing of the state of the exchange within the CLAMM model. These data structures play a pivotal role in maintaining and organizing information related to the exchange, ensuring efficient and organized handling of data.

## State

```rust
#[account(zero_copy(unsafe))]
#[repr(packed)]
#[derive(PartialEq, Default, Debug, InitSpace)]
pub struct State {
    pub admin: Pubkey,
    pub nonce: u8,
    pub authority: Pubkey,
    pub bump: u8,
}
```

| Name      | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| admin     | Pubkey | Address of the admin account.     |
| nonce     | u8     | Authority address bump.           |
| authority | Pubkey | Address of the authority account. |
| bump      | u8     | State address bump                |

## FeeTier

Struct containing information about the fee and tick spacing

```rust
#[account(zero_copy(unsafe))]
#[repr(packed)]
#[derive(PartialEq, Default, Debug, InitSpace)]
pub struct FeeTier {
    pub fee: FixedPoint,
    pub tick_spacing: u16,
    pub bump: u8,
}
```

| Name         | Type       | Description                                                  |
| ------------ | ---------- | ------------------------------------------------------------ |
| fee          | FixedPoint | Percentage of the fee collected upon every swap in the pool. |
| tick_spacing | u16        | The spacing between usable ticks.                            |
| bump         | u8         | Address bump                                                 |

## Pool

```rust
#[account(zero_copy(unsafe))]
#[derive(PartialEq, Default, Debug, InitSpace)]
pub struct Pool {
    pub token_x: Pubkey,
    pub token_y: Pubkey,
    pub token_x_reserve: Pubkey,
    pub token_y_reserve: Pubkey,
    pub position_iterator: u128,
    pub tick_spacing: u16,
    pub fee: FixedPoint,
    pub protocol_fee: FixedPoint,
    pub liquidity: Liquidity,
    pub sqrt_price: Price,
    pub current_tick_index: i32,
    pub tickmap: Pubkey,
    pub fee_growth_global_x: FeeGrowth,
    pub fee_growth_global_y: FeeGrowth,
    pub fee_protocol_token_x: u64,
    pub fee_protocol_token_y: u64,
    pub seconds_per_liquidity_global: SecondsPerLiquidity,
    pub start_timestamp: u64,
    pub last_timestamp: u64,
    pub fee_receiver: Pubkey,
    pub oracle_address: Pubkey,
    pub oracle_initialized: bool,
    pub bump: u8,
}
```

| Name                         | Type                | Description                                                                                                                                     |
| ---------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| token_x                      | Pubkey              | Token X address                                                                                                                                 |
| token_y                      | Pubkey              | Token Y address                                                                                                                                 |
| token_y_reserve              | Pubkey              | Pools associated token account for the token X                                                                                                  |
| token_y_reserve              | Pubkey              | Pools associated token account for the token Y                                                                                                  |
| position_iterator            | u128                | Iterator determining the id of the position relative to all positions that were created for the pool                                            |
| tick_spacing                 | u16                 | The spacing between usable ticks.                                                                                                               |
| fee                          | FixedPoint          | Percentage of the fee collected upon every swap in the pool.                                                                                    |
| protocol_fee                 | FixedPoint          | Percentage of the collected fees that will be deducted by the protocol                                                                          |
| liquidity                    | Liquidity           | Amount of virtual liquidity on pool. The difference between virtual and actual liquidity reflect the increased capital efficiency in Invariant. |
| sqrt_price                   | Price               | Square root of current price.                                                                                                                   |
| current_tick_index           | i32                 | The nearest tick below the current price.                                                                                                       |
| tickmap                      | Pubkey              | Address of the tickmap associated with the pool                                                                                                 |
| fee_growth_global_x          | FeeGrowth           | Amount of fees accumulated in x token in per one integer unit of Liquidity since pool initialization.                                           |
| fee_growth_global_y          | FeeGrowth           | Amount of fees accumulated in y token in per one integer unit of Liquidity since pool initialization.                                           |
| fee_protocol_token_x         | u64                 | Amount of protocol tokens accumulated in x token that are available to claim.                                                                   |
| fee_protocol_token_y         | u64                 | Amount of protocol tokens accumulated in y token that are available to claim.                                                                   |
| seconds_per_liquidity_global | SecondsPerLiquidity | The amount of time the pool existed divided by pools liquidity                                                                                  |
| start_timestamp              | u64                 | Time of pool initialization.                                                                                                                    |
| last_timestamp               | u64                 | Last update of pool.                                                                                                                            |
| fee_receiver                 | Pubkey              | Address of account allowed to claim protocol fee. By default it's admin but can be changed for specific pool.                                   |
| oracle_address               | Pubkey              | Address of the oracle (set to Pubkey::default() if not initialized)                                                                             |
| oracle_initialized           | bool                | Flag specifying if oracle was initialized                                                                                                       |
| bump                         | u8                  | Address bump                                                                                                                                    |

## PositionList

```rust
#[account(zero_copy(unsafe))]
#[repr(packed)]
#[derive(PartialEq, Default, Debug, InitSpace)]
pub struct PositionList {
    pub head: u32,
    pub bump: u8,
}
```

| Name | Types | Description               |
| ---- | ----- | ------------------------- |
| head | u32   | Head of the position list |
| bump | u8    | Address bump              |

## Position

```rust
#[account(zero_copy(unsafe))]
#[repr(packed)]
#[derive(PartialEq, Default, Debug, InitSpace)]
pub struct Position {
    pub owner: Pubkey,
    pub pool: Pubkey,
    pub id: u128,
    pub liquidity: Liquidity,
    pub lower_tick_index: i32,
    pub upper_tick_index: i32,
    pub fee_growth_inside_x: FeeGrowth,
    pub fee_growth_inside_y: FeeGrowth,
    pub seconds_per_liquidity_inside: SecondsPerLiquidity,
    pub last_slot: u64,
    pub tokens_owed_x: FixedPoint,
    pub tokens_owed_y: FixedPoint,
    pub bump: u8,
}
```

| Name                         | Type                | Description                                                                                                                             |
| ---------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| owner                        | Pubkey              | Position owner's account key.                                                                                                           |
| pool                         | Pubkey              | Pool account's key.                                                                                                                     |
| id                           | u128                | Id relative to all positions created for the pool.                                                                                      |
| liquidity                    | Liquidity           | Amount of virtual liquidity that the position represents.                                                                               |
| lower_tick_index             | i32                 | Lower tick index of the Position.                                                                                                       |
| upper_tick_index             | i32                 | Upper tick index of the Position.                                                                                                       |
| fee_growth_inside_x          | FeeGrowth           | Amount of fees accumulated in x token per one integer unit of Liquidity in-range. It is used to determine the shares of collected fees. |
| fee_growth_inside_y          | FeeGrowth           | Amount of fees accumulated in y token per one integer unit of Liquidity in-range. It is used to determine the shares of collected fees. |
| last_slot                    | u64                 | Last update of position expressed in block number.                                                                                      |
| tokens_owed_x                | FixedPoint          | The quantity of x tokens collected in fees that is available for claiming.                                                              |
| tokens_owed_y                | FixedPoint          | The quantity of y tokens collected in fees that is available for claiming.                                                              |
| seconds_per_liquidity_inside | SecondsPerLiquidity | Amount of time that the price was within liquidity range of the position divided by positions liquidity                                 |
| bump                         | u8                  | Address bump                                                                                                                            |

## Tickmap

```rust
#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct Tickmap {
    pub bitmap: [u8; 11091]
}
```

| Name   | Type       | Description                                                     |
| ------ | ---------- | --------------------------------------------------------------- |
| bitmap | [u8;11091] | Array containing active bytes containing states of active ticks |

## Tick

```rust
#[account(zero_copy(unsafe))]
#[repr(packed)]
#[derive(PartialEq, Default, Debug, InitSpace)]
pub struct Tick {
    pub pool: Pubkey,
    pub index: i32,
    pub sign: bool, // true means positive
    pub liquidity_change: Liquidity,
    pub liquidity_gross: Liquidity,
    pub sqrt_price: Price,
    pub fee_growth_outside_x: FeeGrowth,
    pub fee_growth_outside_y: FeeGrowth,
    pub seconds_per_liquidity_outside: SecondsPerLiquidity,
    pub seconds_outside: u64,
    pub bump: u8,
}
```

| Name                          | Type                | Description                                                                                                                                                                 |
| ----------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pool                          | Pubkey              | Address of the pool the tick belongs to.                                                                                                                                    |
| index                         | i32                 | Index of tick.                                                                                                                                                              |
| sign                          | bool                | Determine if the liquidity will be added or subtracted on cross.                                                                                                            |
| liquidity_change              | Liquidity           | Amount of virtual liquidity to adjust while. crossing.                                                                                                                      |
| liquidity_gross               | Liquidity           | Amount of virtual liquidity to be added on the tick, excluding liquidity taken on that tick. It is used to impose the maximum liquidity that can be place on a single tick. |
| sqrt_price                    | Price               | Square root of tick price.                                                                                                                                                  |
| fee_growth_outside_x          | FeeGrowth           | Amount of Fees accumulated in x token outside-range.                                                                                                                        |
| fee_growth_outside_y          | FeeGrowth           | Amount of Fees accumulated in y token outside-range.                                                                                                                        |
| seconds_per_liquidity_outside | SecondsPerLiquidity | Amount of time that the price was past the index divided by pools liquidity.                                                                                                |
| seconds_outside               | u64                 | Seconds outside-range.                                                                                                                                                      |
| bump                          | u8                  | Tick address bump                                                                                                                                                           |

## Oracle & Record

```rust
#[account(zero_copy(unsafe))]
#[repr(packed)]
pub struct Oracle {
    pub data: [Record; 256],
    pub head: u16,
    pub amount: u16,
    pub size: u16,
}
```

| Name   | Type          | Description                         |
| ------ | ------------- | ----------------------------------- |
| data   | [Record; 256] | Recorded price data with timestamps |
| head   | u16           | Last updated record                 |
| amount | u16           | Amount of records                   |
| size   | u16           | Max amount of records (256)         |

```rust
#[zero_copy(unsafe)]
#[repr(packed)]
pub struct Record {
    pub timestamp: u64,
    pub price: Price,
}
```

| Name      | Type  | Description                             |
| --------- | ----- | --------------------------------------- |
| timestamp | u64   | Timestamp of the price                  |
| price     | Price | Square root of price at given timestamp |
