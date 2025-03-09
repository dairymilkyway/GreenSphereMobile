  import * as Print from "expo-print";
  import * as Sharing from "expo-sharing";
  import * as FileSystem from "expo-file-system";
  import { calculateTotalCost, PRICES } from './utils'; // Import both functions
  import { Platform } from "react-native";
  import greensphereLogo from "../assets/images/greenspherelogos.png";
  import tupLogo from "../assets/images/tuplogos.png";

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const addHeader = (userData) => {
    const headerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <img src="${greensphereLogo}" style="width: 60px; height: 40px; object-fit: contain;" />
        <div style="text-align: center;">
          <h1 style="color: #2E8B57; font-size: 32px; margin-bottom: 8px;">GreenSphere</h1>
          <p style="font-size: 14px; margin: 4px 0;">Technological University of The Philippines - Taguig</p>
          <p style="font-size: 14px; margin: 4px 0;">KM14 East Service Road, Western Bicutan, Taguig City</p>
          <p style="font-size: 14px; margin: 4px 0;"><a href="https://www.tupt.edu.ph/" style="color: #2E8B57;">www.tupt.edu.ph</a></p>
        </div>
        <img src="${tupLogo}" style="width: 40px; height: 40px; object-fit: contain;" />
      </div>
      <hr style="border: 2px solid #2E8B57; margin-bottom: 20px;" />
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <div>
          ${userData ? `
            <p style="margin: 4px 0;"><strong>Name:</strong> ${userData.name}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${userData.email}</p>
          ` : ""}
        </div>
        <div>
          <p style="text-align: right;"><strong>Report Generated:</strong> ${formatDate()}</p>
        </div>
      </div>
    `;
    return headerHTML;
  };

  const generateRecommendations = (data) => {
    const recommendations = [];
    if (!data || Object.keys(data).length === 0) {
      return ["No data available to generate recommendations."];
    }

    const totalCosts = Object.values(data).reduce(
      (sum, item) => sum + (item.totalCost || 0),
      0
    );
    const totalCarbonEmissions = Object.values(data).reduce(
      (sum, item) => sum + (item.totalCarbonEmissions || 0),
      0
    );

    if (totalCosts > 4000) {
      recommendations.push(
        "• <span style='color: #2E8B57;'>Cost Optimization:</span> The total cost of your renewable energy setup is relatively high. Consider Pico Hydro Power or Small Wind Turbines for more cost-effective solutions."
      );
    }
    if (totalCarbonEmissions > 80) {
      recommendations.push(
        "• <span style='color: #2E8B57;'>Emissions Reduction:</span> Your carbon emissions are high. Consider integrating Solar Water Heating or Solar Panels to reduce your carbon footprint."
      );
    }

    // Add generic recommendations if the list is empty
    if (recommendations.length === 0) {
      recommendations.push(
        "• <span style='color: #2E8B57;'>Energy Efficiency:</span> Consider implementing energy-efficient appliances and LED lighting throughout your space.",
        "• <span style='color: #2E8B57;'>Behavioral Changes:</span> Small changes in daily habits can lead to significant energy savings over time."
      );
    }

    return recommendations;
  };

  const addFooter = () => {
    return `
      <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 15px; font-size: 12px; color: #666; text-align: center;">
        <p>© ${new Date().getFullYear()} GreenSphere - Technological University of The Philippines</p>
        <p>This report is generated based on your input data and provides estimates for informational purposes only.</p>
      </div>
    `;
  };

  const exportToPDF = async (
    costBenefitRef,
    savingsRef,
    carbonRef,
    energyUsageRef,
    totalCostRef,
    costBreakdownRef,
    addedItems, // This contains the items added by the user
    userData
  ) => {
    try {
      const viewShotRefs = [
        savingsRef,
        carbonRef,
        energyUsageRef,
        costBreakdownRef,
      ];
  
      // Capture views as images
      const capturedImages = await Promise.all(
        viewShotRefs.map(async (ref) => {
          if (ref.current) {
            const uri = await ref.current.capture();
            return `<img src="${uri}" style="width: 100%; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />`;
          }
          return "";
        })
      );
  
      // Fixed list of renewable energy sources
      const fixedEnergySources = [
        "Solar Panels",
        "Solar Water Heating",
        "Solar Roof Tiles",
        "Heat Pump",
        "Small Wind Turbines",
        "Vertical Axis Wind Turbines",
        "Micro Hydro Power System",
        "Pico Hydro Power",
        "Vertical Farming",
      ];
  
      // Helper function to calculate cost breakdown
      const calculateCostBreakdown = () => {
        const totalProductCost = addedItems.reduce((sum, item) => {
          const source = item.name.replace(/\s+/g, '').toLowerCase();
          const prices = PRICES[source];
          return sum + (prices ? prices.productCost * item.quantity : 0);
        }, 0);
  
        const totalInstallationCost = addedItems.reduce((sum, item) => {
          const source = item.name.replace(/\s+/g, '').toLowerCase();
          const prices = PRICES[source];
          return sum + (prices ? prices.installation * item.quantity : 0);
        }, 0);
  
        const totalMaintenanceCost = addedItems.reduce((sum, item) => {
          const source = item.name.replace(/\s+/g, '').toLowerCase();
          const prices = PRICES[source];
          return sum + (prices ? prices.maintenance * item.quantity : 0);
        }, 0);
  
        const grandTotal = totalProductCost + totalInstallationCost + totalMaintenanceCost;
  
        return {
          totalProductCost,
          totalInstallationCost,
          totalMaintenanceCost,
          grandTotal,
        };
      };
  
      // Generate Cost vs. Benefit Analysis Table
      const costBenefitTable = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #2E8B57; color: white;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Cost</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Benefit</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Payback Period</th>
            </tr>
            <tr style="background-color: #2E8B57; color: white;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Source</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Total Cost (₱)</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Annual Savings (₱)</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Payback Period (Years)</th>
            </tr>
          </thead>
          <tbody>
            ${fixedEnergySources.map((sourceName) => {
              const addedItem = addedItems.find((item) => item.name === sourceName);
              if (addedItem) {
                const source = sourceName.replace(/\s+/g, '').toLowerCase();
                const analysisData = calculateTotalCost(source, addedItem.quantity);
                return `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 12px;">${sourceName}</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">₱${analysisData.totalCost.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">₱${analysisData.annualSavings.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">
                      ${isNaN(analysisData.paybackPeriod) || analysisData.paybackPeriod === null
                        ? '0yr'
                        : `${analysisData.paybackPeriod.toFixed(1)}yr`}
                    </td>
                  </tr>
                `;
              } else {
                return `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 12px;">${sourceName}</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">₱0.00</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">₱0.00</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">0yr</td>
                  </tr>
                `;
              }
            }).join("")}
          </tbody>
        </table>
      `;
  
      // Calculate total costs
      const { totalProductCost, totalInstallationCost, totalMaintenanceCost, grandTotal } = calculateCostBreakdown();
  
      // Generate Total Costs Table
      const totalCostsTable = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #2E8B57; color: white;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Description</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Amount (₱)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">Product Cost</td>
              <td style="border: 1px solid #ddd; padding: 12px;">₱${totalProductCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">Installation Cost</td>
              <td style="border: 1px solid #ddd; padding: 12px;">₱${totalInstallationCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">Maintenance Cost</td>
              <td style="border: 1px solid #ddd; padding: 12px;">₱${totalMaintenanceCost.toFixed(2)}</td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Grand Total</td>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">₱${grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      `;
  
  
      // Generate recommendations
      const recommendations = generateRecommendations(addedItems).map(
        (line) => `<p style="margin: 10px 0; line-height: 1.5;">${line}</p>`
      );
  
      // Construct HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              body {
                font-family: 'Helvetica', Arial, sans-serif;
                padding: 20px;
                line-height: 1.6;
                color: #333;
              }
              h1, h2 {
                color: #2E8B57;
                margin-top: 25px;
              }
              h2 {
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
                color: #2E8B57;
              }
              .summary-box {
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-left: 4px solid #2E8B57;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .chart-container {
                background-color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 25px;
              }
              .page-break {
                page-break-before: always;
              }
            </style>
          </head>
          <body>
            <!-- Main Header -->
            ${addHeader(userData)}
            
            <!-- Cost vs. Benefit Analysis Table -->
            <h2>Cost vs. Benefit Analysis</h2>
            ${costBenefitTable}
  
            <div class="chart-container">${capturedImages[0]}</div>
            
            <div class="chart-container">${capturedImages[1]}</div>
            
            <div class="chart-container">${capturedImages[2]}</div>
            
            <div class="chart-container">${capturedImages[3]}</div>

            <h2>Total Costs</h2>
            ${totalCostsTable} <!-- New Total Costs Table -->
            
            <div class="page-break"></div>
            
            <h2>Recommendations</h2>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
              ${recommendations.join("")}
            </div>
            
            ${addFooter()}
          </body>
        </html>
      `;
      // Generate PDF file name with date
      const fileName = `GreenSphere_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Copy to documents directory with better name
      await FileSystem.copyAsync({
        from: uri,
        to: filePath
      });

      console.log("PDF generated at:", filePath);

      // Share the PDF file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Your GreenSphere Report',
          UTI: 'com.adobe.pdf',
        });
      } else {
        console.error("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  export default exportToPDF;