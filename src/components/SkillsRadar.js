import Svg, {
    Polygon,
    Line,
    Circle,
    Text as SvgText
} from 'react-native-svg';
import React from 'react';

export function SkillsRadar({
    skills
}) {
    const size = 300;
    const center = size / 2;
    const maxRadius = 100;

    const points = skills.map(
        (skill, index) => {

            const angle =
                (Math.PI * 2 * index)
                / skills.length
                - Math.PI / 2;
            const radius =
                ((skill.progress || 0) / 100)
                * maxRadius;

            const x =
                center
                + radius * Math.cos(angle);

            const y =
                center
                + radius * Math.sin(angle);

            return `${x},${y}`;
        });
    console.log(points)
    return (
        <Svg
            width={size}
            height={size}
            style={{
                backgroundColor: 'red',
            }}
        >
            <Polygon
                points={points.join(' ')}
                fill='rgba(0, 200, 255, 0.4)'
                stroke='cyan'
                strokeWidth='3'
            />
        </Svg>
    )
};