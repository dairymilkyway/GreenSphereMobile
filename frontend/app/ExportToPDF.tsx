import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import ViewShot from "react-native-view-shot";
import { useRef } from "react";
import greensphereLogo from "../assets/images/greenspherelogos.png"; // Import image
import tupLogo from "../assets/images/tuplogos.png"; // Import image

const addHeader = (userData) => {
  const headerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <img src="${greensphereLogo}" style="width: 50px; height: 30px;" />
      <div style="text-align: center;">
        <h1 style="color: green; font-size: 30px;">GreenSphere</h1>
        <p>Technological University of The Philippines - Taguig</p>
        <p>KM14 East Service Road, Western Bicutan, Taguig City</p>
        <p><a href="https://www.tupt.edu.ph/">https://www.tupt.edu.ph/</a></p>
      </div>
      <img src="${tupLogo}" style="width: 30px; height: 30px;" />
    </div>
    <hr style="border: 2px solid green; margin-bottom: 20px;" />
    ${userData
      ? `<p>Name: ${userData.name}</p><p>Email: ${userData.email}</p>`
      : ""}
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

  // Add recommendations based on conditions
  if (totalCosts > 4000) {
    recommendations.push(
      "• The total cost of your renewable energy setup is relatively high. Consider Pico Hydro Power or Small Wind Turbines."
    );
  }
  if (totalCarbonEmissions > 80) {
    recommendations.push(
      "• The total carbon emissions are high. Consider integrating Solar Water Heating or Solar Panels."
    );
  }

  return recommendations;
};

const exportToPDF = async (
  costBenefitRef,
  savingsRef,
  carbonRef,
  energyUsageRef,
  totalCostRef,
  costBreakdownRef,
  data,
  userData
) => {
  const viewShotRefs = [
    costBenefitRef,
    savingsRef,
    carbonRef,
    energyUsageRef,
    totalCostRef,
    costBreakdownRef,
  ];

  // Capture views as images
  const capturedImages = await Promise.all(
    viewShotRefs.map(async (ref) => {
      if (ref.current) {
        const uri = await ref.current.capture();
        return `<img src="${uri}" style="width: 100%; margin-bottom: 20px;" />`;
      }
      return "";
    })
  );

  // Generate recommendations
  const recommendations = generateRecommendations(data).map(
    (line) => `<p>${line}</p>`
  );

  // Construct HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1, h2 {
            color: green;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        ${addHeader(userData)}
        <h2>Cost vs. Benefit Analysis</h2>
        ${capturedImages[0]}
        <h2>Cost vs. Savings Comparison</h2>
        ${capturedImages[1]}
        <h2>Carbon Payback Period Analysis</h2>
        ${capturedImages[2]}
        <h2>Energy Usage by Source</h2>
        ${capturedImages[3]}
        <h2>Total Costs</h2>
        ${capturedImages[4]}
        <h2>Cost Breakdown</h2>
        ${capturedImages[5]}
        <h2>Recommendations</h2>
        ${recommendations.join("")}
      </body>
    </html>
  `;

  // Generate PDF
  const fileUri = FileSystem.documentDirectory + "Techno-Economic-Analysis.pdf";
  await Print.printToFileAsync({
    html: htmlContent,
    base64: false,
  }).then((res) => {
    FileSystem.moveAsync({
      from: res.uri,
      to: fileUri,
    });
  });

  console.log("PDF saved at:", fileUri);
};

export default exportToPDF;