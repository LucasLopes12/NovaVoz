import Svg, {
    Polygon,
    Line,
    Circle,
    Text as SvgText,
    Image as SvgImage,
} from 'react-native-svg';
import React from 'react';
import { useThemePalette } from '../theme/themeContext';

const skillImageMap = {
    'Confiança': require('../../assets/ESMERALDPIXELART.png'),
    'Verbalização': require('../../assets/DIAMONDPIXELART.png'),
    'Extroversão': require('../../assets/GOLDPIXELART.png'),
    'Oratória': require('../../assets/ROSERUBIPIXELART.png'),
    'Coragem': require('../../assets/PURPLERUBIAPIXELART.png'),
    'Empatia': require('../../assets/ORANGEPIXELART.png'),
};

export function SkillsRadar({
    skills
}) {
    const { palette } = useThemePalette();
    const size = 360;
    const center = size / 2;
    const maxRadius = 100;
    const labelRadius = maxRadius + 32;

    const skillPoints = skills.map((skill, index) => {
        const angle =
            (Math.PI * 2 * index)
            / skills.length
            - Math.PI / 2;
        const radius =
            ((skill.progress || 0) / 100)
            * maxRadius;

        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const labelX = center + labelRadius * Math.cos(angle);
        const labelY = center + labelRadius * Math.sin(angle);

        return {
            x,
            y,
            labelX,
            labelY,
            angle,
            name: skill.name || `Skill ${index + 1}`,
        };
    });

    const polygonPoints = skillPoints.map((point) => `${point.x},${point.y}`).join(' ');

    return (
        <Svg
            width={size}
            height={size}
            style={{
                backgroundColor: 'transparent',
            }}
        >
            {skillPoints.map((point, index) => (
                <Line
                    key={`axis-${index}`}
                    x1={center}
                    y1={center}
                    x2={point.x}
                    y2={point.y}
                    stroke={palette.border}
                    strokeWidth="1"
                    opacity="0.5"
                />
            ))}

            <Polygon
                points={polygonPoints}
                fill={palette.accentSoft}
                stroke={palette.accent}
                strokeWidth="3"
            />

            {skillPoints.map((point, index) => {
                const skillImage = skillImageMap[point.name];
                const textColor = palette.skillColors[point.name] || palette.textPrimary;

                return (
                    <React.Fragment key={`skill-node-${index}`}>
                        {skillImage ? (
                            <SvgImage
                                href={skillImage}
                                x={point.labelX - 16}
                                y={point.labelY - 38}
                                width="32"
                                height="32"
                            />
                        ) : null}
                        <SvgText
                            x={point.labelX}
                            y={point.labelY + 18}
                            fill={textColor}
                            fontSize="10"
                            fontWeight="700"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                            {point.name}
                        </SvgText>
                    </React.Fragment>
                )
            })}
        </Svg>
    )
};