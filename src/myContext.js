import React from 'react';

const NavBarContext = React.createContext(true);
const LoginContext = React.createContext({
    isLoggedIn:false
});
const LoadingContext = React.createContext({
    isActive:false,
    text: false
});

export { NavBarContext, LoginContext, LoadingContext };
