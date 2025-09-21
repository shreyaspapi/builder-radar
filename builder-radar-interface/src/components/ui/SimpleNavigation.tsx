import { useState } from 'react';

type NavTab = 'home' | 'profile' | 'builders';

interface SimpleNavigationProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

/**
 * Simple navigation component for the BuildInPublic Mini App
 *
 * Features:
 * - Three main navigation tabs: Home, Profile, Builders
 * - Active tab highlighting
 * - Responsive design
 * - Consistent with wireframe design
 */
export function SimpleNavigation({
  activeTab = 'home',
  onTabChange,
}: SimpleNavigationProps) {
  const [currentTab, setCurrentTab] = useState<NavTab>(activeTab);

  const handleTabClick = (tab: NavTab) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const getTabStyle = (tab: NavTab) => {
    const isActive = currentTab === tab;
    return `px-4 py-2 rounded-md w-full font-medium transition-all duration-200 ${
      isActive ? 'bg-primary text-secondary' : 'text-primary'
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary dark:bg-secondary-dark border-t border-primary/10 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <div className="w-full bg-white/70 border border-primary/10 rounded-lg p-1 gap-1 flex justify-around">
            <button
              onClick={() => handleTabClick('home')}
              className={getTabStyle('home')}
            >
              Home
            </button>
            <button
              onClick={() => handleTabClick('builders')}
              className={getTabStyle('builders')}
            >
              Builders
            </button>
            <button
              onClick={() => handleTabClick('profile')}
              className={getTabStyle('profile')}
            >
              Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
