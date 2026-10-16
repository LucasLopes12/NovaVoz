import { useEffect, useRef } from 'react';
import { Animated, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const UOL_REPORT_URL = 'https://www.uol.com.br/tilt/noticias/redacao/2026/09/29/estudo-liga-mais-tempo-de-tela-a-pior-desempenho-escolar-e-linguagem.ghtm';
const VEJA_REPORT_URL = 'https://veja.abril.com.br/economia/brasileiros-passam-dois-tercos-da-vida-na-internet-e-lideram-uso-de-ia-aponta-estudo/';

const animatedEntrance = (value) => ({
    opacity: value,
    transform: [{
        translateY: value.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 0],
        }),
    }],
});

export default function WhyScreen({ palette, onContinue }) {
    const titleProgress = useRef(new Animated.Value(0)).current;
    const leadProgress = useRef(new Animated.Value(0)).current;
    const usageProgress = useRef(new Animated.Value(0)).current;
    const impactProgress = useRef(new Animated.Value(0)).current;
    const purposeProgress = useRef(new Animated.Value(0)).current;
    const buttonProgress = useRef(new Animated.Value(0)).current;
    const styles = createStyles(palette);

    useEffect(() => {
        const entrance = Animated.stagger(135, [
            titleProgress,
            leadProgress,
            usageProgress,
            impactProgress,
            purposeProgress,
            buttonProgress,
        ].map((value) => Animated.timing(value, {
            toValue: 1,
            duration: 560,
            useNativeDriver: true,
        })));

        entrance.start();
        return () => entrance.stop();
    }, [buttonProgress, impactProgress, leadProgress, purposeProgress, titleProgress, usageProgress]);

    return (
        <View style={styles.page}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View style={animatedEntrance(titleProgress)}>
                    <Text accessibilityRole="header" style={styles.title}>Por que isso importa?</Text>
                </Animated.View>

                <Animated.View style={animatedEntrance(leadProgress)}>
                    <Text style={styles.lead}>
                        Porque o tempo diante das telas também ocupa o espaço das experiências que desenvolvem nossa fala, nossa escuta e nossa confiança.
                    </Text>
                </Animated.View>

                <View style={styles.evidenceList}>
                    <Animated.View style={[styles.evidenceCard, animatedEntrance(usageProgress)]}>
                        <Text style={styles.evidenceNumber}>116 horas</Text>
                        <Text style={styles.evidenceText}>
                            É o tempo que o brasileiro médio passa conectado por semana, segundo levantamento citado pela VEJA. Só as redes sociais ocupam, em média, 12 horas e 19 minutos semanais.
                        </Text>
                        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(VEJA_REPORT_URL)}>
                            <Text style={styles.sourceLink}>Ler reportagem da VEJA ↗</Text>
                        </Pressable>
                    </Animated.View>

                    <Animated.View style={[styles.evidenceCard, animatedEntrance(impactProgress)]}>
                        <Text style={styles.evidenceNumber}>2,8 milhões</Text>
                        <Text style={styles.evidenceText}>
                            Uma revisão com dados de crianças em 64 países associou maior exposição a telas a desempenho acadêmico geral mais baixo, linguagem mais limitada e dificuldades socioemocionais. O estudo aponta associação, não causa direta.
                        </Text>
                        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(UOL_REPORT_URL)}>
                            <Text style={styles.sourceLink}>Ler reportagem do UOL ↗</Text>
                        </Pressable>
                    </Animated.View>
                </View>

                <Animated.View style={[styles.purposeCard, animatedEntrance(purposeProgress)]}>
                    <Text style={styles.purposeText}>
                        O NovaVoz não quer tirar a tecnologia da sua vida. Quer usá-la como uma ponte para você voltar ao mundo real.
                    </Text>
                </Animated.View>

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
            </ScrollView>
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: palette.background,
    },
    content: {
        flexGrow: 1,
        width: '100%',
        maxWidth: 760,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 70,
        paddingBottom: 38,
    },
    title: {
        color: palette.textPrimary,
        fontSize: 40,
        lineHeight: 48,
        fontWeight: '900',
        letterSpacing: -1.1,
        textAlign: 'center',
    },
    lead: {
        color: palette.textSecondary,
        fontSize: 17,
        lineHeight: 27,
        fontWeight: '600',
        textAlign: 'center',
        maxWidth: 630,
        alignSelf: 'center',
        marginTop: 16,
    },
    evidenceList: {
        gap: 12,
        marginTop: 26,
    },
    evidenceCard: {
        backgroundColor: palette.surface,
        borderWidth: 2,
        borderColor: palette.border,
        borderLeftWidth: 6,
        borderLeftColor: palette.info,
        borderRadius: 18,
        padding: 17,
    },
    evidenceNumber: {
        color: palette.textPrimary,
        fontSize: 23,
        lineHeight: 28,
        fontWeight: '900',
    },
    evidenceText: {
        color: palette.textSecondary,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '600',
        marginTop: 5,
    },
    sourceLink: {
        color: palette.info,
        fontSize: 12,
        fontWeight: '900',
        marginTop: 10,
    },
    purposeCard: {
        backgroundColor: palette.accentSoft,
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 15,
        marginTop: 14,
    },
    purposeText: {
        color: palette.accentStrong,
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '800',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 460,
        alignSelf: 'center',
        marginTop: 24,
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
