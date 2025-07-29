import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  
  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    isAdmin: auth.user?.role === 'admin',
    isCustomer: auth.user?.role === 'customer',
  };
};