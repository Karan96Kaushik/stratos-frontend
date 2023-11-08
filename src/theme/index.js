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
            contrastText: '#eff1fe',
            main: '#0a2260'
        },
        text: {
            primary: '#172b4d',     // Black
            secondary: '#6b778c',   // Red
            tertiary: '#eff1fe',   // Yellow
            quarternary: '#bc3713',   // Red
            quinary: '#3b9d66',   // Green
        }
    },
    shadows,
    typography
};

const devTheme = {
    palette: {
        background: {
            default: '#F4F6F8',
            paper: colors.common.white
        },
        primary: {
            contrastText: '#eff1fe',
            main: '#757575'
        },
        text: {
            primary: '#172b4d',     // Black
            secondary: '#6b778c',   // Red
            tertiary: '#eff1fe',   // Yellow
            quarternary: '#bc3713',   // Red
            quinary: '#3b9d66',   // Green
        }
    },
    shadows,
    typography
};

const darkTheme = {
    palette: {
        background: {
            default: '#868d99',
            primary: '#0a2260',
            paper: '#00695C'
        },
        primary: {
            contrastText: '#0a2260',
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

const theme = createMuiTheme(process.env.NODE_ENV == "development" ? devTheme : lightTheme);

export default theme;
