import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const friendlyMessage = (error) => {
    const message = String(error?.message || error || 'Não foi possível continuar.');
    if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (message.includes('already registered')) return 'Este e-mail já possui uma conta.';
    if (message.includes('Password should be')) return 'Sua senha precisa ter pelo menos 6 caracteres.';
    return message;
};

export default function AuthScreen({ palette }) {
    const { signIn, signUp, resetPassword, enterDemo, isConfigured } = useAuth();
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState(null);
    const styles = createStyles(palette);

    const submit = async () => {
        setMessage(null);
        if (!email.trim() || !password) {
            setMessage({ type: 'error', text: 'Preencha seu e-mail e sua senha.' });
            return;
        }
        if (mode === 'signup' && !name.trim()) {
            setMessage({ type: 'error', text: 'Como podemos chamar você?' });
            return;
        }

        setBusy(true);
        try {
            if (mode === 'login') {
                await signIn(email, password);
            } else {
                const result = await signUp(name, email, password);
                if (result.needsEmailConfirmation) {
                    setMessage({ type: 'success', text: 'Conta criada! Confira seu e-mail para confirmar o acesso.' });
                }
            }
        } catch (error) {
            setMessage({ type: 'error', text: friendlyMessage(error) });
        } finally {
            setBusy(false);
        }
    };

    const recover = async () => {
        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Digite seu e-mail primeiro.' });
            return;
        }
        setBusy(true);
        try {
            await resetPassword(email);
            setMessage({ type: 'success', text: 'Enviamos as instruções de recuperação para seu e-mail.' });
        } catch (error) {
            setMessage({ type: 'error', text: friendlyMessage(error) });
        } finally {
            setBusy(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.hero}>
                    <View style={styles.logo}><Text style={styles.logoLetter}>N</Text><View style={styles.logoDot} /></View>
                    <Text style={styles.brand}>NovaVoz</Text>
                    <Text style={styles.headline}>Sua voz merece espaço.</Text>
                    <Text style={styles.subtitle}>Missões curtas, evolução visível e confiança para conversar melhor todos os dias.</Text>
                    <View style={styles.benefits}>
                        <View style={styles.benefit}><Text style={styles.benefitIcon}>⚡</Text><Text style={styles.benefitText}>Ganhe XP</Text></View>
                        <View style={styles.benefit}><Text style={styles.benefitIcon}>🔥</Text><Text style={styles.benefitText}>Crie sequência</Text></View>
                        <View style={styles.benefit}><Text style={styles.benefitIcon}>◆</Text><Text style={styles.benefitText}>Evolua habilidades</Text></View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.switcher}>
                        <Pressable onPress={() => { setMode('login'); setMessage(null); }} style={[styles.switch, mode === 'login' && styles.switchActive]}>
                            <Text style={[styles.switchText, mode === 'login' && styles.switchTextActive]}>ENTRAR</Text>
                        </Pressable>
                        <Pressable onPress={() => { setMode('signup'); setMessage(null); }} style={[styles.switch, mode === 'signup' && styles.switchActive]}>
                            <Text style={[styles.switchText, mode === 'signup' && styles.switchTextActive]}>CRIAR CONTA</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.cardTitle}>{mode === 'login' ? 'Que bom ter você de volta!' : 'Comece sua jornada'}</Text>
                    <Text style={styles.cardSubtitle}>{mode === 'login' ? 'Continue de onde parou.' : 'Seu progresso ficará salvo e sincronizado.'}</Text>

                    {mode === 'signup' && (
                        <View style={styles.field}>
                            <Text style={styles.fieldLabel}>NOME</Text>
                            <TextInput accessibilityLabel="Nome" autoCapitalize="words" value={name} onChangeText={setName}
                                placeholder="Como podemos chamar você?" placeholderTextColor={palette.textSecondary} style={styles.input} />
                        </View>
                    )}

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>E-MAIL</Text>
                        <TextInput accessibilityLabel="E-mail" autoCapitalize="none" autoComplete="email" keyboardType="email-address"
                            value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" placeholderTextColor={palette.textSecondary} style={styles.input} />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>SENHA</Text>
                        <View style={styles.passwordRow}>
                            <TextInput accessibilityLabel="Senha" autoCapitalize="none" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                value={password} onChangeText={setPassword} secureTextEntry={!showPassword}
                                placeholder={mode === 'signup' ? 'Mínimo de 6 caracteres' : 'Sua senha'} placeholderTextColor={palette.textSecondary}
                                style={styles.passwordInput} onSubmitEditing={submit} />
                            <Pressable accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onPress={() => setShowPassword((value) => !value)} style={styles.eyeButton}>
                                <Text style={styles.eyeText}>{showPassword ? 'OCULTAR' : 'MOSTRAR'}</Text>
                            </Pressable>
                        </View>
                    </View>

                    {message && <View style={[styles.message, message.type === 'success' ? styles.successMessage : styles.errorMessage]}>
                        <Text style={[styles.messageText, message.type === 'success' ? styles.successText : styles.errorText]}>{message.text}</Text>
                    </View>}

                    <Pressable disabled={busy} onPress={submit} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed, busy && styles.buttonDisabled]}>
                        {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>{mode === 'login' ? 'ENTRAR' : 'CRIAR MINHA CONTA'}</Text>}
                    </Pressable>

                    {mode === 'login' && <Pressable disabled={busy} onPress={recover} style={styles.linkButton}>
                        <Text style={styles.linkText}>Esqueci minha senha</Text>
                    </Pressable>}

                    {!isConfigured && (
                        <View style={styles.demoArea}>
                            <View style={styles.dividerRow}><View style={styles.line} /><Text style={styles.or}>AMBIENTE LOCAL</Text><View style={styles.line} /></View>
                            <Pressable onPress={enterDemo} style={styles.demoButton}><Text style={styles.demoButtonText}>EXPLORAR DEMONSTRAÇÃO</Text></Pressable>
                            <Text style={styles.configHint}>Configure o arquivo .env para ativar contas reais e sincronização.</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.legal}>Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const createStyles = (palette) => StyleSheet.create({
    page: { flex: 1, backgroundColor: palette.background },
    content: { flexGrow: 1, width: '100%', maxWidth: 980, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 42, paddingBottom: 28 },
    hero: { alignItems: 'center', marginBottom: 24 },
    logo: { width: 68, height: 68, borderRadius: 22, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6, borderBottomColor: palette.accentStrong },
    logoLetter: { color: '#FFFFFF', fontSize: 38, lineHeight: 44, fontWeight: '900' },
    logoDot: { position: 'absolute', right: 12, top: 13, width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDF4D1' },
    brand: { color: palette.accentStrong, fontSize: 19, fontWeight: '900', marginTop: 10 },
    headline: { color: palette.textPrimary, fontSize: 30, lineHeight: 36, fontWeight: '900', textAlign: 'center', marginTop: 10 },
    subtitle: { color: palette.textSecondary, fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 500, marginTop: 8 },
    benefits: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 17 },
    benefit: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: palette.surface, borderWidth: 2, borderColor: palette.border, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 },
    benefitIcon: { fontSize: 13 }, benefitText: { color: palette.textSecondary, fontSize: 11, fontWeight: '800' },
    card: { width: '100%', maxWidth: 470, alignSelf: 'center', backgroundColor: palette.surface, borderWidth: 2, borderColor: palette.border, borderBottomWidth: 6, borderBottomColor: palette.shadow, borderRadius: 24, padding: 20 },
    switcher: { flexDirection: 'row', backgroundColor: palette.surfaceSoft, borderRadius: 13, padding: 4, marginBottom: 20 },
    switch: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
    switchActive: { backgroundColor: palette.surface, borderWidth: 2, borderColor: palette.border },
    switchText: { color: palette.textSecondary, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
    switchTextActive: { color: palette.accentStrong },
    cardTitle: { color: palette.textPrimary, fontSize: 21, fontWeight: '900', textAlign: 'center' },
    cardSubtitle: { color: palette.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 5, marginBottom: 18 },
    field: { marginBottom: 13 }, fieldLabel: { color: palette.textSecondary, fontSize: 10, fontWeight: '900', letterSpacing: 0.9, marginBottom: 6 },
    input: { height: 50, borderWidth: 2, borderColor: palette.border, backgroundColor: palette.background, color: palette.textPrimary, borderRadius: 13, paddingHorizontal: 14, fontSize: 15, fontWeight: '600' },
    passwordRow: { height: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: palette.border, backgroundColor: palette.background, borderRadius: 13 },
    passwordInput: { flex: 1, height: '100%', color: palette.textPrimary, paddingHorizontal: 14, fontSize: 15, fontWeight: '600' },
    eyeButton: { height: '100%', justifyContent: 'center', paddingHorizontal: 12 }, eyeText: { color: palette.info, fontSize: 9, fontWeight: '900' },
    message: { borderRadius: 11, padding: 10, marginBottom: 12 }, errorMessage: { backgroundColor: '#FFE0E0' }, successMessage: { backgroundColor: palette.accentSoft },
    messageText: { fontSize: 12, lineHeight: 17, fontWeight: '700', textAlign: 'center' }, errorText: { color: '#A82D2D' }, successText: { color: palette.accentStrong },
    primaryButton: { height: 52, backgroundColor: palette.accent, borderRadius: 14, borderBottomWidth: 5, borderBottomColor: palette.accentStrong, alignItems: 'center', justifyContent: 'center', marginTop: 3 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.7 }, buttonPressed: { transform: [{ translateY: 3 }], borderBottomWidth: 2 }, buttonDisabled: { opacity: 0.65 },
    linkButton: { alignItems: 'center', paddingTop: 15, paddingBottom: 3 }, linkText: { color: palette.info, fontSize: 12, fontWeight: '900' },
    demoArea: { marginTop: 8 }, dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginVertical: 13 }, line: { flex: 1, height: 2, backgroundColor: palette.border }, or: { color: palette.textSecondary, fontSize: 9, fontWeight: '900' },
    demoButton: { height: 48, borderWidth: 2, borderBottomWidth: 5, borderColor: palette.info, borderBottomColor: '#168ECB', borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    demoButtonText: { color: palette.info, fontSize: 12, fontWeight: '900', letterSpacing: 0.4 }, configHint: { color: palette.textSecondary, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 9 },
    legal: { color: palette.textSecondary, fontSize: 10, lineHeight: 15, textAlign: 'center', maxWidth: 440, alignSelf: 'center', marginTop: 19 },
});
