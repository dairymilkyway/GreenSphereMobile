export const calculateTotalCost = (source, quantity) => {
  const prices = PRICES[source.toLowerCase().replace(/\s+/g, '')]; // Normalize the source key
  if (!prices) return { totalCost: 0, annualSavings: 0, paybackPeriod: null, totalCarbonEmissions: 0 };

  const totalCost = (prices.productCost + prices.installation + prices.maintenance) * quantity;
  const annualSavings = prices.energyProduction * prices.electricityCost * quantity;
  const paybackPeriod = totalCost / annualSavings;
  const totalCarbonEmissions = prices.carbonEmissions * quantity;

  return { totalCost, annualSavings, paybackPeriod, totalCarbonEmissions };
};

  export const PRICES = {
    solarpanels: {
      type: 'Solar Energy',
      productCost: 500,
      installation: 200,
      maintenance: 50,
      carbonEmissions: 35,
      energyProduction: 500, // kWh per year per unit
      electricityCost: 0.15 // Cost per kWh in your region
    },
    solarwaterheating: {
      type: 'Solar Energy',
      productCost: 1000,
      installation: 300,
      maintenance: 100,
      carbonEmissions: 25,
      energyProduction: 400,
      electricityCost: 0.15
    },
    smallwindturbines: {
      type: 'Wind Energy',
      productCost: 1500,
      installation: 500,
      maintenance: 200,
      carbonEmissions: 20,
      energyProduction: 600,
      electricityCost: 0.12
    },
    verticalaxiswindturbines: {
      type: 'Wind Energy',
      productCost: 2000,
      installation: 800,
      maintenance: 300,
      carbonEmissions: 10,
      energyProduction: 700,
      electricityCost: 0.12
    },
    microhydropowersystem: {
      type: 'HydroPower Energy',
      productCost: 5000,
      installation: 2000,
      maintenance: 500,
      carbonEmissions: 20,
      energyProduction: 3000,
      electricityCost: 0.10
    },
    picohydropower: {
      type: 'HydroPower Energy',
      productCost: 3000,
      installation: 1000,
      maintenance: 300,
      carbonEmissions: 12.5,
      energyProduction: 1500,
      electricityCost: 0.10
    },
    solarrooftiles: {
      type: 'Solar Energy',
      productCost: 2000,
      installation: 800,
      maintenance: 300,
      carbonEmissions: 35,
      energyProduction: 550,
      electricityCost: 0.15
    },
    heatpump: {
      type: 'Geothermal Energy',
      productCost: 5000,
      installation: 2000,
      maintenance: 500,
      carbonEmissions: 25,
      energyProduction: 2500,
      electricityCost: 0.13
    },
    verticalfarming: {
      type: 'Urban Farming',
      productCost: 3000,
      installation: 1000,
      maintenance: 300,
      carbonEmissions: 50,
      energyProduction: 0,  // Not applicable
      electricityCost: 0 // Not applicable
    }
  };

 