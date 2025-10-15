import { useAuth } from '../hooks/useAuth';

export const useSmartNavigation = () => {
  const { isAuthenticated } = useAuth();

  const navigateToHomeOrFirst = (onNavigate: (screen: any) => void) => {
    if (isAuthenticated) {
      onNavigate("home");
    } else {
      onNavigate("firstpage");
    }
  };

  return { navigateToHomeOrFirst };
};
