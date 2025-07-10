import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { QuestionnaireData, EmissionEntry, EmissionFactorsDatabase } from '../types/ghg';

export interface ExportData {
  questionnaire: QuestionnaireData;
  entries: EmissionEntry[];
  emissionFactors: EmissionFactorsDatabase;
  totalEmissions: number;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Helper function to get custom fuels
const getCustomFuels = (emissionFactors: EmissionFactorsDatabase, customEquipmentTypes: any = {}): any[] => {
  const customFuels: any[] = [];
  
  // Iterate through all scopes
  Object.entries(emissionFactors).forEach(([scope, scopeData]) => {
    if (scope === 'Scope 1') {
      // Scope 1 has categories
      Object.entries(scopeData).forEach(([category, categoryData]) => {
        Object.entries(categoryData).forEach(([fuelCategory, fuelCategoryData]) => {
          Object.entries(fuelCategoryData).forEach(([fuelType, fuelData]) => {
            if (fuelData.custom) {
              customFuels.push({
                'Scope': scope,
                'Category': category,
                'Fuel Category': fuelCategory,
                'Fuel Type': fuelType,
                'Emission Factor (kg CO2e/unit)': fuelData.factor,
                'Date Added': fuelData.timestamp ? formatDate(fuelData.timestamp) : 'N/A'
              });
            }
          });
        });
      });
    } else {
      // Scope 2 doesn't have categories
      Object.entries(scopeData).forEach(([fuelCategory, fuelCategoryData]) => {
        Object.entries(fuelCategoryData).forEach(([fuelType, fuelData]) => {
          if (fuelData.custom) {
            customFuels.push({
              'Scope': scope,
              'Category': '',
              'Fuel Category': fuelCategory,
              'Fuel Type': fuelType,
              'Emission Factor (kg CO2e/unit)': fuelData.factor,
              'Date Added': fuelData.timestamp ? formatDate(fuelData.timestamp) : 'N/A'
            });
          }
        });
      });
    }
  });
  
  return customFuels;
};

// Helper function to get custom equipment types
const getCustomEquipmentTypes = (customEquipmentTypes: any = {}): any[] => {
  const customEquipment: any[] = [];
  
  Object.entries(customEquipmentTypes).forEach(([category, equipmentData]: [string, any]) => {
    Object.entries(equipmentData).forEach(([equipmentName, equipmentInfo]: [string, any]) => {
      if (equipmentInfo.custom) {
        customEquipment.push({
          'Category': category,
          'Equipment/Source Type': equipmentName,
          'Description': equipmentInfo.description || '',
          'Date Added': equipmentInfo.timestamp ? formatDate(equipmentInfo.timestamp) : 'N/A'
        });
      }
    });
  });
  
  return customEquipment;
};
// Create questionnaire sheet data
const createQuestionnaireData = (questionnaire: QuestionnaireData): any[] => {
  return [{
    'Organization Name': questionnaire.orgName,
    'Organizational Boundary': questionnaire.boundaryApproach,
    'Control Approach': questionnaire.boundaryApproach === 'Control Approach' ? questionnaire.controlSubtype : 'N/A',
    'Operational Boundary': questionnaire.operationalBoundary,
    'Emission Sources': questionnaire.emissionSources,
    'Report Date': formatDate(questionnaire.timestamp),
    'Assessment Scope': questionnaire.emissionSources,
    'Boundary Approach Type': questionnaire.boundaryApproach,
    'Control Type': questionnaire.controlSubtype || 'N/A',
    'Assessment Timestamp': questionnaire.timestamp,
    'Report Generated': new Date().toLocaleString()
  }];
};

// Create calculations sheet data
const createCalculationsData = (entries: EmissionEntry[]): any[] => {
  return entries.map(entry => ({
    'Scope': entry.scope,
    'Category': entry.category || '',
    'Equipment/Source Type': entry.equipmentType || '',
    'Fuel Category': entry.fuelCategory,
    'Fuel Type': entry.fuelType,
    'Amount': entry.amount,
    'Unit Type': entry.unit_type,
    'Base Emission Factor (kg CO2e/unit)': entry.baseFactor,
    'Converted Emission Factor (kg CO2e/unit)': entry.convertedFactor,
    'Total Emissions (kg CO2e)': entry.emissions,
    'Total Emissions (tonnes CO2e)': entry.emissions / 1000,
    'Calculation Date': formatDate(entry.timestamp),
    'Entry ID': entry.id,
    'Calculation Method': 'Activity Data × Emission Factor',
    'Data Quality': 'User Input',
    'Verification Status': 'Pending Review'
  }));
};

// Create summary sheet data
const createSummaryData = (data: ExportData): any[] => {
  const { questionnaire, entries, totalEmissions } = data;
  
  // Calculate emissions by scope
  const scope1Emissions = entries.filter(e => e.scope === 'Scope 1').reduce((sum, e) => sum + e.emissions, 0);
  const scope2Emissions = entries.filter(e => e.scope === 'Scope 2').reduce((sum, e) => sum + e.emissions, 0);

  return [{
    'Organization': questionnaire.orgName,
    'Total Emissions (kg CO2e)': totalEmissions,
    'Total Emissions (tonnes CO2e)': totalEmissions / 1000,
    'Scope 1 Emissions (kg CO2e)': scope1Emissions,
    'Scope 1 Emissions (tonnes CO2e)': scope1Emissions / 1000,
    'Scope 2 Emissions (kg CO2e)': scope2Emissions,
    'Scope 2 Emissions (tonnes CO2e)': scope2Emissions / 1000,
    'Total Activities': entries.length,
    'Assessment Date': formatDate(questionnaire.timestamp),
    'Report Generated': new Date().toLocaleString(),
    'Emission Sources': questionnaire.emissionSources,
    'Organizational Boundary': questionnaire.boundaryApproach,
    'Operational Boundary': questionnaire.operationalBoundary,
    'Data Quality Score': 'Good',
    'Verification Required': 'Yes'
  }];
};

// Create activity breakdown sheet data
const createActivityBreakdownData = (data: ExportData): any[] => {
  const { entries } = data;
  
  // Group by fuel type
  const fuelTypeGroups = entries.reduce((acc, entry) => {
    const key = `${entry.scope} - ${entry.category} - ${entry.equipmentType} - ${entry.fuelType}`;
    if (!acc[key]) {
      acc[key] = {
        scope: entry.scope,
        category: entry.category,
        equipmentType: entry.equipmentType,
        fuelCategory: entry.fuelCategory,
        fuelType: entry.fuelType,
        totalEmissions: 0,
        count: 0,
        totalAmount: 0,
        unit: entry.unit_type
      };
    }
    acc[key].totalEmissions += entry.emissions;
    acc[key].count += 1;
    acc[key].totalAmount += entry.amount;
    return acc;
  }, {} as any);
  
  return Object.values(fuelTypeGroups).map((group: any) => ({
    'Scope': group.scope,
    'Category': group.category || '',
    'Equipment/Source Type': group.equipmentType || '',
    'Fuel Category': group.fuelCategory,
    'Fuel Type': group.fuelType,
    'Total Amount': group.totalAmount,
    'Unit': group.unit,
    'Total Emissions (kg CO2e)': group.totalEmissions,
    'Total Emissions (tonnes CO2e)': group.totalEmissions / 1000,
    'Number of Activities': group.count,
    'Percentage of Total Emissions': ((group.totalEmissions / data.totalEmissions) * 100).toFixed(2) + '%',
    'Average per Activity': (group.totalEmissions / group.count).toFixed(2) + ' kg CO2e'
  }));
};

// Export to Excel
export const exportToExcel = async (data: ExportData, format: 'excel' | 'csv' = 'excel', customEquipmentTypes: any = {}): Promise<void> => {
  const { questionnaire, entries, emissionFactors } = data;
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Sheet 1: Questionnaire Data
  const questionnaireData = createQuestionnaireData(questionnaire);
  const questionnaireWS = XLSX.utils.json_to_sheet(questionnaireData);
  XLSX.utils.book_append_sheet(wb, questionnaireWS, 'Questionnaire');
  
  // Sheet 2: Summary
  const summaryData = createSummaryData(data);
  const summaryWS = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
  
  // Sheet 3: Calculations Data
  const calculationsData = createCalculationsData(entries);
  const calculationsWS = XLSX.utils.json_to_sheet(calculationsData);
  XLSX.utils.book_append_sheet(wb, calculationsWS, 'Calculations');
  
  // Sheet 4: Activity Breakdown
  const activityBreakdownData = createActivityBreakdownData(data);
  const activityBreakdownWS = XLSX.utils.json_to_sheet(activityBreakdownData);
  XLSX.utils.book_append_sheet(wb, activityBreakdownWS, 'Activity Breakdown');
  
  // Sheet 5: Custom Fuels (only if custom fuels exist)
  const customFuels = getCustomFuels(emissionFactors, customEquipmentTypes);
  if (customFuels.length > 0) {
    const customFuelsWS = XLSX.utils.json_to_sheet(customFuels);
    XLSX.utils.book_append_sheet(wb, customFuelsWS, 'Custom Fuels');
  }
  
  // Sheet 6: Custom Equipment Types (only if custom equipment exists)
  const customEquipment = getCustomEquipmentTypes(customEquipmentTypes);
  if (customEquipment.length > 0) {
    const customEquipmentWS = XLSX.utils.json_to_sheet(customEquipment);
    XLSX.utils.book_append_sheet(wb, customEquipmentWS, 'Custom Equipment');
  }
  
  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const orgName = questionnaire.orgName.replace(/[^a-zA-Z0-9]/g, '_');
  
  if (format === 'excel') {
    // Export as Excel file
    const filename = `GHG_Assessment_${orgName}_${timestamp}.xlsx`;
    XLSX.writeFile(wb, filename);
  } else {
    // Export as CSV files in a ZIP
    const zip = new JSZip();
    
    // Convert each sheet to CSV
    const sheets = [
      { name: 'Questionnaire', data: questionnaireData },
      { name: 'Summary', data: summaryData },
      { name: 'Calculations', data: calculationsData },
      { name: 'Activity_Breakdown', data: activityBreakdownData }
    ];
    
    if (customFuels.length > 0) {
      sheets.push({ name: 'Custom_Fuels', data: customFuels });
    }
    
    if (customEquipment.length > 0) {
      sheets.push({ name: 'Custom_Equipment', data: customEquipment });
    }
    
    sheets.forEach(sheet => {
      const ws = XLSX.utils.json_to_sheet(sheet.data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      zip.file(`${sheet.name}.csv`, csv);
    });
    
    // Generate and download ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GHG_Assessment_${orgName}_${timestamp}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Export individual sheets for debugging
export const exportSheet = (data: any[], sheetName: string): void => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${sheetName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};