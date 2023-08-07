import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';


export const tokens = (mode) => ({
    ...(mode === 'dark' ? {
        cosmicLatte: {
            100: "#fdfdf9",
            200: "#fcfaf4",
            300: "#faf8ee",
            400: "#f9f5e9",
            500: "#f7f3e3",
            600: "#c6c2b6",
            700: "#949288",
            800: "#63615b",
            900: "#31312d"
        },
        orangeCrayola: {
            100: "#ffe5d9",
            200: "#ffcbb4",
            300: "#ffb18e",
            400: "#ff9769",
            500: "#ff7d43",
            600: "#cc6436",
            700: "#994b28",
            800: "#66321b",
            900: "#33190d"
        },
        munsell: {
            100: "#d7e7ea",
            200: "#afcfd5",
            300: "#88b6c1",
            400: "#609eac",
            500: "#388697",
            600: "#2d6b79",
            700: "#22505b",
            800: "#16363c",
            900: "#0b1b1e"
        },
        spaceCadet: {
            100: "#d0d2d9",
            200: "#a1a5b2",
            300: "#73788c",
            400: "#444b65",
            500: "#151e3f",
            600: "#111832",
            700: "#0d1226",
            800: "#080c19",
            900: "#04060d"
        },
        ghostWhite: {
            100: "#fdfeff",
            200: "#fbfdff",
            300: "#fafbfe",
            400: "#f8fafe",
            500: "#f6f9fe",
            600: "#c5c7cb",
            700: "#949598",
            800: "#626466",
            900: "#313233"
        },
        magenta: {
            100: "#ebd7dd",
            200: "#d6b0bb",
            300: "#c28899",
            400: "#ad6177",
            500: "#993955",
            600: "#7a2e44",
            700: "#5c2233",
            800: "#3d1722",
            900: "#1f0b11"
        },
        bleuDeFrance: {
          100: "#d4e7fc",
          200: "#a9cff9",
          300: "#7fb7f6",
          400: "#549ff3",
          500: "#2987f0",
          600: "#216cc0",
          700: "#195190",
          800: "#103660",
          900: "#081b30"
        },
        richBlack: {
            100: "#d0d1d3",
            200: "#a2a4a7",
            300: "#73767a",
            400: "#45494e",
            500: "#161b22",
            600: "#12161b",
            700: "#0d1014",
            800: "#090b0e",
            900: "#040507"
        },
    } : {
        cosmicLatte: {
            100: "#31312d",
            200: "#63615b",
            300: "#949288",
            400: "#c6c2b6",
            500: "#f7f3e3",
            600: "#f9f5e9",
            700: "#faf8ee",
            800: "#fcfaf4",
            900: "#fdfdf9",
        },
        orangeCrayola: {
            100: "#33190d",
            200: "#66321b",
            300: "#994b28",
            400: "#cc6436",
            500: "#ff7d43",
            600: "#ff9769",
            700: "#ffb18e",
            800: "#ffcbb4",
            900: "#ffe5d9",
        },
        munsell: {
            100: "#0b1b1e",
            200: "#16363c",
            300: "#22505b",
            400: "#2d6b79",
            500: "#388697",
            600: "#609eac",
            700: "#88b6c1",
            800: "#afcfd5",
            900: "#d7e7ea",
        },
        spaceCadet: {
            100: "#04060d",
            200: "#080c19",
            300: "#0d1226",
            400: "#111832",
            500: "#151e3f",
            600: "#444b65",
            700: "#73788c",
            800: "#a1a5b2",
            900: "#d0d2d9",
        },
        ghostWhite: {
            100: "#313233",
            200: "#626466",
            300: "#949598",
            400: "#c5c7cb",
            500: "#f6f9fe",
            600: "#f8fafe",
            700: "#fafbfe",
            800: "#fbfdff",
            900: "#fdfeff",
        },
        magenta: {
            100: "#1f0b11",
            200: "#3d1722",
            300: "#5c2233",
            400: "#7a2e44",
            500: "#993955",
            600: "#ad6177",
            700: "#c28899",
            800: "#d6b0bb",
            900: "#ebd7dd",
        },
        bleuDeFrance: {
            100: "#081b30",
            200: "#103660",
            300: "#195190",
            400: "#216cc0",
            500: "#2987f0",
            600: "#549ff3",
            700: "#7fb7f6",
            800: "#a9cff9",
            900: "#d4e7fc",
        },
        richBlack: {
            100: "#040507",
            200: "#090b0e",
            300: "#0d1014",
            400: "#12161b",
            500: "#161b22",
            600: "#45494e",
            700: "#73767a",
            800: "#a2a4a7",
            900: "#d0d1d3",
        },
    })
});

// MUI Theme Settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === 'light' 
            ? {
                primary: {
                    main: colors.bleuDeFrance[500]
                },
                secondary: {
                    main: colors.munsell[500]
                },
                neutral: {
                    dark: colors.cosmicLatte[700],
                    main: colors.orangeCrayola[500],
                    light: colors.ghostWhite[400]
                },
                background: {
                    default: colors.ghostWhite[500],
                    auth: colors.munsell[500]
                }
            } : {
                primary: {
                    // main: '#ffffff'
                    main: colors.cosmicLatte[500]
                },
                secondary: {
                    main: colors.magenta[500]
                },
                neutral: {
                    dark: colors.cosmicLatte[700],
                    main: colors.orangeCrayola[500],
                    light: colors.ghostWhite[100]
                },
                background: {
                    default: colors.richBlack[500],
                },
                text: {
                    primary: colors.cosmicLatte[500]
                }
            }
            )
        }
    }
}

// Context For Color Mode
export const ColorModeContext = createContext({
    toggleColorMode: () => {}
});

export const useMode = () => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
        }), []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return [theme, colorMode];
}