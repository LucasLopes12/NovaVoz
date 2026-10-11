import React from 'react';
import Svg, { Circle, Image as SvgImage, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { useThemePalette } from '../theme/themeContext';

const skillImageMap = {
    Confiança: require('../../assets/ESMERALDPIXELART.png'),
    Verbalização: require('../../assets/DIAMONDPIXELART.png'),
    Extroversão: require('../../assets/GOLDPIXELART.png'),
    Oratória: require('../../assets/ROSERUBIPIXELART.png'),
    Coragem: require('../../assets/PURPLERUBIAPIXELART.png'),
    Empatia: require('../../assets/ORANGEPIXELART.png'),
};

export function SkillsRadar({ skills }) {
    const { palette } = useThemePalette();
    const size = 320;
    const center = size / 2;
    const maxRadius = 94;
    const labelRadius = 124;
    const getPoint = (radius, index) => {
        const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
        return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle), angle };
    };
    const points = skills.map((skill, index) => ({
        ...getPoint((Math.min(100, Math.max(0, skill.progress || 0)) / 100) * maxRadius, index),
        label: getPoint(labelRadius, index),
        axis: getPoint(maxRadius, index),
        name: skill.name,
    }));

    return (
        <Svg width="100%" height={320} viewBox={`0 0 ${size} ${size}`}>
            {[0.25, 0.5, 0.75, 1].map((scale) => (
                <Circle key={scale} cx={center} cy={center} r={maxRadius * scale}
                    fill="none" stroke={palette.border} strokeWidth="1.5" />
            ))}
            {points.map((point, index) => (
                <Line key={`axis-${index}`} x1={center} y1={center} x2={point.axis.x} y2={point.axis.y}
                    stroke={palette.border} strokeWidth="1.5" />
            ))}
            <Polygon points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                fill={palette.accentSoft} stroke={palette.accent} strokeWidth="3" />
            {points.map((point, index) => (
                <React.Fragment key={point.name}>
                    <SvgImage href={skillImageMap[point.name]} x={point.label.x - 15} y={point.label.y - 25} width="30" height="30" />
                    <SvgText x={point.label.x} y={point.label.y + 16} fill={palette.skillColors[point.name] || palette.textPrimary}
                        fontSize="9" fontWeight="800" textAnchor="middle">{point.name}</SvgText>
                </React.Fragment>
            ))}
        </Svg>
    );
}
