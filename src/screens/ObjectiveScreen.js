import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const animatedEntrance = (value) => ({
    opacity: value,
    transform: [{
        translateY: value.interpolate({
            inputRange: [0, 1],
            outputRange: [18, 0],
        }),
    }],
});

export default function ObjectiveScreen({ palette, onContinue }) {
    const titleProgress = useRef(new Animated.Value(0)).current;
    const messageProgress = useRef(new Animated.Value(0)).current;
    const buttonProgress = useRef(new Animated.Value(0)).current;
    const styles = createStyles(palette);

    useEffect(() => {
        const entrance = Animated.stagger(190, [
            Animated.timing(titleProgress, {
                toValue: 1,
                duration: 650,
                useNativeDriver: true,
            }),
            Animated.timing(messageProgress, {
                toValue: 1,
                duration: 650,
                useNativeDriver: true,
            }),
            Animated.timing(buttonProgress, {
                toValue: 1,
                duration: 650,
                useNativeDriver: true,
            }),
        ]);

        entrance.start();
        return () => entrance.stop();
    }, [buttonProgress, messageProgress, titleProgress]);

    return (
        <View style={styles.page}>
            <StatusBar style="dark" />
            <View style={styles.content}>
                <View style={styles.copy}>
                    <Animated.View style={animatedEntrance(titleProgress)}>
                        <Text accessibilityRole="header" style={styles.title}>Qual o nosso objetivo?</Text>
                    </Animated.View>

                    <Animated.View style={animatedEntrance(messageProgress)}>
                        <Text style={styles.message}>
                            Em um mundo que te empurra redes sociais, disputa pela sua atenção e, principalmente, te força a ficar socialmente afastado das pessoas, nós andamos no caminho oposto, te colocando em uma posição que é, sobretudo, humana: falar com pessoas e falar bem!
                        </Text>
                    </Animated.View>
                </View>

                <Animated.View style={[styles.buttonContainer, animatedEntrance(buttonProgress)]}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Continuar"
                        onPress={onContinue}
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                    >
                        <Text style={styles.buttonText}>Continuar</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        flex: 1,
        width: '100%',
        maxWidth: 760,
        alignSelf: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 26,
        paddingTop: 110,
        paddingBottom: 42,
    },
    copy: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 48,
    },
    title: {
        color: palette.textPrimary,
        fontSize: 43,
        lineHeight: 51,
        fontWeight: '900',
        letterSpacing: -1.2,
        textAlign: 'center',
    },
    message: {
        color: palette.textSecondary,
        fontSize: 18,
        lineHeight: 29,
        fontWeight: '600',
        textAlign: 'center',
        maxWidth: 650,
        alignSelf: 'center',
        marginTop: 22,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 460,
        alignSelf: 'center',
    },
    button: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.accent,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: palette.accentStrong,
    },
    buttonPressed: {
        transform: [{ translateY: 3 }],
        borderBottomWidth: 2,
    },
    buttonText: {
        color: palette.onAccent,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
});
