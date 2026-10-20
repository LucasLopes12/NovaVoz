import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getSkillColor } from '../theme/palette';
import { useThemePalette } from '../theme/themeContext';

const NODE_SIZE = 72;
const ROW_HEIGHT = 142;
const TOP_PADDING = 58;
const LABEL_WIDTH = 164;
const PATH_PATTERN = [0.5, 0.25, 0.18, 0.37, 0.69, 0.82, 0.64, 0.34];

const getPosition = (index, width) => ({
    x: Math.max(NODE_SIZE / 2 + 10, Math.min(width - NODE_SIZE / 2 - 10, width * PATH_PATTERN[index % PATH_PATTERN.length])),
    y: TOP_PADDING + index * ROW_HEIGHT,
});

const getSegment = (start, end) => {
    const controlOffset = (end.y - start.y) * 0.48;
    return `M ${start.x} ${start.y} C ${start.x} ${start.y + controlOffset}, ${end.x} ${end.y - controlOffset}, ${end.x} ${end.y}`;
};

function JourneyNode({ task, index, position, pathWidth, isCurrent, isLocked, onPress }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const pulse = useRef(new Animated.Value(0)).current;
    const color = getSkillColor(task.skill);
    const nodeColor = task.completed ? palette.success : isLocked ? palette.surfaceSoft : color;
    const labelLeft = Math.max(4, Math.min(pathWidth - LABEL_WIDTH - 4, position.x - LABEL_WIDTH / 2));

    useEffect(() => {
        if (!isCurrent) {
            pulse.setValue(0);
            return undefined;
        }

        const animation = Animated.loop(Animated.sequence([
            Animated.timing(pulse, { toValue: 1, duration: 950, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.delay(280),
        ]));
        animation.start();
        return () => animation.stop();
    }, [isCurrent, pulse]);

    const statusLabel = task.completed ? 'Concluída' : isCurrent ? 'Disponível agora' : 'Bloqueada';

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {isCurrent && (
                <View style={[styles.currentTag, { left: position.x - 31, top: position.y - 55 }]}>
                    <Text style={styles.currentTagText}>AGORA</Text>
                </View>
            )}

            <View style={[styles.nodePosition, { left: position.x - NODE_SIZE / 2, top: position.y - NODE_SIZE / 2 }]}>
                {isCurrent && (
                    <Animated.View pointerEvents="none" style={[styles.pulseRing, {
                        borderColor: color,
                        opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.42, 0] }),
                        transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.42] }) }],
                    }]} />
                )}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Missão ${index + 1}: ${task.title}. ${statusLabel}`}
                    accessibilityState={{ disabled: isLocked, selected: isCurrent }}
                    disabled={isLocked}
                    onPress={() => onPress(task)}
                    style={({ pressed }) => [
                        styles.node,
                        { backgroundColor: nodeColor, borderBottomColor: isLocked ? palette.shadow : palette.accentStrong },
                        isLocked && styles.lockedNode,
                        pressed && styles.pressedNode,
                    ]}
                >
                    <Text style={[styles.nodeText, isLocked && styles.lockedNodeText]}>
                        {task.completed ? '✓' : isLocked ? '•' : index + 1}
                    </Text>
                </Pressable>
            </View>

            <View pointerEvents="none" style={[styles.label, {
                left: labelLeft,
                top: position.y + NODE_SIZE / 2 + 8,
                borderColor: isCurrent ? color : palette.border,
            }]}>
                <Text numberOfLines={2} style={[styles.taskTitle, isLocked && styles.lockedText]}>{task.title}</Text>
                <Text style={[styles.skillLabel, { color: isLocked ? palette.textSecondary : color }]}>
                    {task.completed ? 'CONCLUÍDA' : isLocked ? 'BLOQUEADA' : task.skill.toUpperCase()}
                </Text>
            </View>
        </View>
    );
}

export default function LearningPath({ tasks, currentTaskId, onTaskPress }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const [pathWidth, setPathWidth] = useState(340);
    const levelComplete = tasks.length > 0 && tasks.every((task) => task.completed);
    const activeIndex = tasks.findIndex((task) => String(task.id) === String(currentTaskId));
    const bottomPadding = levelComplete ? 128 : 68;
    const height = Math.max(180, TOP_PADDING * 2 + Math.max(0, tasks.length - 1) * ROW_HEIGHT + bottomPadding);
    const positions = tasks.map((_, index) => getPosition(index, pathWidth));

    return (
        <View
            accessibilityLabel="Trilha de aprendizagem"
            onLayout={(event) => setPathWidth(event.nativeEvent.layout.width)}
            style={[styles.pathContainer, { height }]}
        >
            <Svg pointerEvents="none" width={pathWidth} height={height} style={styles.pathSvg}>
                {positions.slice(0, -1).map((position, index) => {
                    const segment = getSegment(position, positions[index + 1]);
                    return (
                        <Path key={`base-${tasks[index].id}`} d={segment} fill="none" stroke={palette.border}
                            strokeWidth={10} strokeLinecap="round" />
                    );
                })}
                {positions.slice(0, -1).map((position, index) => {
                    if (!tasks[index].completed) return null;
                    const segment = getSegment(position, positions[index + 1]);
                    return (
                        <Path key={`progress-${tasks[index].id}`} d={segment} fill="none" stroke={palette.success}
                            strokeWidth={10} strokeLinecap="round" />
                    );
                })}
            </Svg>

            {tasks.map((task, index) => (
                <JourneyNode
                    key={task.id}
                    task={task}
                    index={index}
                    position={positions[index]}
                    pathWidth={pathWidth}
                    isCurrent={index === activeIndex}
                    isLocked={!task.completed && index !== activeIndex}
                    onPress={onTaskPress}
                />
            ))}

            {levelComplete && (
                <View style={[styles.finishCard, { top: height - 54 }]}>
                    <Text style={styles.finishText}>Trilha completa! 🎉</Text>
                </View>
            )}
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    pathContainer: { width: '100%', position: 'relative', overflow: 'hidden' },
    pathSvg: { position: 'absolute', left: 0, top: 0 },
    nodePosition: { position: 'absolute', width: NODE_SIZE, height: NODE_SIZE },
    node: { width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2, alignItems: 'center',
        justifyContent: 'center', borderWidth: 4, borderColor: palette.surface, borderBottomWidth: 9 },
    pressedNode: { transform: [{ translateY: 4 }], borderBottomWidth: 5 },
    lockedNode: { borderColor: palette.background },
    nodeText: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
    lockedNodeText: { color: palette.textSecondary, fontSize: 30, lineHeight: 30 },
    pulseRing: { position: 'absolute', left: -5, top: -5, width: NODE_SIZE + 10, height: NODE_SIZE + 10,
        borderRadius: (NODE_SIZE + 10) / 2, borderWidth: 4 },
    currentTag: { position: 'absolute', width: 62, alignItems: 'center', backgroundColor: palette.textPrimary,
        paddingVertical: 5, borderRadius: 8, zIndex: 4 },
    currentTagText: { color: palette.surface, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
    label: { position: 'absolute', width: LABEL_WIDTH, minHeight: 55, backgroundColor: palette.surface,
        borderWidth: 2, borderBottomWidth: 4, borderBottomColor: palette.shadow, borderRadius: 13,
        paddingHorizontal: 10, paddingVertical: 7, alignItems: 'center', zIndex: 3 },
    taskTitle: { color: palette.textPrimary, fontSize: 12, lineHeight: 15, fontWeight: '800', textAlign: 'center' },
    lockedText: { color: palette.textSecondary },
    skillLabel: { fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.7, marginTop: 3 },
    finishCard: { position: 'absolute', alignSelf: 'center', backgroundColor: palette.accentSoft,
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9 },
    finishText: { color: palette.accentStrong, fontWeight: '900', fontSize: 13 },
});
