export const calculateTotalCost = (source, quantity) => {
  const prices = PRICES[source.toLowerCase().replace(/\s+/g, '')]; // Normalize the source key
  if (!prices) return { totalCost: 0, annualSavings: 0, paybackPeriod: null, totalCarbonEmissions: 0 };

  const totalCost = (prices.productCost + prices.installation + prices.maintenance) * quantity;
  const annualSavings = prices.energyProduction * prices.electricityCost * quantity;
  const paybackPeriod = totalCost / annualSavings * quantity;
  const totalCarbonEmissions = prices.carbonEmissions * quantity;

  return { totalCost, annualSavings, paybackPeriod, totalCarbonEmissions };
};

  export const PRICES = {
    solarpanels: {
      type: 'Solar Energy',
      productCost: 30000,
      installation: 40000,
      maintenance: 15000,
      carbonEmissions: 40,
      energyProduction: 500, // kWh per year per unit
      electricityCost: 0.15 // Cost per kWh in your region
    },
    solarwaterheating: {
      type: 'Solar Energy',
    productCost: 380000,
    installation: 20000,
    maintenance: 5000,
    carbonEmissions: 0,
    energyProduction: 400,
    electricityCost: 0.15
    },
    smallwindturbines: {
      type: 'Wind Energy',
      productCost: 111000,
      installation: 50000,
      maintenance: 10000,
      carbonEmissions: 10,
      energyProduction: 600,
      electricityCost: 0.12
    },
    verticalaxiswindturbines: {
      type: 'Wind Energy',
    productCost: 110000,
    installation: 60000,
    maintenance: 12000,
    carbonEmissions: 10,
    energyProduction: 700,
    electricityCost: 0.12
    },
    microhydropowersystem: {
      type: 'HydroPower Energy',
    productCost: 200000,
    installation: 100000,
    maintenance: 15000,
    carbonEmissions: 10,
    energyProduction: 3000,
    electricityCost: 0.10
    },
    picohydropower: {
      type: 'HydroPower Energy',
    productCost: 300000,
    installation: 40000,
    maintenance: 5000,
    carbonEmissions: 0,
    energyProduction: 1500,
    electricityCost: 0.10
    },
    solarrooftiles: {
      type: 'Solar Energy',
    productCost: 20000,
    installation: 100000,
    maintenance: 15000,
    carbonEmissions: 40,
    energyProduction: 550,
    electricityCost: 0.15
    },
    heatpump: {
      type: 'Geothermal Energy',
      productCost: 150000,
      installation: 200000,
      maintenance: 10000,
      carbonEmissions: 10,
      energyProduction: 2500,
      electricityCost: 0.13
    },
    verticalfarming: {
      type: 'Urban Farming',
      productCost: 500000,
      installation: 200000,
      maintenance: 20000,
      carbonEmissions: 1,
      energyProduction: 0,  // Not applicable
      electricityCost: 0 // Not applicable
    }
  };

 