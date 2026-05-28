import { useRef } from 'react';
import { Text, StyleSheet, Pressable, Animated } from "react-native";
import { useThemePalette } from '../theme/themeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TaskCard({ title, skill, difficulty, completed, onPress, onToggleTask, skillColor }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const cardColor = skillColor || palette.surface;
    const toggleScale = useRef(new Animated.Value(1)).current;

    const animatePress = (animatedValue, shouldPress) => {
        Animated.spring(animatedValue, {
            toValue: shouldPress ? 0.96 : 1,
            speed: 24,
            useNativeDriver: true,
        }).start();
    };

    const handleToggle = (event) => {
        if (event?.stopPropagation) {
            event.stopPropagation();
        }

        onToggleTask?.();
    };

    return (
        <Pressable
            style={[
                styles.card,
                {
                    backgroundColor: cardColor,
                    borderColor: skillColor || palette.border,
                },
            ]}
            onPress={onPress}
        >
            <Text style={styles.title}> {title} </Text>

            <Text style={[styles.skill, { color: 'white' }]}> Habilidade: {skill} </Text>
            <Text style={styles.difficulty}> Dificuldade: {difficulty ? `${difficulty}/5` : '—'} </Text>

            <AnimatedPressable
                style={[
                    styles.toggleButton,
                    {
                        transform: [{ scale: toggleScale }],
                    },
                ]}
                onPressIn={() => animatePress(toggleScale, true)}
                onPressOut={() => animatePress(toggleScale, false)}
                onPress={handleToggle}
            >
                <Text
                    style={[
                        styles.toggleButtonText,
                        {
                            color: completed ? '#22c55e' : '#facc15',
                        },
                    ]}
                >
                    {completed ? 'Concluída' : 'Pendente'}
                </Text>
            </AnimatedPressable>
        </Pressable>
    );
};

const createStyles = (palette) => StyleSheet.create({
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    skill: {
        fontSize: 16,
        fontWeight: '600',
    },
    difficulty: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#fffaf5',
    },
    toggleButton: {
        marginTop: 14,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: 'flex-start',
        backgroundColor: '#fffaf5',
        borderWidth: 1,
        borderColor: 'black',
    },
    toggleButtonText: {
        color: '#fffaf5',
        fontSize: 12,
        fontWeight: 'bold',
    }
});