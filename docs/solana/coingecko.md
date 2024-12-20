---
title: Coingecko API

slug: /solana/coingecko
---
## URL
https://stats.invariant.app/solana/

## Endpoints
### GET /tickers_sorted
Returns current price information, current TVL for a pool, and 24h volume information. 
Pools are returned in a json array of objects containing the following keys:

| Name             | Data Type |
|------------------|-----------|
| base_volume      | Decimal   |
| target_volume    | String    |
| liquidity_in_usd | Decimal   |
| ticker_id        | string    |
| last_price       | Decimal   |
| pool_id          | string    |
| base_currency    | string    |
| target_currency  | string    |

#### Example Response
```json
[
    {
        "base_volume": "289575.000000",
        "target_volume": "1319.106000000",
        "liquidity_in_usd": "2437.006098922",
        "ticker_id": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v_So11111111111111111111111111111111111111112",
        "last_price": "0.004645201427437602280431",
        "pool_id": "2SgUGxYDczrB6wUzXHPJH65pNhWkEzNMEx3km4xTYUTC",
        "base_currency": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "target_currency": "So11111111111111111111111111111111111111112"
    },
    {
        "base_volume": "329737.000000",
        "target_volume": "1527.087000000",
        "liquidity_in_usd": "2023.5374749369998",
        "ticker_id": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v_So11111111111111111111111111111111111111112",
        "last_price": "0.004644105281823544545005",
        "pool_id": "Aoa3FhXZ6jgFzMHBtG2Z7ekdsCt9XCcn7hk95HA5FoB",
        "base_currency": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "target_currency": "So11111111111111111111111111111111111111112"
    }
]
```