import { createTheme } from '@mui/material/styles';

const userTheme = createTheme({
    palette: {
        primary: {
            main: '#388e3c',
            light: '#6abf69',
            dark: '#00600f',
        },
        secondary: {
            main: '#f4511e',
            light: '#ff844c',
            dark: '#b91400',
        },
        background: {
            default: '#f1f8e9',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
});

const staffTheme = createTheme({
    palette: {
        primary: {
            main: '#000',
            light: '#ffffff',
            dark: '#393646',
        },
        secondary: {
            main: '#388e3c',
            light: '#6abf69',
            dark: '#00600f',
        },
        background: {
            default: '#e8f5e9',
            paper: '#ffffff',
        },
        text: {
            primary: '#1b5e20',
            secondary: '#33691e',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ffa000',
        },
        info: {
            main: '#1976d2',
        },
        success: {
            main: '#388e3c',
        },
    },
});

export { userTheme, staffTheme };
