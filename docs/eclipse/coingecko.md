---
title: Coingecko API

slug: /eclipse/coingecko
---

## URL

https://stats.invariant.app/eclipse/

## Endpoints

### GET /tickers

Returns current price information, current TVL for a pool, and 24h volume information.
Pools are returned in a json array of objects containing the following keys:

| Name             | Data Type |
| ---------------- | --------- |
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
    "base_volume": "0.010254074976695025",
    "target_volume": "0.17442814552681934",
    "liquidity_in_usd": "6030.953440247",
    "ticker_id": "So11111111111111111111111111111111111111112_BeRUj3h7BqkbdfFU7FBNYbodgf8GCHodzKvF9aVjNNfL",
    "last_price": "16.835173499182183639660783",
    "pool_id": "4x7P9KXWm9QdueFFvoVY5Sd8B4YKsGUBB7xQ3iDQQQoa",
    "base_currency": "So11111111111111111111111111111111111111112",
    "target_currency": "BeRUj3h7BqkbdfFU7FBNYbodgf8GCHodzKvF9aVjNNfL"
  },
  {
    "base_volume": "2.3765335201119075",
    "target_volume": "9162.543314984978",
    "liquidity_in_usd": "13283.159643800002",
    "ticker_id": "So11111111111111111111111111111111111111112_AKEWE7Bgh87GPp171b4cJPSSZfmZwQ3KaqYqXoKLNAEE",
    "last_price": "3853.774935694002447515482535",
    "pool_id": "5WFyCtryxTK3v7LMS1169m1Vz1xUauxJYHfRyMh8uhoH",
    "base_currency": "So11111111111111111111111111111111111111112",
    "target_currency": "AKEWE7Bgh87GPp171b4cJPSSZfmZwQ3KaqYqXoKLNAEE"
  }
]
```
