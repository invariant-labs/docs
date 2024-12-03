# Entrypoints

## CreateState

Entrypoint called when deploying new contract. Creates state and authority pubkey.

```rs
#[derive(Accounts)]
#[instruction( nonce: u8)]
pub struct CreateState<'info> {
    #[account(init, seeds = [b"statev1".as_ref()], bump, payer = admin, space = State::LEN)]
    pub state: AccountLoader<'info, State>,
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(seeds = [b"Invariant".as_ref()], bump = nonce)]
    /// CHECK: Ignore
    pub program_authority: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: Ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Context Params

| Name  | Type | Description              |
| ----- | ---- | ------------------------ |
| nonce | u8   | Authority account nonce. |

#### Accounts

| Name              | Type                | Description                                                        |
| ----------------- | ------------------- | ------------------------------------------------------------------ |
| state             | State               | State account that will be initialized.                            |
| admin             | Signer              | Admin account, which is also a signer of the transaction.          |
| program_authority | AccountInfo         | Empty account which owns all ATAs and signs transfer transactions. |
| rent              | Sysvar<'info, Rent> | System rent account.                                               |
| system_program    | AccountInfo         | System program account.                                            |

## CreateFeeTier

Admin restricted entrypoint, allows for creation of fee tiers.

```rs
#[access_control(admin(&ctx.accounts.state, &ctx.accounts.admin))]
pub fn create_fee_tier(
    ctx: Context<CreateFeeTier>,
    fee: u128,
    tick_spacing: u16,
) -> Result<()> {
    ctx.accounts.handler(fee, tick_spacing, ctx.bumps.fee_tier)
}
```

#### Entrypoint Params

| Name         | Type | Description                                       |
| ------------ | ---- | ------------------------------------------------- |
| fee          | u128 | Fee that will be converted into fixed point type. |
| tick_spacing | u16  | Space between valid ticks.                        |

### Context

```rs
#[derive(Accounts)]
#[instruction(fee: u128, tick_spacing: u16)]
pub struct CreateFeeTier<'info> {
    #[account(init,
        seeds = [b"feetierv1", __program_id.as_ref(), &fee.to_le_bytes(), &tick_spacing.to_le_bytes()],
        bump, payer = admin, space = FeeTier::LEN
    )]
    pub fee_tier: AccountLoader<'info, FeeTier>,
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(mut, constraint = &state.load()?.admin == admin.key @ InvalidAdmin)]
    pub admin: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: Ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Context Params

| Name         | Type | Description                                       |
| ------------ | ---- | ------------------------------------------------- |
| fee          | u128 | Fee that will be converted into fixed point type. |
| tick_spacing | u16  | Space between valid ticks.                        |

#### Accounts

| Name           | Type                | Description                    |
| -------------- | ------------------- | ------------------------------ |
| fee_tier       | FeeTier             | FeeTier to be created.         |
| state          | State               | State account of the protocol. |
| admin          | Signer              | Protocol admin account.        |
| rent           | Sysvar<'info, Rent> | System rent account.           |
| system_program | AccountInfo         | System program account.        |

#### Errors

| Code                 | Description                          |
| -------------------- | ------------------------------------ |
| `InvalidTickSpacing` | Tick spacing outside of valid range. |
| `InvalidAdmin`       | Admin account is invalid.            |

## CreatePool

Entrypoint used for creating pools. Tickmap account key must be generated off chain. To use pool fully you must initialize reserves with a separate entrypoint.

```rs
pub fn create_pool(ctx: Context<CreatePool>, init_tick: i32) -> Result<()> {
    ctx.accounts.handler(init_tick, ctx.bumps.pool)
}
```

#### Entrypoint Params

| Name      | Type | Description                      |
| --------- | ---- | -------------------------------- |
| init_tick | i32  | Initial price tick for the pool. |

### Context

```rs
#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(init,
        seeds = [b"poolv1", token_x.to_account_info().key.as_ref(), token_y.to_account_info().key.as_ref(), &fee_tier.load()?.fee.v.to_le_bytes(), &fee_tier.load()?.tick_spacing.to_le_bytes()],
        bump, payer = payer, space = Pool::LEN
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(
        seeds = [b"feetierv1", __program_id.as_ref(), &fee_tier.load()?.fee.v.to_le_bytes(), &fee_tier.load()?.tick_spacing.to_le_bytes()],
        bump = fee_tier.load()?.bump
    )]
    pub fee_tier: AccountLoader<'info, FeeTier>,
    #[account(zero)]
    pub tickmap: AccountLoader<'info, Tickmap>,

    #[account(
        mint::token_program = token_x_program
    )]
    pub token_x: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mint::token_program = token_y_program
    )]
    pub token_y: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Accounts

| Name            | Type                | Description                                                          |
| --------------- | ------------------- | -------------------------------------------------------------------- |
| state           | State               | State account of the protocol.                                       |
| fee_tier        | FeeTier             | FeeTier that the tick spacing and fee percentage will be taken from. |
| tickmap         | Tickmap             | Empty account that will be used to store tickmap.                    |
| token_x         | Mint                | Token X Mint account.                                                |
| token_y         | Mint                | Token Y Mint account.                                                |
| payer           | Signer              | Signer of the transaction.                                           |
| token_x_program | TokenInterface      | Token X associated program account.                                  |
| token_y_program | TokenInterface      | Token Y associated program account.                                  |
| rent            | Sysvar<'info, Rent> | System rent account.                                                 |
| system_program  | AccountInfo         | System program account.                                              |

#### Errors

| Code               | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `InvalidTickIndex` | Initial tick not divisible by spacing or outside of size limit or price limit. |

## InitReserves

Entrypoint used for initializing reserves on existing pool. It only needs to be called once after creating the pool.

```rs
pub fn init_reserves(ctx: Context<InitReserves>) -> Result<()> {
    ctx.accounts.handler()
}
```

### Context

```rs
#[derive(Accounts)]
pub struct InitReserves<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(mut,
        seeds = [b"poolv1", token_x.to_account_info().key.as_ref(), token_y.to_account_info().key.as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,

    #[account(
        mint::token_program = token_x_program
    )]
    pub token_x: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mint::token_program = token_y_program
    )]
    pub token_y: Box<InterfaceAccount<'info, Mint>>,

    #[account(init,
        token::mint = token_x,
        token::authority = authority,
        token::token_program = token_x_program,
        payer = payer,
    )]
    pub token_x_reserve: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(init,
        token::mint = token_y,
        token::authority = authority,
        token::token_program = token_y_program,
        payer = payer,
    )]
    pub token_y_reserve: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(constraint = &state.load()?.authority == authority.key @ InvalidAuthority)]
    /// CHECK: ignore
    pub authority: AccountInfo<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
    #[account(address = system_program::ID)]
    /// CHECK: ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Accounts

| Name            | Type           | Description                                         |
| --------------- | -------------- | --------------------------------------------------- |
| state           | State          | State account of the protocol.                      |
| pool            | Pool           | Pool to initialize the reserves of.                 |
| token_x         | Mint           | Token X Mint account.                               |
| token_y         | Mint           | Token Y Mint account.                               |
| token_x_reserve | TokenAccount   | Empty account for Token X associated token account. |
| token_y_reserve | TokenAccount   | Empty account for Token Y associated token account. |
| payer           | Signer         | Signer of the transaction.                          |
| authority       | AccountInfo    | Authority account from the protocol state.          |
| token_x_program | TokenInterface | Token X associated program account.                 |
| token_y_program | TokenInterface | Token Y associated program account.                 |
| system_program  | AccountInfo    | System program account.                             |

#### Errors

| Code                        | Description                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `InvalidAuthority`          | Provided authority is invalid or provided token account doesn't belong to authority. |
| `InvalidPoolTokenAddresses` | Tokens were not sorted correctly or are the same.                                    |

## CreatePositionList

Creates position list for an account, position list is unique for the entire protocol.

```rs
pub fn create_position_list(ctx: Context<CreatePositionList>) -> Result<()> {
    ctx.accounts.handler(ctx.bumps.position_list)
}
```

### Context

```rs
#[derive(Accounts)]
pub struct CreatePositionList<'info> {
    #[account(init,
        seeds = [b"positionlistv1", owner.key().as_ref()],
        bump,
        payer = signer,
        space = PositionList::LEN
    )]
    pub position_list: AccountLoader<'info, PositionList>,
    /// CHECK: Ignore
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: Ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Accounts

| Name           | Type                | Description                                 |
| -------------- | ------------------- | ------------------------------------------- |
| position_list  | PositionList        | Account of the position list to be created. |
| owner          | AccountInfo         | Account of the position list owner.         |
| signer         | Signer              | Account of transaction signer.              |
| rent           | Sysvar<'info, Rent> | Rent account.                               |
| system_program | AccountInfo         | System program account.                     |

## CreateTick

Creates tick on a specified pool with specified tick index.

```rs
pub fn create_tick(ctx: Context<CreateTick>, index: i32) -> Result<()> {
    ctx.accounts.handler(index, ctx.bumps.tick)
}
```

#### Entrypoint Params

| Name  | Type | Description        |
| ----- | ---- | ------------------ |
| index | i32  | Index of the tick. |

### Context

```rs
#[derive(Accounts)]
#[instruction( index: i32)]
pub struct CreateTick<'info> {
    #[account(init,
        seeds = [b"tickv1", pool.key().as_ref(), &index.to_le_bytes()],
        bump, payer = payer, space = Tick::LEN
    )]
    pub tick: AccountLoader<'info, Tick>,
    #[account(
        seeds = [b"poolv1", token_x.key().as_ref(), token_y.key().as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(mut,
        constraint = tickmap.key() == pool.load()?.tickmap @ InvalidTickmap,
        constraint = tickmap.to_account_info().owner == __program_id @ InvalidTickmapOwner,
    )]
    pub tickmap: AccountLoader<'info, Tickmap>,
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount,
        mint::token_program = token_x_program
    )]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(
        constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount,
        mint::token_program = token_y_program
    )]
    pub token_y: InterfaceAccount<'info, Mint>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: Ignore
    pub system_program: AccountInfo<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
}
```

#### Context Params

| Name  | Type | Description        |
| ----- | ---- | ------------------ |
| index | i32  | Index of the tick. |

#### Accounts

| Name            | Type                | Description                             |
| --------------- | ------------------- | --------------------------------------- |
| tick            | Tick                | Account of the tick to be created.      |
| pool            | Pool                | Pool on which the tick will be created. |
| tickmap         | Tickmap             | Account of the pools tickmap.           |
| token_x         | Mint                | Token X mint account.                   |
| token_y         | Mint                | Token Y mint account.                   |
| token_x_program | TokenInterface      | Token X associated token account.       |
| token_y_program | TokenInterface      | Token Y associated token account.       |
| payer           | Signer              | Account of transaction signer.          |
| rent            | Sysvar<'info, Rent> | Rent account.                           |
| system_program  | AccountInfo         | System program account.                 |

#### Errors

| Code                  | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| `InvalidTickmap`      | Tickmap doesn't match pools tickmap.                                           |
| `InvalidTickmapOwner` | Tickmap owned by wrong account.                                                |
| `InvalidTokenAccount` | Provided token mint is incorrect.                                              |
| `InvalidTickIndex`    | Initial tick not divisible by spacing or outside of size limit or price limit. |

## CreatePosition

Creates position on desired pool with liquidity spread on the range specified by the tick indexes range.

```rs
pub fn create_position(
    ctx: Context<CreatePosition>,
    _lower_tick_index: i32,
    _upper_tick_index: i32,
    liquidity_delta: Liquidity,
    slippage_limit_lower: Price,
    slippage_limit_upper: Price,
) -> Result<()> {
    ctx.accounts.handler(
        liquidity_delta,
        slippage_limit_lower,
        slippage_limit_upper,
        ctx.bumps.position,
    )
}
```

#### Entrypoint Params

| Name                 | Type      | Description                                                         |
| -------------------- | --------- | ------------------------------------------------------------------- |
| lower_tick_index     | i32       | Index of the lower tick for the position.                           |
| upper_tick_index     | i32       | Index of the upper tick for the position.                           |
| liquidity_delta      | Liquidity | Liquidity for the new position.                                     |
| slippage_limit_lower | Price     | Min price the pool may have at the moment when position is created. |
| slippage_limit_upper | Price     | Max price the pool may have at the moment when position is created. |

### Context

```rs
#[derive(Accounts)]
#[instruction( lower_tick_index: i32, upper_tick_index: i32)]
pub struct CreatePosition<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(init,
        seeds = [b"positionv1",
        owner.key.as_ref(),
        &position_list.load()?.head.to_le_bytes()],
        bump, payer = payer, space = Position::LEN
    )]
    pub position: AccountLoader<'info, Position>,
    #[account(mut,
        seeds = [b"poolv1", token_x.key().as_ref(), token_y.key().as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(mut,
        seeds = [b"positionlistv1", owner.key.as_ref()],
        bump = position_list.load()?.bump
    )]
    pub position_list: AccountLoader<'info, PositionList>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub owner: Signer<'info>,
    #[account(mut,
        seeds = [b"tickv1", pool.key().as_ref(), &lower_tick_index.to_le_bytes()],
        bump = lower_tick.load()?.bump
    )]
    pub lower_tick: AccountLoader<'info, Tick>,
    #[account(mut,
        seeds = [b"tickv1", pool.key().as_ref(), &upper_tick_index.to_le_bytes()],
        bump = upper_tick.load()?.bump
    )]
    pub upper_tick: AccountLoader<'info, Tick>,
    #[account(mut,
        constraint = tickmap.key() == pool.load()?.tickmap @ InvalidTickmap,
        constraint = tickmap.to_account_info().owner == __program_id @ InvalidTickmapOwner,
    )]
    pub tickmap: AccountLoader<'info, Tickmap>,
    #[account(constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount, mint::token_program = token_x_program)]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount, mint::token_program = token_y_program)]
    pub token_y: InterfaceAccount<'info, Mint>,
    #[account(mut,
        constraint = account_x.mint == token_x.key() @ InvalidMint,
        constraint = &account_x.owner == owner.key @ InvalidOwner,
        token::token_program = token_x_program,
    )]
    pub account_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = account_y.mint == token_y.key() @ InvalidMint,
        constraint = &account_y.owner == owner.key @ InvalidOwner,
        token::token_program = token_y_program,
    )]
    pub account_y: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_x.mint == token_x.key() @ InvalidMint,
        constraint = &reserve_x.owner == program_authority.key @ InvalidOwner,
        constraint = reserve_x.key() == pool.load()?.token_x_reserve @ InvalidTokenAccount,
        token::token_program = token_x_program,
    )]
    pub reserve_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_y.mint == token_y.key() @ InvalidMint,
        constraint = &reserve_y.owner == program_authority.key @ InvalidOwner,
        constraint = reserve_y.key() == pool.load()?.token_y_reserve @ InvalidTokenAccount,
        token::token_program = token_y_program,
    )]
    pub reserve_y: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(constraint = &state.load()?.authority == program_authority.key @ InvalidAuthority)]
    /// CHECK: ignore
    pub program_authority: AccountInfo<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Context Params

| Name             | Type | Description                               |
| ---------------- | ---- | ----------------------------------------- |
| lower_tick_index | i32  | Index of the lower tick for the position. |
| upper_tick_index | i32  | Index of the upper tick for the position. |

#### Accounts

| Name              | Type                | Description                                                            |
| ----------------- | ------------------- | ---------------------------------------------------------------------- |
| state             | State               | Account of the protocols state.                                        |
| position_list     | PositionList        | Account of the position owner's position list.                         |
| position          | Position            | Position account that will be created.                                 |
| pool              | Pool                | Account of the pool on which the position should be created.           |
| lower_tick        | Tick                | Account of the Tick corresponding to lower tick index of the position. |
| upper_tick        | Tick                | Account of the Tick corresponding to upper tick index of the position. |
| tickmap           | Tickmap             | Tickmap account for the pool.                                          |
| owner             | Singer              | Account of the position list owner.                                    |
| signer            | Signer              | Account of transaction signer.                                         |
| token_x_program   | TokenInterface      | Token X associated program account.                                    |
| token_y_program   | TokenInterface      | Token Y associated program account.                                    |
| reserve_x         | TokenAccount        | Pool's token X associated token account.                               |
| reserve_y         | TokenAccount        | Pool's token Y associated token account.                               |
| account_x         | TokenAccount        | Users's token X associated token account.                              |
| account_y         | TokenAccount        | Users's token Y associated token account.                              |
| token_x           | Mint                | Token X mint account.                                                  |
| token_y           | Mint                | Token Y mint account.                                                  |
| program_authority | AccountInfo         | Protocol authority account.                                            |
| rent              | Sysvar<'info, Rent> | Rent account.                                                          |
| system_program    | AccountInfo         | System program account.                                                |

#### Errors

| Code                  | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `WrongTick`           | Tick account doesn't match the tick index on the position.                           |
| `InvalidTickmap`      | Tickmap doesn't match pools tickmap.                                                 |
| `InvalidTickmapOwner` | Tickmap owned by wrong account.                                                      |
| `InvalidTokenAccount` | Provided token mint is incorrect or reserve account doesn't match pool reserves.     |
| `InvalidMint`         | Provided token accounts mint doesn't match provided mint.                            |
| `InvalidOwner`        | Provided token account doesn't belong to position owner.                             |
| `InvalidAuthority`    | Provided authority is invalid or provided token account doesn't belong to authority. |
| `InvalidTokenProgram` | Invalid token program for provided token account.                                    |
| `InvalidTickIndex`    | Initial tick not divisible by spacing or outside of size limit or price limit.       |
| `PriceLimitReached`   | Slippage limit reached.                                                              |

## RemovePosition

Removes position specified by the index. Index is based on all user positions.

```rs
pub fn remove_position(
    ctx: Context<RemovePosition>,
    index: u32,
    lower_tick_index: i32,
    upper_tick_index: i32,
) -> Result<()> {
    ctx.accounts
        .handler(index, lower_tick_index, upper_tick_index)
}
```

#### Entrypoint Params

| Name             | Type | Description                               |
| ---------------- | ---- | ----------------------------------------- |
| index            | i32  | Index of the position to remove.          |
| lower_tick_index | i32  | Index of the lower tick for the position. |
| upper_tick_index | i32  | Index of the upper tick for the position. |

### Context

```rs
#[derive(Accounts)]
#[instruction(index: i32, lower_tick_index: i32, upper_tick_index: i32)]
pub struct RemovePosition<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(mut,
        seeds = [b"positionv1",
        owner.key().as_ref(),
        &index.to_le_bytes()],
        bump = removed_position.load()?.bump
    )]
    pub removed_position: AccountLoader<'info, Position>,
    #[account(mut,
        seeds = [b"positionlistv1", owner.key().as_ref()],
        bump = position_list.load()?.bump
    )]
    pub position_list: AccountLoader<'info, PositionList>,
    #[account(mut,
        close = payer,
        seeds = [b"positionv1",
        owner.key().as_ref(),
        &(position_list.load()?.head - 1).to_le_bytes()],
        bump = last_position.load()?.bump
    )]
    pub last_position: AccountLoader<'info, Position>,
    #[account(mut,
        seeds = [b"poolv1", token_x.key().as_ref(), token_y.key().as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(mut,
        constraint = tickmap.key() == pool.load()?.tickmap @ InvalidTickmap,
        constraint = tickmap.to_account_info().owner == __program_id @ InvalidTickmapOwner,
    )]
    pub tickmap: AccountLoader<'info, Tickmap>,
    #[account(mut,
        seeds = [b"tickv1", pool.key().as_ref(), &lower_tick_index.to_le_bytes()],
        bump = lower_tick.load()?.bump,
        constraint = lower_tick_index == removed_position.load()?.lower_tick_index @ WrongTick
    )]
    pub lower_tick: AccountLoader<'info, Tick>,
    #[account(mut,
        seeds = [b"tickv1", pool.key().as_ref(), &upper_tick_index.to_le_bytes()],
        bump = upper_tick.load()?.bump,
        constraint = upper_tick_index == removed_position.load()?.upper_tick_index @ WrongTick
    )]
    pub upper_tick: AccountLoader<'info, Tick>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub owner: Signer<'info>,
    #[account(constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount, mint::token_program = token_x_program)]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount, mint::token_program = token_y_program)]
    pub token_y: InterfaceAccount<'info, Mint>,
    #[account(mut,
        constraint = account_x.mint == token_x.key() @ InvalidMint,
        constraint = &account_x.owner == owner.key @ InvalidOwner,
        token::token_program = token_x_program
    )]
    pub account_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = account_y.mint == token_y.key() @ InvalidMint,
        constraint = &account_y.owner == owner.key @ InvalidOwner,
        token::token_program = token_y_program
    )]
    pub account_y: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_x.mint == token_x.key() @ InvalidMint,
        constraint = &reserve_x.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_x.key() == pool.load()?.token_x_reserve @ InvalidTokenAccount,
        token::token_program = token_x_program
    )]
    pub reserve_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_y.mint == token_y.key() @ InvalidMint,
        constraint = &reserve_y.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_y.key() == pool.load()?.token_y_reserve @ InvalidTokenAccount,
        token::token_program = token_y_program
    )]
    pub reserve_y: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(constraint = &state.load()?.authority == program_authority.key @ InvalidAuthority)]
    /// CHECK: Ignore
    pub program_authority: AccountInfo<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
}
```

#### Context Params

| Name             | Type | Description                                     |
| ---------------- | ---- | ----------------------------------------------- |
| index            | i32  | Index of the removed position on position list. |
| lower_tick_index | i32  | Index of the lower tick for the position.       |
| upper_tick_index | i32  | Index of the upper tick for the position.       |

#### Accounts

| Name              | Type           | Description                                                            |
| ----------------- | -------------- | ---------------------------------------------------------------------- |
| state             | State          | Account of the protocols state.                                        |
| position_list     | PositionList   | Account of the position owner's position list.                         |
| position          | Position       | Position account that will be removed.                                 |
| pool              | Pool           | Account of the pool from which the position should be removed.         |
| lower_tick        | Tick           | Account of the Tick corresponding to lower tick index of the position. |
| upper_tick        | Tick           | Account of the Tick corresponding to upper tick index of the position. |
| tickmap           | Tickmap        | Tickmap account for the pool.                                          |
| owner             | Singer         | Account of the position list owner.                                    |
| signer            | Signer         | Account of transaction signer.                                         |
| token_x_program   | TokenInterface | Token X associated program account.                                    |
| token_y_program   | TokenInterface | Token Y associated program account.                                    |
| reserve_x         | TokenAccount   | Pool's token X associated token account.                               |
| reserve_y         | TokenAccount   | Pool's token Y associated token account.                               |
| account_x         | TokenAccount   | Users's token X associated token account.                              |
| account_y         | TokenAccount   | Users's token Y associated token account.                              |
| token_x           | Mint           | Token X mint account.                                                  |
| token_y           | Mint           | Token Y mint account.                                                  |
| removed_position  | Position       | Position that will be removed.                                         |
| last_position     | Position       | Last position of the users list.                                       |
| program_authority | AccountInfo    | Protocol authority account.                                            |

#### Errors

| Code                  | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `WrongTick`           | Tick account doesn't match the tick index on the position.                           |
| `InvalidTickmap`      | Tickmap doesn't match pools tickmap.                                                 |
| `InvalidTickmapOwner` | Tickmap owned by wrong account.                                                      |
| `InvalidTokenAccount` | Provided token mint is incorrect or reserve account doesn't match pool reserves.     |
| `InvalidMint`         | Provided token accounts mint doesn't match provided mint.                            |
| `InvalidOwner`        | Provided token account doesn't belong to position owner.                             |
| `InvalidAuthority`    | Provided authority is invalid or provided token account doesn't belong to authority. |
| `InvalidTokenProgram` | Invalid token program for provided token account.                                    |
| `InvalidTickIndex`    | Initial tick not divisible by spacing or outside of size limit or price limit.       |

## Swap

Performs a swap w specified parameters.

```rs
pub fn swap<'info>(
    ctx: Context<'_, '_, 'info, 'info, Swap<'info>>,
    x_to_y: bool,
    amount: u64,
    by_amount_in: bool,
    sqrt_price_limit: u128,
) -> Result<()> {
    Swap::handler(ctx, x_to_y, amount, by_amount_in, sqrt_price_limit)
}
```

#### Entrypoint Params

| Name             | Type  | Description                                                                             |
| ---------------- | ----- | --------------------------------------------------------------------------------------- |
| x_to_y           | bool  | Specifies the direction of the swap.                                                    |
| amount           | u64   | Amount of tokens you want to receive or give.                                           |
| by_amount_in     | bool  | Indicates whether the entered amount represents the tokens you wish to receive or give. |
| sqrt_price_limit | Price | If the swap achieves this square root of the price, it will be canceled.                |

### Context

```rs
#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(mut,
        seeds = [b"poolv1", account_x.mint.as_ref(), account_y.mint.as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(mut,
        constraint = tickmap.to_account_info().key == &pool.load()?.tickmap @ InvalidTickmap,
        constraint = tickmap.to_account_info().owner == __program_id @ InvalidTickmapOwner
    )]
    pub tickmap: AccountLoader<'info, Tickmap>,
    #[account(constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount, mint::token_program = token_x_program)]
    pub token_x: Box<InterfaceAccount<'info, Mint>>,
    #[account(constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount, mint::token_program = token_y_program)]
    pub token_y: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,
        constraint = &account_x.owner == owner.key @ InvalidOwner,
        token::token_program = token_x_program,
    )]
    pub account_x: InterfaceAccount<'info, TokenAccount>,
    #[account(mut,
        constraint = &account_y.owner == owner.key @ InvalidOwner,
        token::token_program = token_y_program
    )]
    pub account_y: InterfaceAccount<'info, TokenAccount>,
    #[account(mut,
        constraint = reserve_x.mint == account_x.mint @ InvalidMint,
        constraint = &reserve_x.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_x.to_account_info().key == &pool.load()?.token_x_reserve @ InvalidTokenAccount,
        token::token_program = token_x_program
    )]
    pub reserve_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_y.mint == account_y.mint @ InvalidMint,
        constraint = &reserve_y.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_y.to_account_info().key == &pool.load()?.token_y_reserve @ InvalidTokenAccount,
        token::token_program = token_y_program
    )]
    pub reserve_y: Box<InterfaceAccount<'info, TokenAccount>>,
    pub owner: Signer<'info>,
    #[account(constraint = &state.load()?.authority == program_authority.key @ InvalidAuthority)]
    /// CHECK: Ignore
    pub program_authority: AccountInfo<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
}
```

#### Accounts

| Name               | Type               | Description                                                  |
| ------------------ | ------------------ | ------------------------------------------------------------ |
| state              | State              | Account of the protocols state.                              |
| pool               | Pool               | Account of the pool on which the position should be created. |
| tickmap            | Tickmap            | Tickmap account for the pool.                                |
| owner              | Signer             | Account of transaction signer.                               |
| token_x_program    | TokenInterface     | Token X associated program account.                          |
| token_y_program    | TokenInterface     | Token Y associated program account.                          |
| reserve_x          | TokenAccount       | Pool's token X associated token account.                     |
| reserve_y          | TokenAccount       | Pool's token Y associated token account.                     |
| account_x          | TokenAccount       | Users's token X associated token account.                    |
| account_y          | TokenAccount       | Users's token Y associated token account.                    |
| token_x            | Mint               | Token X mint account.                                        |
| token_y            | Mint               | Token Y mint account.                                        |
| program_authority  | AccountInfo        | Protocol authority account.                                  |
| remaining_accounts | Vec\<AccountInfo\> | Tick account addresses that could be used in the swap.       |

#### Errors

| Code                  | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `InvalidTickmap`      | Tickmap doesn't match pools tickmap.                                                 |
| `InvalidTickmapOwner` | Tickmap owned by wrong account.                                                      |
| `InvalidTokenAccount` | Provided token mint is incorrect or reserve account doesn't match pool reserves.     |
| `InvalidMint`         | Provided token accounts mint doesn't match provided mint.                            |
| `InvalidOwner`        | Provided token account doesn't belong to position owner.                             |
| `InvalidAuthority`    | Provided authority is invalid or provided token account doesn't belong to authority. |
| `InvalidTokenProgram` | Invalid token program for provided token account.                                    |
| `ZeroAmount`          | Input amount is 0.                                                                   |
| `NoGainSwap`          | Output amount is 0.                                                                  |
| `WrongLimit`          | Price limit is on the wrong side of the current price.                               |
| `PriceLimitReached`   | Price limit reached before acquiring the desired amount.                             |
| `LimitReached`        | Tick limit reached before acquiring the desired amount.                              |
| `TickNotFound`        | Tick account is missing from remaining accounts.                                     |

\*Additionally an error indicating that account wasn't found may appear if the tick accounts that would be used in the swap are missing from remaining accounts.

## TransferPositionOwnership

Transfers position from one account to another.

```rs
pub fn transfer_position_ownership(
    ctx: Context<TransferPositionOwnership>,
    index: u32,
) -> Result<()> {
    ctx.accounts.handler(index, ctx.bumps.new_position)
}
```

#### Entrypoint Params

| Name  | Type | Description                        |
| ----- | ---- | ---------------------------------- |
| index | u32  | Index of the transferred position. |

### Context

```rs
#[derive(Accounts)]
#[instruction( index: u32)]
pub struct TransferPositionOwnership<'info> {
    #[account(mut,
        seeds = [b"positionlistv1", owner.key().as_ref()],
        bump = owner_list.load()?.bump
    )]
    pub owner_list: AccountLoader<'info, PositionList>,
    #[account(mut,
        seeds = [b"positionlistv1", recipient.key().as_ref()],
        bump = recipient_list.load()?.bump,
        constraint = recipient_list.key() != owner_list.key() @ InvalidListOwner
    )]
    pub recipient_list: AccountLoader<'info, PositionList>,
    #[account(init,
        seeds = [b"positionv1",
        recipient.key().as_ref(),
        &recipient_list.load()?.head.to_le_bytes()],
        bump, payer = payer,
        space = Position::LEN
    )]
    pub new_position: AccountLoader<'info, Position>,
    #[account(mut,
        seeds = [b"positionv1",
        owner.key().as_ref(),
        &index.to_le_bytes()],
        bump = removed_position.load()?.bump,
    )]
    pub removed_position: AccountLoader<'info, Position>,
    #[account(mut,
        close = payer,
        seeds = [b"positionv1",
        owner.key().as_ref(),
        &(owner_list.load()?.head - 1).to_le_bytes()],
        bump = last_position.load()?.bump
    )]
    pub last_position: AccountLoader<'info, Position>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub owner: Signer<'info>,
    /// CHECK: Ignore
    pub recipient: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: Ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Accounts

| Name             | Type                | Description                                                                                              |
| ---------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| owner_list       | PositionList        | Account of transferred position owners position list.                                                    |
| recipient_list   | PositionList        | Account of position recipients position list.                                                            |
| owner            | Signer              | Account of transferred position owner.                                                                   |
| payer            | Signer              | Account of transaction signer.                                                                           |
| removed_position | Position            | Transferred position.                                                                                    |
| new_position     | Position            | Empty position account the address which should match new position address for recipients position list. |
| rent             | Sysvar<'info, Rent> | Rent account.                                                                                            |
| system_program   | AccountInfo         | System program account.                                                                                  |

#### Errors

| Code               | Description                                         |
| ------------------ | --------------------------------------------------- |
| `InvalidListOwner` | Position list doesn't belong to the position owner. |

## UpdateSecondsPerLiquidity

Updates seconds per liquidity parameter for a position (used with farms).

```rs
pub fn update_seconds_per_liquidity(
    ctx: Context<UpdateSecondsPerLiquidity>,
    _lower_tick_index: i32,
    _upper_tick_index: i32,
    _index: i32,
) -> Result<()> {
    ctx.accounts.handler()
}
```

#### Entrypoint Params

| Name             | Type | Description                                     |
| ---------------- | ---- | ----------------------------------------------- |
| index            | i32  | Index of the updated position on position list. |
| lower_tick_index | i32  | Index of the lower tick for the position.       |
| upper_tick_index | i32  | Index of the upper tick for the position.       |

### Context

```rs
#[derive(Accounts)]
#[instruction(lower_tick_index: i32, upper_tick_index: i32, index: i32)]
pub struct UpdateSecondsPerLiquidity<'info> {
    #[account(mut,
        seeds = [b"poolv1", token_x.key().as_ref(), token_y.key().as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(
        seeds = [b"tickv1", pool.key().as_ref(), &lower_tick_index.to_le_bytes()],
        bump = lower_tick.load()?.bump,
        constraint = lower_tick_index == position.load()?.lower_tick_index @ WrongTick
    )]
    pub lower_tick: AccountLoader<'info, Tick>,
    #[account(
        seeds = [b"tickv1", pool.key().as_ref(), &upper_tick_index.to_le_bytes()],
        bump = upper_tick.load()?.bump,
        constraint = upper_tick_index == position.load()?.upper_tick_index @ WrongTick
    )]
    pub upper_tick: AccountLoader<'info, Tick>,
    #[account(mut,
        seeds = [b"positionv1",
        owner.key().as_ref(),
        &index.to_le_bytes()],
        bump = position.load()?.bump
    )]
    pub position: AccountLoader<'info, Position>,
    #[account(constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount)]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount)]
    pub token_y: InterfaceAccount<'info, Mint>,
    /// CHECK: Ignore
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: Ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Context Params

| Name             | Type | Description                                     |
| ---------------- | ---- | ----------------------------------------------- |
| index            | i32  | Index of the updated position on position list. |
| lower_tick_index | i32  | Index of the lower tick for the position.       |
| upper_tick_index | i32  | Index of the upper tick for the position.       |

#### Accounts

| Name           | Type                | Description                          |
| -------------- | ------------------- | ------------------------------------ |
| pool           | Pool                | Pool on which the position exists.   |
| lower_tick     | Tick                | Lower tick account for the position. |
| upper_tick     | Tick                | Upper tick account for the position. |
| position       | Position            | Position to update.                  |
| token_x        | Mint                | Token X's mint account.              |
| token_y        | Mint                | Token Y's mint account.              |
| owner          | AccountInfo         | Account of the position owner.       |
| signer         | Signer              | Account of the signer.               |
| rent           | Sysvar<'info, Rent> | Rent account.                        |
| system_program | AccountInfo         | System program account.              |

#### Errors

| Code                  | Description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| `WrongTick`           | Tick account doesn't match the tick index on the position.                       |
| `InvalidTokenAccount` | Provided token mint is incorrect or reserve account doesn't match pool reserves. |
| `InvalidTickIndex`    | Initial tick not divisible by spacing or outside of size limit or price limit.   |
| `InvalidTokenProgram` | Invalid token program for provided token account.                                |

## WithdrawProtocolFee

```rs
#[access_control(receiver(&ctx.accounts.pool, &ctx.accounts.authority))]
pub fn withdraw_protocol_fee(ctx: Context<WithdrawProtocolFee>) -> Result<()> {
    ctx.accounts.handler()
}
```

### Context

```rs
#[derive(Accounts)]
pub struct WithdrawProtocolFee<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(mut,
        seeds = [b"poolv1", token_x.key().as_ref(), token_y.key().as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount, mint::token_program = token_x_program)]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount, mint::token_program = token_y_program)]
    pub token_y: InterfaceAccount<'info, Mint>,
    #[account(mut,
        constraint = account_x.mint == token_x.key() @ InvalidMint,
        token::token_program = token_x_program,
    )]
    pub account_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = account_y.mint == token_y.key() @ InvalidMint,
        token::token_program = token_y_program,
    )]
    pub account_y: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_x.mint == token_x.key() @ InvalidMint,
        constraint = &reserve_x.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_x.key() == pool.load()?.token_x_reserve @ InvalidTokenAccount,
        token::token_program = token_x_program
    )]
    pub reserve_x: InterfaceAccount<'info, TokenAccount>,
    #[account(mut,
        constraint = reserve_y.mint == token_y.key() @ InvalidMint,
        constraint = &reserve_y.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_y.key() == pool.load()?.token_y_reserve @ InvalidTokenAccount,
        token::token_program = token_y_program,
    )]
    pub reserve_y: InterfaceAccount<'info, TokenAccount>,
    #[account(constraint = &pool.load()?.fee_receiver == authority.key @ InvalidAuthority)]
    pub authority: Signer<'info>,
    #[account(constraint = &state.load()?.authority == program_authority.key @ InvalidAuthority)]
    /// CHECK: Ignore
    pub program_authority: AccountInfo<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
}
```

#### Accounts

| Name              | Type           | Description                                               |
| ----------------- | -------------- | --------------------------------------------------------- |
| state             | State          | Account of the protocols state.                           |
| pool              | Pool           | Account of the pool from which the fee will be withdrawn. |
| token_x_program   | TokenInterface | Token X associated program account.                       |
| token_y_program   | TokenInterface | Token Y associated program account.                       |
| reserve_x         | TokenAccount   | Pool's token X associated token account.                  |
| reserve_y         | TokenAccount   | Pool's token Y associated token account.                  |
| account_x         | TokenAccount   | Users's token X associated token account.                 |
| account_y         | TokenAccount   | Users's token Y associated token account.                 |
| token_x           | Mint           | Token X mint account.                                     |
| token_y           | Mint           | Token Y mint account.                                     |
| authority         | Signer         | Account of transaction signer, must be admin.             |
| program_authority | AccountInfo    | Protocol authority account.                               |

#### Errors

| Code                  | Description                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `InvalidTokenAccount` | Provided token mint is incorrect or reserve account doesn't match pool reserves.                           |
| `InvalidMint`         | Provided token accounts mint doesn't match provided mint.                                                  |
| `InvalidOwner`        | Provided token account doesn't belong to position owner.                                                   |
| `InvalidAuthority`    | Provided authority or withdraw authority is invalid or provided token account doesn't belong to authority. |
| `InvalidTickIndex`    | Initial tick not divisible by spacing or outside of size limit or price limit.                             |
| `InvalidTokenProgram` | Invalid token program for provided token account.                                                          |

## ClaimFee

Claims fee from the specified position.

```rs
pub fn claim_fee(
    ctx: Context<ClaimFee>,
    _index: u32,
    _lower_tick_index: i32,
    _upper_tick_index: i32,
) -> Result<()> {
    ctx.accounts.handler()
}
```

#### Entrypoint Params

| Name             | Type | Description                                               |
| ---------------- | ---- | --------------------------------------------------------- |
| index            | i32  | Index of the position from which the fee will be claimed. |
| lower_tick_index | i32  | Index of the lower tick for the position.                 |
| upper_tick_index | i32  | Index of the upper tick for the position.                 |

### Context

```rs
#[derive(Accounts)]
#[instruction(index: u32, lower_tick_index: i32, upper_tick_index: i32)]
pub struct ClaimFee<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(mut,
        seeds = [b"poolv1", token_x.key().as_ref(), token_y.key().as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(mut,
        seeds = [b"positionv1",
        owner.key().as_ref(),
        &index.to_le_bytes()],
        bump = position.load()?.bump
    )]
    pub position: AccountLoader<'info, Position>,
    #[account(mut,
        seeds = [b"tickv1", pool.key().as_ref(), &lower_tick_index.to_le_bytes()],
        bump = lower_tick.load()?.bump,
        constraint = lower_tick_index == position.load()?.lower_tick_index @ WrongTick
    )]
    pub lower_tick: AccountLoader<'info, Tick>,
    #[account(mut,
        seeds = [b"tickv1", pool.key().as_ref(), &upper_tick_index.to_le_bytes()],
        bump = upper_tick.load()?.bump,
        constraint = upper_tick_index == position.load()?.upper_tick_index @ WrongTick
    )]
    pub upper_tick: AccountLoader<'info, Tick>,
    pub owner: Signer<'info>,
    #[account(constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount, mint::token_program = token_x_program)]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount, mint::token_program = token_y_program)]
    pub token_y: InterfaceAccount<'info, Mint>,
    #[account(mut,
        constraint = account_x.mint == token_x.key() @ InvalidMint,
        constraint = &account_x.owner == owner.key @ InvalidOwner,
        token::token_program = token_x_program
    )]
    pub account_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = account_y.mint == token_y.key() @ InvalidMint,
        constraint = &account_y.owner == owner.key @ InvalidOwner,
        token::token_program = token_y_program
    )]
    pub account_y: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_x.mint == token_x.key() @ InvalidMint,
        constraint = &reserve_x.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_x.key() == pool.load()?.token_x_reserve @ InvalidTokenAccount,
        token::token_program = token_x_program,
    )]
    pub reserve_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,
        constraint = reserve_y.mint == token_y.key() @ InvalidMint,
        constraint = &reserve_y.owner == program_authority.key @ InvalidAuthority,
        constraint = reserve_y.key() == pool.load()?.token_y_reserve @ InvalidTokenAccount,
        token::token_program = token_y_program,
    )]
    pub reserve_y: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(constraint = &state.load()?.authority == program_authority.key @ InvalidAuthority)]
    /// CHECK: ignore
    pub program_authority: AccountInfo<'info>,

    #[account(constraint = token_x_program.key() == token::ID || token_x_program.key() == token_2022::ID)]
    pub token_x_program: Interface<'info, TokenInterface>,
    #[account(constraint = token_y_program.key() == token::ID || token_y_program.key() == token_2022::ID)]
    pub token_y_program: Interface<'info, TokenInterface>,
}
```

#### Context Params

| Name             | Type | Description                                               |
| ---------------- | ---- | --------------------------------------------------------- |
| index            | i32  | Index of the position from which the fee will be claimed. |
| lower_tick_index | i32  | Index of the lower tick for the position.                 |
| upper_tick_index | i32  | Index of the upper tick for the position.                 |

#### Accounts

| Name              | Type           | Description                                                |
| ----------------- | -------------- | ---------------------------------------------------------- |
| state             | State          | Account of the protocols state.                            |
| pool              | Pool           | Account of the pool on which the position exists.          |
| position          | Position       | Position to claim fee from.                                |
| lower_tick        | Tick           | Lower tick account for the position.                       |
| upper_tick        | Tick           | Upper tick account for the position.                       |
| token_x_program   | TokenInterface | Token X associated program account.                        |
| token_y_program   | TokenInterface | Token Y associated program account.                        |
| reserve_x         | TokenAccount   | Pool's token X associated token account.                   |
| reserve_y         | TokenAccount   | Pool's token Y associated token account.                   |
| account_x         | TokenAccount   | Users's token X associated token account.                  |
| account_y         | TokenAccount   | Users's token Y associated token account.                  |
| token_x           | Mint           | Token X mint account.                                      |
| token_y           | Mint           | Token Y mint account.                                      |
| owner             | Signer         | Account of transaction signer, must be the position owner. |
| program_authority | AccountInfo    | Protocol authority account.                                |

#### Errors

| Code                  | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `WrongTick`           | Tick account doesn't match the tick index on the position.                           |
| `InvalidTokenAccount` | Provided token mint is incorrect or reserve account doesn't match pool reserves.     |
| `InvalidMint`         | Provided token accounts mint doesn't match provided mint.                            |
| `InvalidOwner`        | Provided token account doesn't belong to position owner.                             |
| `InvalidAuthority`    | Provided authority is invalid or provided token account doesn't belong to authority. |
| `InvalidTickIndex`    | Initial tick not divisible by spacing or outside of size limit or price limit.       |
| `InvalidTokenProgram` | Invalid token program for provided token account.                                    |

## ChangeFeeReceiver

Changes the receiver of the protocol fee for a pool. Admin only.

```rs
#[access_control(admin(&ctx.accounts.state, &ctx.accounts.admin))]
pub fn change_fee_receiver(ctx: Context<ChangeFeeReceiver>) -> Result<()> {
    ctx.accounts.handler()
}
```

### Context

```rs
#[derive(Accounts)]
pub struct ChangeFeeReceiver<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump)]
    pub state: AccountLoader<'info, State>,
    #[account(mut,
        seeds = [b"poolv1", token_x.to_account_info().key.as_ref(), token_y.to_account_info().key.as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(constraint = token_x.to_account_info().key == &pool.load()?.token_x @ InvalidTokenAccount) ]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(constraint = token_y.to_account_info().key == &pool.load()?.token_y @ InvalidTokenAccount)]
    pub token_y: InterfaceAccount<'info, Mint>,
    #[account(constraint = &state.load()?.admin == admin.key @ InvalidAdmin)]
    pub admin: Signer<'info>,
    /// CHECK: Ignore
    pub fee_receiver: AccountInfo<'info>,
}
```

#### Accounts

| Name         | Type        | Description                                                                |
| ------------ | ----------- | -------------------------------------------------------------------------- |
| state        | State       | Account of the protocols state.                                            |
| pool         | Pool        | Account of the pool on which the fee receiver will be changed.             |
| token_x      | Mint        | Token X mint account.                                                      |
| token_y      | Mint        | Token Y mint account.                                                      |
| admin        | Signer      | Account of transaction signer, must be admin.                              |
| fee_receiver | AccountInfo | Account that will be authorized to receive the protocol fee from the pool. |

#### Errors

| Code                  | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `InvalidTokenAccount` | Provided token account does not belong to the expected token. |
| `InvalidAdmin`        | Provided admin is invalid.                                    |

## ChangeProtocolFee

Changes the protocol fee for a pool. Admin only.

```rs
    #[access_control(receiver(&ctx.accounts.pool, &ctx.accounts.admin))]
    pub fn change_protocol_fee(
        ctx: Context<ChangeProtocolFee>,
        protocol_fee: FixedPoint,
    ) -> Result<()> {
        ctx.accounts.handler(protocol_fee)
    }
```

#### Entrypoint Params

| Name         | Type       | Description                    |
| ------------ | ---------- | ------------------------------ |
| protocol_fee | FixedPoint | New value of the protocol fee. |

### Context

```rs
#[derive(Accounts)]
pub struct ChangeProtocolFee<'info> {
    #[account(seeds = [b"statev1".as_ref()], bump = state.load()?.bump )]
    pub state: AccountLoader<'info, State>,
    #[account(mut,
        seeds = [b"poolv1", token_x.to_account_info().key.as_ref(), token_y.to_account_info().key.as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(constraint = token_x.to_account_info().key == &pool.load()?.token_x @ InvalidTokenAccount) ]
    pub token_x: InterfaceAccount<'info, Mint>,
    #[account(constraint = token_y.to_account_info().key == &pool.load()?.token_y @ InvalidTokenAccount)]
    pub token_y: InterfaceAccount<'info, Mint>,
    #[account(constraint = &state.load()?.admin == admin.key @ InvalidAdmin)]
    pub admin: Signer<'info>,
    #[account(constraint = &state.load()?.authority == program_authority.key @ InvalidAuthority)]
    /// CHECK: Ignore
    pub program_authority: AccountInfo<'info>,
}
```

#### Accounts

| Name              | Type        | Description                                                 |
| ----------------- | ----------- | ----------------------------------------------------------- |
| state             | State       | Account of the protocols state.                             |
| pool              | Pool        | Account of the pool for which the protocol fee will change. |
| token_x           | Mint        | Token X mint account.                                       |
| token_y           | Mint        | Token Y mint account.                                       |
| admin             | Signer      | Account of transaction signer, must be admin.               |
| program_authority | AccountInfo | Program authority account.                                  |

#### Errors

| Code                  | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `InvalidTokenAccount` | Provided token account does not belong to the expected token. |
| `InvalidAuthority`    | Provided authority is invalid.                                |
| `InvalidAdmin`        | Provided admin is invalid.                                    |
| `InvalidProtocolFee`  | Protocol fee is outside acceptable range (10^12 - 0).         |

## InitializeOracle

Initialize oracle for the pool. Oracles don't work yet.

```rs
pub fn initialize_oracle(ctx: Context<InitializeOracle>) -> Result<()> {
    ctx.accounts.handler()
}
```

### Context

```rs
#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(mut,
        seeds = [b"poolv1", token_x.key().as_ref(), token_y.key().as_ref(), &pool.load()?.fee.v.to_le_bytes(), &pool.load()?.tick_spacing.to_le_bytes()],
        bump = pool.load()?.bump
    )]
    pub pool: AccountLoader<'info, Pool>,
    #[account(zero)]
    pub oracle: AccountLoader<'info, Oracle>,
    #[account(constraint = token_x.key() == pool.load()?.token_x @ InvalidTokenAccount)]
    pub token_x: Box<InterfaceAccount<'info, Mint>>,
    #[account(constraint = token_y.key() == pool.load()?.token_y @ InvalidTokenAccount)]
    pub token_y: Box<InterfaceAccount<'info, Mint>>,
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    #[account(address = system_program::ID)]
    /// CHECK: Ignore
    pub system_program: AccountInfo<'info>,
}
```

#### Accounts

| Name           | Type                | Description                                                   |
| -------------- | ------------------- | ------------------------------------------------------------- |
| pool           | Pool                | Account of the pool for which the oracle will be initialized. |
| oracle         | Oracle              | Oracle that will be initialized.                              |
| token_x        | Mint                | Token X mint account.                                         |
| token_y        | Mint                | Token Y mint account.                                         |
| payer          | Signer              | Account of transaction signer.                                |
| rent           | Sysvar<'info, Rent> | System rent account.                                          |
| system_program | AccountInfo         | Solana system program.                                        |

#### Errors

| Code                       | Description                                         |
| -------------------------- | --------------------------------------------------- |
| `OracleAlreadyInitialized` | Oracle was already initialized.                     |
| `InvalidTokenAccount`      | Mint account address doesn't match the pool tokens. |
