import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const useToken = () => {
  const { isAuthenticated, isLoading, getIdTokenClaims, user } = useAuth0();
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    const getToken = async () => {
      try {
        const { __raw: jwtToken } = await getIdTokenClaims();
        setToken(jwtToken);
        if (user?.sub) {
          localStorage.setItem('userId', user.sub);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    if (isAuthenticated && !token) {
      void getToken();
    }
    if (!isAuthenticated) {
      localStorage.removeItem('userId');
    }
  }, [isAuthenticated, getIdTokenClaims, user, token]);

  return { token, isLoading };
};

export default useToken;
