// Equipment types for detailed emission source tracking
export const defaultEquipmentTypes = {
    'Stationary': {
      'Boilers': 'Steam and hot water generation systems',
      'Furnaces': 'Industrial heating and melting equipment',
      'Burners': 'Direct flame heating systems',
      'Turbines': 'Gas and steam turbine generators',
      'Heaters': 'Space and process heating equipment',
      'Kilns': 'High-temperature processing equipment',
      'Ovens': 'Industrial baking and curing systems',
      'Dryers': 'Material drying equipment',
      'Internal Combustion Engines': 'Stationary generators and pumps',
      'Incinerators': 'Waste combustion systems',
      'Thermal Oxidizers': 'Emission control equipment',
      'Open Burning': 'Fireplaces and open flame systems',
      'Flares': 'Safety and waste gas burning systems',
      'Other Stationary Equipment': 'Other combustion equipment'
    },
    'Mobile': {
      'Automobiles': 'Passenger cars and light vehicles',
      'Trucks': 'Heavy-duty and delivery vehicles',
      'Buses': 'Public and private transportation buses',
      'Trains': 'Railway locomotives and rail cars',
      'Airplanes': 'Aircraft and aviation equipment',
      'Boats': 'Small watercraft and recreational vessels',
      'Ships': 'Large commercial and cargo vessels',
      'Barges': 'Inland waterway transport vessels',
      'Vessels': 'Other marine transportation equipment',
      'Construction Equipment': 'Mobile construction and mining equipment',
      'Agricultural Equipment': 'Tractors and farming machinery',
      'Other Mobile Equipment': 'Other transportation equipment'
    },
    'Fugitive': {
      'Equipment Leaks': 'Joints, seals, packing, and gaskets',
      'Coal Piles': 'Coal storage and handling emissions',
      'Wastewater Treatment': 'Treatment facility emissions',
      'Cooling Towers': 'HVAC and industrial cooling systems',
      'Gas Processing Facilities': 'Natural gas processing emissions',
      'Storage Tanks': 'Fuel and chemical storage emissions',
      'Loading Operations': 'Material transfer emissions',
      'Venting Systems': 'Intentional gas releases',
      'Other Fugitive Sources': 'Other unintentional releases'
    }
  };
  
  // Custom equipment types storage structure
  export interface CustomEquipmentType {
    name: string;
    description: string;
    custom: boolean;
    timestamp?: string;
  }
  
  // Merge default and custom equipment types
  export const mergeEquipmentTypes = (customTypes: any = {}): typeof defaultEquipmentTypes => {
    const merged = JSON.parse(JSON.stringify(defaultEquipmentTypes));
    
    // Add custom equipment types to each category
    Object.keys(merged).forEach(category => {
      if (customTypes[category]) {
        Object.assign(merged[category], customTypes[category]);
      }
    });
    
    return merged;
  };
  
  export const getEquipmentOptions = (category: string): string[] => {
    return Object.keys(defaultEquipmentTypes[category as keyof typeof defaultEquipmentTypes] || {});
  };
  
  export const getEquipmentOptionsWithCustom = (category: string, customTypes: any = {}): string[] => {
    const merged = mergeEquipmentTypes(customTypes);
    return Object.keys(merged[category as keyof typeof merged] || {});
  };
  
  export const getEquipmentDescription = (category: string, equipment: string): string => {
    const categoryData = defaultEquipmentTypes[category as keyof typeof defaultEquipmentTypes];
    return categoryData?.[equipment as keyof typeof categoryData] || '';
  };
  
  export const getEquipmentDescriptionWithCustom = (category: string, equipment: string, customTypes: any = {}): string => {
    const merged = mergeEquipmentTypes(customTypes);
    const categoryData = merged[category as keyof typeof merged];
    const equipmentData = categoryData?.[equipment as keyof typeof categoryData];
    
    // If it's an object (custom equipment), return the description property
    if (typeof equipmentData === 'object' && equipmentData !== null) {
      return equipmentData.description || '';
    }
    
    // If it's a string (default equipment), return it directly
    return equipmentData || '';
  };
  
  export const isCustomEquipment = (category: string, equipment: string, customTypes: any = {}): boolean => {
    return customTypes[category]?.[equipment]?.custom === true;
  };