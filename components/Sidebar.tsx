import React from 'react';
import { Icons } from '../constants';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { view: AppView.STUDIO, label: 'Studio Kreatif', icon: Icons.LightBulb },
    { view: AppView.SCENE_DIRECTOR, label: 'Scene Director', icon: Icons.Film },
    { view: AppView.SCRIPT, label: 'Script & VO', icon: Icons.Microphone },
    { view: AppView.METADATA, label: 'Metadata', icon: Icons.ChartBar },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-20">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
          <span className="font-bold text-zinc-950 text-lg">Z</span>
        </div>
        <h1 className="text-lg font-bold text-zinc-200 tracking-wide">Zumbi Gen</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Production</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-zinc-800 text-orange-500'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-orange-500' : 'text-zinc-500'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* System Menu */}
      <div className="p-3 border-t border-zinc-800">
        <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">System</p>
        <button
          onClick={() => onChangeView(AppView.SETTINGS)}
          className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentView === AppView.SETTINGS
              ? 'bg-zinc-800 text-orange-500'
              : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
          }`}
        >
          <Icons.Cog className={`w-5 h-5 mr-3 ${currentView === AppView.SETTINGS ? 'text-orange-500' : 'text-zinc-500'}`} />
          Settings
        </button>
        
        <div className="mt-4 px-3 flex items-center justify-between text-xs text-zinc-500">
          <span>v1.0.0</span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;