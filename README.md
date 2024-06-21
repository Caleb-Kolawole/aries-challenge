# CodingChallenge Component

## Overview
The `CodingChallenge` component generates a risk & reward graph for options strategies. It accepts an array of options contracts and calculates the profit/loss for different underlying prices at expiry.

## Props

### `optionsData` (Array)
An array of objects representing the options contracts. Each object should contain the following properties:
- `strike_price` (Number): The strike price of the option.
- `type` (String): The type of the option, either "Call" or "Put".
- `bid` (Number): The bid price of the option.
- `ask` (Number): The ask price of the option.
- `long_short` (String): Indicates if the option is long or short.
- `expiration_date` (String): The expiration date of the option in ISO format.

## Methods

### `calculateRiskReward()`
Calculates the risk and reward for the given options contracts and updates the graph.

### `calculateProfit(price)`
Computes the total profit for a given price of the underlying asset.

### `calculateOptionProfit(option, price)`
Computes the profit for a single option contract.

### `findBreakEvPoints(profits, underlyingPrices)`
Identifies the break-even points where profit transitions from negative to positive or vice versa.

### `renderGraph(underlyingPrices, profits)`
Renders the profit/loss graph using Chart.js.

## Usage Example

```jsx
import React from 'react';
import CodingChallenge from './CodingChallenge';

const sampleData = [
  {
    "strike_price": 100,
    "type": "Call",
    "bid": 10.05,
    "ask": 12.04,
    "long_short": "long",
    "expiration_date": "2025-12-17T00:00:00Z"
  },
  {
    "strike_price": 102.50,
    "type": "Call",
    "bid": 12.10,
    "ask": 14,
    "long_short": "long",
    "expiration_date": "2025-12-17T00:00:00Z"
  },
  {
    "strike_price": 103,
    "type": "Put",
    "bid": 14,
    "ask": 15.50,
    "long_short": "short",
    "expiration_date": "2025-12-17T00:00:00Z"
  },
  {
    "strike_price": 105,
    "type": "Put",
    "bid": 16,
    "ask": 18,
    "long_short": "long",
    "expiration_date": "2025-12-17T00:00:00Z"
  }
];

const App = () => (
  <div>
    <CodingChallenge optionsData={sampleData} />
  </div>
);

export default App;


### For any questions or suggestions, please contact me kolawolebolarinwa771@gmail.com
