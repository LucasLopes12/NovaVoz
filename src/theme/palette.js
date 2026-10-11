const skillColors = {
    Confiança: '#58CC02',
    Verbalização: '#1CB0F6',
    Extroversão: '#FFC800',
    Oratória: '#FF6B6B',
    Coragem: '#A560E8',
    Empatia: '#FF9600',
};

export const lightPalette = {
    background: '#F7F7F7', surface: '#FFFFFF', surfaceSoft: '#F0F2F4', border: '#E5E5E5',
    textPrimary: '#3C3C3C', textSecondary: '#777777', accent: '#58CC02', accentSoft: '#DDF4D1',
    accentStrong: '#46A302', brand: '#58CC02', onAccent: '#FFFFFF', success: '#58CC02',
    warning: '#FFC800', info: '#1CB0F6', danger: '#FF4B4B', shadow: '#D7D7D7', skillColors,
};

export const darkPalette = {
    background: '#171717', surface: '#242424', surfaceSoft: '#303030', border: '#3D3D3D',
    textPrimary: '#F7F7F7', textSecondary: '#B7B7B7', accent: '#58CC02', accentSoft: '#29471B',
    accentStrong: '#46A302', brand: '#58CC02', onAccent: '#FFFFFF', success: '#58CC02',
    warning: '#FFC800', info: '#1CB0F6', danger: '#FF4B4B', shadow: '#0F0F0F', skillColors,
};

export const paletteThemes = { dark: darkPalette, light: lightPalette };
export const palette = lightPalette;

export function getPalette(themeName = 'light') {
    return paletteThemes[themeName] || lightPalette;
}

export function getSkillColor(skillName, fallback = palette.accent) {
    return skillColors[skillName] || fallback;
}

function hexToRgb(hex) {
    const bigint = Number.parseInt(hex.replace('#', ''), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

export function getSkillColorWithAlpha(skillName, alpha, fallback = palette.accent) {
    const { r, g, b } = hexToRgb(getSkillColor(skillName, fallback));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
