export const calculateTotalCost = (source, count) => {
    // Normalize the source key
    const normalizedSource = source.toLowerCase().replace(/\s+/g, '');
  
    // Check if the key exists in PRICES
    if (!PRICES[normalizedSource]) {
      console.error(`Error: Key "${normalizedSource}" not found in PRICES.`);
      return {
        totalProductCost: 0,
        totalInstallationCost: 0,
        totalMaintenanceCost: 0,
        totalCarbonEmissions: 0,
        totalCost: 0,
        annualSavings: 0,
        paybackPeriod: 0
      }; // Return default values
    }
  
    // Destructure the price data
    const { productCost, installation, maintenance, carbonEmissions, energyProduction, electricityCost } = PRICES[normalizedSource];
  
    // Calculate annual savings
    const annualSavings = energyProduction * electricityCost * count;
  
    // Return the calculated costs
    return {
      totalProductCost: productCost * count,
      totalInstallationCost: installation * count,
      totalMaintenanceCost: maintenance * count,
      totalCarbonEmissions: carbonEmissions * count,
      totalCost: productCost * count + installation * count + maintenance * count,
      annualSavings: annualSavings,
      paybackPeriod: (productCost * count + installation * count + maintenance * count) / annualSavings
    };
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

 