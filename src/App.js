import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { LoginContext } from "./myContext"
import React, { Component, useContext, useState, useEffect } from 'react';
import { SnackbarProvider } from 'material-ui-snackbar-provider'

const App = () => {

	let dataStore;
	dataStore = JSON.parse(localStorage.getItem("tmsStore"))
	if(!dataStore) {
		dataStore = { isLoggedIn: false }
		localStorage.setItem("tmsStore", JSON.stringify(dataStore))
	}
	var [loginState, setLogin] = useState(dataStore)

	const routing = useRoutes(routes(loginState?.isLoggedIn));

	return (
		<SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
		<LoginContext.Provider value={{ loginState, setLogin }}>
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				{routing}
			</ThemeProvider>
		</LoginContext.Provider>
		</SnackbarProvider>
	);
};

export default App;
