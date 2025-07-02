import { EmissionFactorsDatabase } from '../types/ghg';

// Unit conversion factors (to kg CO2e)
export const unitConversions: Record<string, number> = {
  'kg': 1,
  'liters': 1,
  'm³': 1,
  'kWh': 1,
  'MJ': 0.277778,
  'therms': 29.3001,
  'mmBtu': 293.071,
  'tons': 1000,
  'gallons': 3.78541
};

// Comprehensive fugitive gas emission factors
export const fugitiveGasFactors: Record<string, number> = {
  'Carbon dioxide': 1,
  'Methane': 25,
  'Nitrous oxide': 298,
  'HFC-23': 14800,
  'HFC-32': 675,
  'HFC-41': 92,
  'HFC-125': 3500,
  'HFC-134': 1100,
  'HFC-134a': 1430,
  'HFC-143': 353,
  'HFC-143a': 4470,
  'HFC-152a': 124,
  'HFC-227ea': 3220,
  'HFC-236fa': 9810,
  'HFC-245fa': 1030,
  'HFC-43-10mee': 1640,
  'Perfluoromethane (PFC-14)': 7390,
  'Perfluoroethane (PFC-116)': 12200,
  'Perfluoropropane (PFC-218)': 8830,
  'Perfluorocyclobutane (PFC-318)': 10300,
  'Perfluorobutane (PFC-3-1-10)': 8860,
  'Perfluoropentane (PFC-4-1-12)': 9160,
  'Perfluorohexane (PFC-5-1-14)': 9300,
  'Sulphur hexafluoride (SF6)': 22800,
  'HFC-152': 53,
  'HFC-161': 12,
  'HFC-236cb': 1340,
  'HFC-236ea': 1370,
  'HFC-245ca': 693,
  'HFC-365mfc': 794,
  'R404A': 3922,
  'R407A': 2107,
  'R407C': 1774,
  'R407F': 1825,
  'R408A': 3152,
  'R410A': 2088,
  'R507A': 3985,
  'R508B': 13396,
  'R403A': 3124,
  'CFC-11/R11 = trichlorofluoromethane': 4750,
  'CFC-12/R12 = dichlorodifluoromethane': 10900,
  'CFC-13': 14400,
  'CFC-113': 6130,
  'CFC-114': 10000,
  'CFC-115': 7370,
  'Halon-1211': 1890,
  'Halon-1301': 7140,
  'Halon-2402': 1640,
  'Carbon tetrachloride': 1400,
  'Methyl bromide': 5,
  'Methyl chloroform': 146,
  'HCFC-22/R22 = chlorodifluoromethane': 1810,
  'HCFC-123': 77,
  'HCFC-124': 609,
  'HCFC-141b': 725,
  'HCFC-142b': 2310,
  'HCFC-225ca': 122,
  'HCFC-225cb': 595,
  'HCFC-21': 151,
  'Nitrogen trifluoride': 17200,
  'PFC-9-1-18': 7500,
  'Trifluoromethyl sulphur pentafluoride': 17700,
  'Perfluorocyclopropane': 17340,
  'HFE-125': 14900,
  'HFE-134': 6320,
  'HFE-143a': 756,
  'HCFE-235da2': 350,
  'HFE-245cb2': 708,
  'HFE-245fa2': 659,
  'HFE-254cb2': 359,
  'HFE-347mcc3': 575,
  'HFE-347pcf2': 580,
  'HFE-356pcc3': 110,
  'HFE-449sl (HFE-7100)': 297,
  'HFE-569sf2 (HFE-7200)': 59,
  'HFE-43-10pccc124 (H-Galden1040x)': 1870,
  'HFE-236ca12 (HG-10)': 2800,
  'HFE-338pcc13 (HG-01)': 1500,
  'PFPMIE': 10300,
  'Dimethylether': 1,
  'Methylene chloride': 9,
  'Methyl chloride': 13,
  'R290 = propane': 3,
  'R600A = isobutane': 3,
  'R406A': 1943,
  'R409A': 1585,
  'R502': 4657
};

// Create fugitive gas factors object for emission factors database
const createFugitiveGasFactors = () => {
  const gasFactors: Record<string, { factor: number; custom: boolean }> = {};
  
  Object.entries(fugitiveGasFactors).forEach(([gasName, factor]) => {
    gasFactors[gasName] = { factor, custom: false };
  });
  
  return gasFactors;
};

// Emission factors database (converted from Python)
export const initialEmissionFactors: EmissionFactorsDatabase = {
  'Scope 1': {
    'Stationary': {
      'Gaseous Fuels': {
        'Compressed Natural Gas': { factor: 0.44327, custom: false },
        'Liquefied Natural Gas': { factor: 1.15041, custom: false },
        'Liquefied Petroleum Gas': { factor: 1.55537, custom: false },
        'Natural Gas': { factor: 2.02236, custom: false },
        'Natural Gas (100% mineral blend)': { factor: 2.03017, custom: false },
        'Other Petroleum Gas': { factor: 0.95279, custom: false }
      },
      'Liquid Fuels': {
        'Aviation Spirit': { factor: 2.29082, custom: false },
        'Aviation Turbine Fuel': { factor: 2.54310, custom: false },
        'Burning Oil': { factor: 2.54039, custom: false },
        'Diesel (average biofuel blend)': { factor: 2.54603, custom: false },
        'Diesel (100% mineral diesel)': { factor: 2.68787, custom: false },
        'Fuel Oil': { factor: 3.18317, custom: false },
        'Gas Oil': { factor: 2.75776, custom: false },
        'Petrol (Average biofuel blend)': { factor: 2.16802, custom: false },
        'Petrol (100% mineral petrol)': { factor: 2.31467, custom: false },
        'Marine gas Oils': { factor: 2.775, custom: false },
        'Marine Fuel Oil': { factor: 3.312204, custom: false }
      },
      'Solid Fuels': {
        'Coal (Industrial)': { factor: 2380.01000, custom: false },
        'Coal (Electricity Generation)': { factor: 2222.94000, custom: false },
        'Coal (Domestic)': { factor: 2833.26000, custom: false },
        'Coking Coal': { factor: 3222.04000, custom: false },
        'Petroleum Coke': { factor: 3397.79000, custom: false }
      }
    },
    'Mobile': {
      'Gaseous Fuels': {
        'Compressed Natural Gas (CNG)': { factor: 0.448, custom: false },
        'Liquefied Natural Gas (LNG)': { factor: 1.166, custom: false },
        'Liquefied Petroleum Gases (LPG)': { factor: 1.555, custom: false },
        'Natural gas (100% mineral blend)': { factor: 2.050, custom: false }
      },
      'Liquid Fuels': {
        'Aviation spirit (Aviation Gasoline)': { factor: 2.283, custom: false },
        'Aviation turbine fuel (Jet Fuel)': { factor: 2.520, custom: false },
        'Diesel (100% mineral diesel)': { factor: 2.626, custom: false },
        'Fuel oil (Residual Fuel Oil)': { factor: 3.163, custom: false },
        'Petrol (100% mineral petrol) (Motor Gasoline)': { factor: 2.331, custom: false },
        'Bioethanol': { factor: 1.52, custom: false },
        'Biodiesel ME': { factor: 2.39, custom: false }
      }
    },
    'Fugitive': {
      'Gas': createFugitiveGasFactors()
    }
  },
  'Scope 2': {
    'Electricity': {
      'Grid Average': { factor: 0.385, custom: false },
      'Coal Power': { factor: 0.95, custom: false },
      'Natural Gas Power': { factor: 0.45, custom: false },
      'Renewable Power': { factor: 0.05, custom: false }
    },
    'Heat': {
      'District Heating': { factor: 0.28, custom: false },
      'Steam': { factor: 0.20, custom: false }
    }
  }
};