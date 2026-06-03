export type ViewType = 'dashboard' | 'partners' | 'facilities' | 'reports';

export interface LayoutProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}
