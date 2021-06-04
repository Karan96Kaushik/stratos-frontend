import React from 'react';

const NavBarContext = React.createContext(true);
const LoginContext = React.createContext({
    isLoggedIn:false
});

export { NavBarContext, LoginContext };
