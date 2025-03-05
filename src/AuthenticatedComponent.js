// AuthenticatedComponent.js
import React from 'react';
import withAuth from './withAuth';

const AuthenticatedComponent = ({ component: Component }) => {
  const Authenticated = () => {
    return <Component />;
  };

  return withAuth(Authenticated);
};

export default AuthenticatedComponent;
