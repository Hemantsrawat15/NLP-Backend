import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const MaritimeRouteDashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Ship and route constraints
  const [constraints, setConstraints] = useState({
    cargoCapacity: { value: 5000, min: 1000, max: 10000 }, // TEU
    fuelCapacity: { value: 2000, min: 500, max: 4000 },    // tons
    maxSpeed: { value: 22, min: 12, max: 30 },             // knots
    weatherSeverity: { value: 3, min: 1, max: 7 },         // 1-7 scale
    portStops: { value: 8, min: 4, max: 12 }               // number of ports
  });
  
  // Sample route waypoints
  const routePoints = [
    'Shanghai',
    'Singapore',
    'Colombo',
    'Suez Canal',
    'Gibraltar',
    'Rotterdam',
    'Hamburg',
    'Felixstowe',
    'Le Havre',
    'Barcelona',
    'Genoa',
    'Piraeus'
  ];
  
  // Generate multi-constraint route data
  const generateRouteData = () => {
    const selectedPorts = routePoints.slice(0, constraints.portStops.value);
    
    // Initialize data arrays for each constraint
    const cargoUtilization = [];
    const fuelRemaining = [];
    const actualSpeed = [];
    const weatherImpact = [];
    const cumulativeDistance = [];
    
    let currentFuel = 100; // Start with 100% fuel
    let totalDistance = 0;
    
    for (let i = 0; i < selectedPorts.length; i++) {
      // Cargo Utilization (decreases as cargo is delivered at ports)
      const cargoPercent = Math.max(20, 100 - (i * (80 / selectedPorts.length)) + (Math.random() * 10 - 5));
      cargoUtilization.push(Math.round(cargoPercent));
      
      // Distance calculation
      if (i > 0) {
        const segmentDistance = 400 + Math.random() * 800; // 400-1200 nm between ports
        totalDistance += segmentDistance;
      }
      cumulativeDistance.push(Math.round(totalDistance / 100)); // Scale down for chart readability
      
      // Fuel consumption based on multiple factors
      if (i > 0) {
        const speedFactor = constraints.maxSpeed.value / 25;
        const weatherFactor = constraints.weatherSeverity.value / 4;
        const cargoFactor = (constraints.cargoCapacity.value / 5000) * (cargoPercent / 100);
        const consumption = 8 + (speedFactor * weatherFactor * cargoFactor * 15);
        
        currentFuel = Math.max(5, currentFuel - consumption);
        
        // Refuel if fuel is critically low
        if (currentFuel < 25 && i < selectedPorts.length - 2) {
          currentFuel = 95;
        }
      }
      fuelRemaining.push(Math.round(currentFuel));
      
      // Actual Speed (affected by weather and cargo load)
      const weatherSpeedReduction = (constraints.weatherSeverity.value - 1) * 0.1; // 0-60% reduction
      const cargoSpeedReduction = (cargoPercent / 100) * 0.15; // Up to 15% reduction when fully loaded
      const actualSpeedValue = constraints.maxSpeed.value * (1 - weatherSpeedReduction - cargoSpeedReduction);
      actualSpeed.push(Math.round(actualSpeedValue * 4.5)); // Scale up for better chart visibility
      
      // Weather Impact (inverse of weather severity for better visualization)
      const weatherEfficiency = Math.max(20, 100 - (constraints.weatherSeverity.value - 1) * 15 + (Math.random() * 10 - 5));
      weatherImpact.push(Math.round(weatherEfficiency));
    }
    
    return {
      labels: selectedPorts,
      datasets: [
        {
          label: 'Cargo Utilization (%)',
          data: cargoUtilization,
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: 'rgb(147, 51, 234)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: 'Fuel Remaining (%)',
          data: fuelRemaining,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: 'Speed Efficiency (scaled)',
          data: actualSpeed,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: 'rgb(34, 197, 94)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: 'Weather Efficiency (%)',
          data: weatherImpact,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: 'Distance Progress (scaled)',
          data: cumulativeDistance,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: 'rgb(245, 158, 11)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 6,
        }
      ]
    };
  };
  
  const updateChart = () => {
    if (chartInstance.current) {
      chartInstance.current.data = generateRouteData();
      chartInstance.current.update('active');
    }
  };
  
  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: generateRouteData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 13,
                weight: 'bold'
              },
              color: '#374151',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Maritime Route Optimization - Multi-Constraint Analysis',
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#1f2937',
            padding: 20
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Port Destinations Along Route',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#4b5563'
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.3)'
            },
            ticks: {
              color: '#6b7280',
              maxRotation: 45,
              minRotation: 30,
              font: {
                size: 11
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Constraint Values (% or scaled units)',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#4b5563'
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.3)'
            },
            ticks: {
              color: '#6b7280'
            },
            min: 0,
            max: 120
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverRadius: 8
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  
  useEffect(() => {
    updateChart();
  }, [constraints]);
  
  const handleConstraintChange = (constraintName, value) => {
    setConstraints(prev => ({
      ...prev,
      [constraintName]: {
        ...prev[constraintName],
        value: parseFloat(value)
      }
    }));
  };
  
  const formatValue = (constraintName, value) => {
    switch (constraintName) {
      case 'cargoCapacity':
        return `${value.toLocaleString()} TEU`;
      case 'fuelCapacity':
        return `${value.toLocaleString()} tons`;
      case 'maxSpeed':
        return `${value} knots`;
      case 'weatherSeverity':
        const conditions = ['', 'Calm', 'Light', 'Moderate', 'Rough', 'Very Rough', 'High', 'Very High'];
        return `${value} (${conditions[value]})`;
      case 'portStops':
        return `${value} ports`;
      default:
        return value.toString();
    }
  };
  
  const constraintLabels = {
    cargoCapacity: 'Cargo Capacity',
    fuelCapacity: 'Fuel Capacity',
    maxSpeed: 'Maximum Speed',
    weatherSeverity: 'Weather Severity',
    portStops: 'Number of Port Stops'
  };
  
  const getConstraintIcon = (constraintName) => {
    const icons = {
      cargoCapacity: '📦',
      fuelCapacity: '⛽',
      maxSpeed: '🚢',
      weatherSeverity: '🌊',
      portStops: '⚓'
    };
    return icons[constraintName] || '📊';
  };
  
  const getConstraintColor = (constraintName) => {
    const colors = {
      cargoCapacity: 'purple',
      fuelCapacity: 'red',
      maxSpeed: 'green',
      weatherSeverity: 'blue',
      portStops: 'yellow'
    };
    return colors[constraintName] || 'gray';
  };
  
  // Calculate route summary
  const calculateRouteSummary = () => {
    const totalDistance = Math.round(constraints.portStops.value * (600 + Math.random() * 400));
    const estimatedTime = Math.round(totalDistance / constraints.maxSpeed.value);
    const fuelCost = Math.round(constraints.fuelCapacity.value * 800 * (constraints.weatherSeverity.value / 4));
    const cargoRevenue = Math.round(constraints.cargoCapacity.value * 1200);
    
    return { totalDistance, estimatedTime, fuelCost, cargoRevenue };
  };
  
  const summary = calculateRouteSummary();
  
  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center">
          🚢 Maritime Route Optimization
        </h1>
        <p className="text-gray-700 text-lg">
          Multi-constraint analysis showing how each parameter varies along the shipping route
        </p>
      </div>
      
      {/* Route Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Total Distance</div>
          <div className="text-2xl font-bold text-blue-600">{summary.totalDistance.toLocaleString()} nm</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Est. Transit Time</div>
          <div className="text-2xl font-bold text-green-600">{summary.estimatedTime} hours</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Fuel Cost</div>
          <div className="text-2xl font-bold text-red-600">${summary.fuelCost.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">Cargo Revenue</div>
          <div className="text-2xl font-bold text-purple-600">${summary.cargoRevenue.toLocaleString()}</div>
        </div>
      </div> */}
      
      {/* Chart Legend Explanation */}
      {/* <div className="bg-white rounded-lg p-4 mb-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Chart Lines Explanation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-purple-500 rounded"></div>
            <span className="text-gray-700">Cargo Utilization (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span className="text-gray-700">Fuel Remaining (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span className="text-gray-700">Speed Efficiency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-gray-700">Weather Efficiency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-yellow-500 rounded"></div>
            <span className="text-gray-700">Distance Progress</span>
          </div>
        </div>
      </div> */}
      
      {/* Chart Container */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
        <div style={{ height: '500px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
      
      {/* Constraints Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          ⚙️ Vessel & Route Parameters
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(constraints).map(([key, constraint]) => (
            <div key={key} className={`bg-gray-50 rounded-lg p-4 space-y-3 border-l-4 border-${getConstraintColor(key)}-400`}>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-lg">{getConstraintIcon(key)}</span>
                  {constraintLabels[key]}
                </label>
                <span className={`text-sm font-bold text-${getConstraintColor(key)}-700 bg-${getConstraintColor(key)}-100 px-2 py-1 rounded`}>
                  {formatValue(key, constraint.value)}
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min={constraint.min}
                  max={constraint.max}
                  step={key === 'fuelCapacity' ? 50 : 1}
                  value={constraint.value}
                  onChange={(e) => handleConstraintChange(key, e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{formatValue(key, constraint.min)}</span>
                  <span>{formatValue(key, constraint.max)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Control Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
          <button
            onClick={() => setConstraints({
              cargoCapacity: { value: 5000, min: 1000, max: 10000 },
              fuelCapacity: { value: 2000, min: 500, max: 4000 },
              maxSpeed: { value: 22, min: 12, max: 30 },
              weatherSeverity: { value: 3, min: 1, max: 7 },
              portStops: { value: 8, min: 4, max: 12 }
            })}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            🔄 Reset to Defaults
          </button>
          <button
            onClick={() => updateChart()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            📊 Refresh Analysis
          </button>
        </div>
      </div>
      
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
        }
        
        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: #e5e7eb;
        }
        
        .slider:hover::-webkit-slider-thumb {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default MaritimeRouteDashboard;