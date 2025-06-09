---
title: API
slug: /invariant_points/api
---

## Getting Specific Positions from the Leaderboard

### By total points

- [https://api.invariant.app/api/eclipse-mainnet/total/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3?offset=20&size=5](https://api.invariant.app/api/eclipse-mainnet/total/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3?offset=20&size=5)

This endpoint retrieves information about users ranked from **21 to 25**, along with one specific user who might be outside the declared range. In this case, the user has the wallet address **EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3**.

### By liquidity points

- [https://api.invariant.app/api/eclipse-mainnet/lp/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3?offset=20&size=5](https://api.invariant.app/api/eclipse-mainnet/lp/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3?offset=20&size=5)

### By swap points

- [https://api.invariant.app/api/eclipse-mainnet/swaps/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3?offset=20&size=5](https://api.invariant.app/api/eclipse-mainnet/swaps/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3?offset=20&size=5)

#### Parameter Details

URL structure: `https://api.invariant.app/api/eclipse-mainnet/<points_type>/<user_address>?<offset>&<size>`

- points_type:
  Use one of the following to indicate which leaderboard you are querying:

  - `total` — for overall api.
  - `swaps` — for points earned through swaps.
  - `lp` — for liquidity provider api.

- user_address:
  The wallet address of the user. When provided, the endpoint will ensure that this user's data is included in the response even if it lies outside the specified pagination range.

- offset:
  A query parameter used for pagination. It specifies how many entries to skip. For example, offset=20 means the response should start with the 21st entry.

- size:
  A query parameter used for pagination. It defines the number of leaderboard entries to return in the response.

## Getting the Entire Leaderboard

- [https://api.invariant.app/api/eclipse-mainnet/total/null](https://api.invariant.app/api/eclipse-mainnet/total/null)

This endpoint returns the **entire leaderboard**.

## Query specific address

- [https://api.invariant.app/api/eclipse-mainnet/total/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3](https://api.invariant.app/api/eclipse-mainnet/total/EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3)

This endpoint provides the points information for a specific wallet address **EzTR6Dh3ZzKNoXtfCa3AbqWeoATT6gD9zoiEK7waBGW3** under the `user` key and rest of the entries in the leaderboard.
