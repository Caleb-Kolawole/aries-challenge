import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

const CodingChallenge = ({ optionsData }) => {
  const [steps, setSteps] = useState(100);
  const [maxP, setMaxP] = useState(0);
  const [maxL, setMaxL] = useState(0);
  const [breakEvPoints, setBreakEvPoints] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    Chart.register(annotationPlugin);
    calculateRiskReward();
  }, [optionsData, steps]);

  const calculateProfitLoss = (price, option) => {
    const { strike_price, type, bid, ask, long_short } = option;
    const optionPrice = (bid + ask) / 2;
    let profitLoss = 0;

    if (type === 'Call') {
      if (long_short === 'long') {
        profitLoss = Math.max(0, price - strike_price) - optionPrice;
      } else {
        profitLoss = optionPrice - Math.max(0, price - strike_price);
      }
    } else if (type === 'Put') {
      if (long_short === 'long') {
        profitLoss = Math.max(0, strike_price - price) - optionPrice;
      } else {
        profitLoss = optionPrice - Math.max(0, strike_price - price);
      }
    }

    return profitLoss;
  };

  const calculateTotalProfitLoss = (price) => {
    return optionsData.reduce((total, option) => total + calculateProfitLoss(price, option), 0);
  };

  const calculateRiskReward = () => {
    const underlyingPrices = Array.from({ length: steps }, (_, i) => i * (200 / steps));
    const profits = underlyingPrices.map(price => calculateTotalProfitLoss(price));

    setMaxP(Math.max(...profits));
    setMaxL(Math.min(...profits));
    setBreakEvPoints(findBreakEvPoints(profits, underlyingPrices));

    renderGraph(underlyingPrices, profits);
  };

  const findBreakEvPoints = (profits, underlyingPrices) => {
    const breakEvPoints = [];
    for (let i = 1; i < profits.length; i++) {
      if ((profits[i - 1] < 0 && profits[i] >= 0) || (profits[i - 1] >= 0 && profits[i] < 0)) {
        breakEvPoints.push(underlyingPrices[i]);
      }
    }
    return breakEvPoints;
  };

  const renderGraph = (underlyingPrices, profits) => {
    const ctx = chartRef.current.getContext('2d');
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    const strikePrices = optionsData.map(option => ({
      'price': option.strike_price,
      'type': option.type
    }));

    const annotations = strikePrices.map(price => ({
      type: 'line',
      mode: 'vertical',
      scaleID: 'x',
      value: price.price,
      borderColor: price.type === "Call" ? '#ed6868' : '#191973',
      borderWidth: 1
    }));

    chartRef.current.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: underlyingPrices,
        datasets: [
          {
            label: 'Profit/Loss',
            data: profits,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Underlying Price at Expiry',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            ticks: {
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Profit/Loss',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            ticks: {
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          annotation: {
            annotations
          }
        }
      }
    });
  };

  return (
    <div className="coding-challenge">
      <h1 className="title">Options Profit Calculator</h1>

      <div className="control-panel">
        <label htmlFor="steps" className="label">Number of Steps:</label>
        <input
          id="steps"
          type="number"
          value={steps}
          onChange={(e) => setSteps(Number(e.target.value))}
          min="10"
          max="100"
          step="10"
          className="input"
        />
      </div>

      <div className="legends-container">
        <table>
          <tbody>
            <tr>
              <td className="legend legend-1"></td>
              <td className="legend-name">Profit/Loss</td>
              <td className="legend legend-2"></td>
              <td className="legend-name">Call Strike</td>
              <td className="legend legend-3"></td>
              <td className="legend-name">Put Strike</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="chart-container">
        <canvas ref={chartRef} width="800" height="400"></canvas>
      </div>

      <div className="results">
        <h2 className="subtitle">Results</h2>
        <p><strong>Max Profit:</strong> {maxP}</p>
        <p><strong>Max Loss:</strong> {maxL}</p>
        <p><strong>Break-even Points:</strong> {breakEvPoints.join(', ')}</p>
      </div>
    </div>
  );
};

export default CodingChallenge;
