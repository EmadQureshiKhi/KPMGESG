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

// Textile unit options
export const textileUnits = [
  'Weaving', 'Spinning', 'Dyeing', 'Printing', 'Stitching',
  'Finishing', 'Knitting', 'Yarn Production', 'Fabric Cutting'
];

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
      'Gas': {
        'Carbon Dioxide': { factor: 1, custom: false },
        'Methane (CH4)': { factor: 25, custom: false },
        'Nitrous Oxide (N2O)': { factor: 298, custom: false },
        'HFC 134': { factor: 1100, custom: false },
        'HFC 134a': { factor: 1430, custom: false },
        'R 410A': { factor: 2088, custom: false },
        'HFC 32': { factor: 675, custom: false },
        'SF6': { factor: 22800, custom: false }
      }
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