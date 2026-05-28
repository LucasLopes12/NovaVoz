import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AppTopBar({
    palette,
    themeName,
    currentView,
    activeTitle,
    menuButtonScale,
    onMenuPress,
    onBackPress,
    onToggleTheme,
    onButtonPressIn,
    onButtonPressOut,
}) {
    const styles = createStyles(palette);

    return (
        <View style={[styles.topBar, { backgroundColor: 'transparent' }]}>
            {currentView === 'task-detail' ? (
                <AnimatedPressable
                    style={[styles.menuButton, { transform: [{ scale: menuButtonScale }] }]}
                    onPressIn={onButtonPressIn}
                    onPressOut={onButtonPressOut}
                    onPress={onBackPress}
                >
                    <Text style={styles.menuButtonText}>←</Text>
                </AnimatedPressable>
            ) : (
                <AnimatedPressable
                    style={[styles.menuButton, { transform: [{ scale: menuButtonScale }] }]}
                    onPressIn={onButtonPressIn}
                    onPressOut={onButtonPressOut}
                    onPress={onMenuPress}
                >
                    <Text style={styles.menuButtonText}>☰</Text>
                </AnimatedPressable>
            )}

            <Text style={styles.headerTitle}>{activeTitle}</Text>

            <AnimatedPressable
                style={styles.themeToggleButton}
                onPress={onToggleTheme}
            >
                <Image
                    source={themeName === 'dark' ? require('../../assets/SUNPIXELART.png') : require('../../assets/MOONPIXELART.png')}
                    style={styles.themeToggleIcon}
                    resizeMode="contain"
                />
            </AnimatedPressable>
        </View>
    );
}

const createStyles = (palette) => StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0,
        marginHorizontal: 12,
        marginTop: 8,
    },
    menuButton: {
        width: 38,
        height: 38,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.accent,
        marginRight: 12,
    },
    menuButtonText: {
        color: palette.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: palette.accent,
        fontSize: 20,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    themeToggleButton: {
        marginLeft: 'auto',
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeToggleIcon: {
        width: 35,
        height: 35,
    },
});
