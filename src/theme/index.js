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
            contrastText: '#ffffff',
            main: '#5664d2'
        },
        text: {
            primary: '#172b4d',
            secondary: '#6b778c'
        }
    },
    shadows,
    typography
};

const darkTheme = {
    palette: {
        background: {
            default: '#004D40',
            primary: '#004D40',
            paper: '#00695C'
        },
        primary: {
            contrastText: '#B2DFDB',
            main: '#00897B' // Status bar
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
