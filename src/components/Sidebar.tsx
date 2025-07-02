import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  BarChart3, 
  Activity,
  Database,
  Footprints,
  TrendingUp,
  Layers,
  Package,
  Target,
  FileText,
  ShoppingCart,
  Settings,
  HelpCircle,
  ChevronDown,
  Upload,
  Calculator
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const menuSections = [
    {
      title: 'Import',
      items: [
        { icon: Upload, label: 'Excel Upload', path: '/excel-upload' },
        { icon: Calculator, label: 'GHG Calculator', path: '/ghg-calculator' }
      ]
    },
    {
      title: 'Measure',
      items: [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: BarChart3, label: 'Measurements', path: '/measurements' },
        { icon: Activity, label: 'Activity data', path: '/activity-data' },
        { icon: Footprints, label: 'Footprints', path: '/footprints' }
      ]
    },
    {
      title: 'Analyze',
      items: [
        { icon: TrendingUp, label: 'Overview', path: '/overview' },
        { icon: Layers, label: 'Drilldown', path: '/drilldown' },
        { icon: Package, label: 'Products and materials', path: '/products-and-materials' },
        { icon: BarChart3, label: 'Supply chain', path: '/supply-chain' },
        { icon: Target, label: 'Benchmarks', path: '/benchmarks' }
      ]
    },
    {
      title: 'Report',
      items: [
        { icon: FileText, label: 'Disclosures & reports', path: '/disclosures-and-reports' }
      ]
    },
    {
      title: 'Plan',
      items: [
        { icon: Target, label: 'Reduction plans', path: '/reduction-plans' },
        { icon: ShoppingCart, label: 'Marketplace', path: '/marketplace' }
      ]
    }
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo - Compact */}
      <div className="p-3 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-13 h-12 flex items-center justify-center">
            <img 
              src="https://i.ibb.co/LXxN14Cy/pngegg.png" 
              alt="KPMG Logo" 
              className="w-13 h-12 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex items-center">
              <h1 className="text-lg font-medium text-white/90 tracking-wide">ClimaSense</h1>
            </div>
          )}
        </div>
      </div>

      {/* User Profile - Compact */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">AM</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Afraz Muneer</p>
              <p className="text-xs text-slate-400">ESG Analyst</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Navigation - Scrollable with Custom Scrollbar */}
      <nav className="flex-1 p-2 overflow-y-auto custom-scrollbar">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-2 py-2 rounded-md transition-colors text-sm ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Navigation - Fixed */}
      <div className="p-2 border-t border-slate-700 flex-shrink-0">
        <ul className="space-y-1">
          {bottomItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-2 px-2 py-2 rounded-md transition-colors text-sm ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;