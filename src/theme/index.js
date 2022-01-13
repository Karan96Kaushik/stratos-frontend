import {createMuiTheme, colors} from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const lightTheme = {
    palette: {
        background: {
            default: '#F4F6F8',
            paper: colors.common.white
        },
        primary: {
            contrastText: '#f5cc5a',
            main: '#2e2528'
        },
        text: {
            primary: '#172b4d',
            secondary: '#6b778c',
            tertiary: '#f5cc5a',
        }
    },
    shadows,
    typography
};

const darkTheme = {
    palette: {
        background: {
            default: '#868d99',
            primary: '#f5cc5a',
            paper: '#00695C'
        },
        primary: {
            contrastText: '#f5cc5a',
            main: '#2e2528' // Status bar
        },
        text: {
            primary: '#4DB6AC',
            secondary: '#80CBC4'
        }
    },
    shadows,
    typography
};

const theme = createMuiTheme(0 ? darkTheme : lightTheme);

export default theme;
