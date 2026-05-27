const coral = '#FF7F50';
const coralDark = '#E96A3B';

export const darkPalette = {
    background: '#000000',
    surface: '#1A120F',
    surfaceSoft: '#241915',
    border: '#4A2B22',
    textPrimary: '#fff8f5',
    textSecondary: '#f4c4b3',
    accent: coral,
    accentSoft: 'rgba(255, 127, 80, 0.28)',
    accentStrong: coralDark,
    brand: coral,
    success: '#22c55e',
    warning: '#fbbf24',
    skillColors: {
        Confiança: '#22c55e',
        Verbalização: '#0ea5e9',
        Extroversão: '#f59e0b',
        Oratória: '#fb7185',
        Coragem: '#8b5cf6',
        Empatia: '#14b8a6',
        Comunicação: '#6366f1',
    },
};

export const lightPalette = {
    background: '#fff8f5',
    surface: coral,
    surfaceSoft: '#ffd2bf',
    border: '#ffb39b',
    textPrimary: '#2f140f',
    textSecondary: '#6f2d21',
    accent: coral,
    accentSoft: 'rgba(255, 127, 80, 0.24)',
    accentStrong: coralDark,
    brand: coral,
    success: '#16a34a',
    warning: '#d97706',
    skillColors: {
        Confiança: '#22c55e',
        Verbalização: '#0ea5e9',
        Extroversão: '#f59e0b',
        Oratória: '#fb7185',
        Coragem: '#8b5cf6',
        Empatia: '#14b8a6',
        Comunicação: '#6366f1',
    },
};

export const paletteThemes = {
    dark: darkPalette,
    light: lightPalette,
};

export const palette = darkPalette;

export function getPalette(themeName = 'dark') {
    return paletteThemes[themeName] || darkPalette;
}

export function getSkillColor(skillName, fallback = palette.accent) {
    return palette.skillColors[skillName] || fallback;
}

function hexToRgb(hex) {
    const normalized = hex.replace('#', '');
    const bigint = Number(`0x${normalized}`);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

export function getSkillColorWithAlpha(skillName, alpha, fallback = palette.accent) {
    const color = getSkillColor(skillName, fallback);
    const { r, g, b } = hexToRgb(color);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
