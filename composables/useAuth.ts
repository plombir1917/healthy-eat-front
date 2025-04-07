export const useAuth = () => {
  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const removeToken = () => {
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  return {
    setToken,
    getToken,
    removeToken,
    isAuthenticated,
  };
};
