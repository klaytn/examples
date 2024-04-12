# example-subgraph

Example Subgraph for Orakl's VRFCoordinator contract running on Cypress.

- tracks `n_transfers`, the number of transfers made by each address

This example uses the following contract details:

- Address: [0x569A8e0e23e8f338752B568b721075574426f693](https://klaytnfinder.io/account/0x569A8e0e23e8f338752B568b721075574426f693)
- Start Block: 150554742

## Table of Contents

- [Prerequisites](#prerequisites)
- [Run this example](#run-this-example)
- [Subgraph your own contract](#subgraph-your-own-contract)

## Prerequisites

- [pnpm](https://pnpm.io/)
- Running [Graph Node](https://github.com/graphprotocol/graph-node)
- Running [IPFS Node](https://github.com/ipfs/kubo)

## Run this example

1. Install dependencies

```
pnpm i
```

2. Generate typings

```
pnpm run codegen
```

3. Build the subgraph

```
pnpm run build
```

Rerun when `src/*` changes

4. Create a subgraph on the graph node

```
export GRAPH_ADMIN_URL=<Graph Node Admin URL>
pnpm run create
```

5. Deploy the subgraph

```
export GRAPH_ADMIN_URL=<Graph Node Admin URL>
export IPFS_ADMIN_URL=<IPFS Node Admin URL>
pnpm run deploy
```

> Note: The Graph Node must be running on Cypress mainnet.

6. Query the subgraph

A GraphQL UI & API should be exposed at **&lt;Graph Node Query URL&gt;/subgraphs/name/example-subgraph**

> :warning: **QUERY** URL, not Admin URL!

## Subgraph your own contract

1. Deploy your own ERC20 contract

Paste the ABI JSON into [abis/&lt;Contract Name&gt;.json](abis/)

Edit [subgraph.yaml](subgraph.yaml):

- `dataSources > 0`:
  - `abis > 0`:
    - `name`: &lt;ContractName&gt;
    - `file`: ./abis/&lt;ContractName&gt;.json`
  - `source`:
    - `address`: &lt;Contract Address&gt;
    - `abi`: &lt;ContractName&gt;
    - `startBlock`: &lt;Start Block&gt;

2. Define Event Handlers under [subgraph.yaml `dataSources > 0 > eventHandlers`](subgraph.yaml)

    - `event` should exactly match event signatures in the contract ABI.

E.g., to index the Transfer event, if the ABI is

```    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer"
```

... the event signature should be `Transfer(indexed address,indexed address,uint256)`

3. Define the GraphQL schema in [schema.graphql](schema.graphql)
    - Entities & fields you want to track

List queryable entities under [subgraph.yaml `dataSources > 0 > entities`](subgraph.yaml)

4. Generate typings
    - [src/mappings.ts](src/mappings.ts) is not necessary for this step & previous steps

```
pnpm run codegen
```

> Rerun when [abis/&lt;Contract Name&gt;](abis/), [schema.graphql](schema.graphql) or [subgraph.yaml](subgraph.yaml) changes

5. Write & export handler functions in [src/mappings.ts](src/mappings.ts)

6. Build the subgraph

```
pnpm run build
```

> Rerun when [src/*](src/) changes

7. Create a subgraph on the graph node

```
export GRAPH_ADMIN_URL=<Graph Node Admin URL>
pnpm run create
```

8. Deploy the subgraph

```
export GRAPH_ADMIN_URL=<Graph Node Admin URL>
export IPFS_ADMIN_URL=<IPFS Node Admin URL>
pnpm run deploy
```

> Note: The Graph Node must be running on the same network as the deployed contract.

9. Query the subgraph

A GraphQL UI & API should be exposed at **&lt;Graph Node Query URL&gt;/subgraphs/name/&lt;Subgraph Name&gt;**

> :warning: **QUERY** URL, not Admin URL!
