import { createContext, useContext } from 'react';
import { getPalette } from './palette';

export const ThemeContext = createContext({
    themeName: 'dark',
    palette: getPalette('dark'),
    toggleTheme: () => { },
});

export function ThemeProvider({ themeName, toggleTheme, children }) {
    const palette = getPalette(themeName);

    return (
        <ThemeContext.Provider value={{ themeName, palette, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useThemePalette() {
    return useContext(ThemeContext);
};