import { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useThemePalette } from '../theme/themeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DrawerMenu({ items, activeItem, onSelect, onClose, open }) {
    const { palette } = useThemePalette();
    const styles = createStyles(palette);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const drawerTranslateX = useRef(new Animated.Value(-320)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: open ? 0.72 : 0,
                duration: 260,
                useNativeDriver: true,
            }),
            Animated.timing(drawerTranslateX, {
                toValue: open ? 0 : -320,
                duration: 260,
                useNativeDriver: true,
            }),
        ]).start();
    }, [open, overlayOpacity, drawerTranslateX]);

    return (
        <>
            <AnimatedPressable
                style={[styles.overlay, { opacity: overlayOpacity }]}
                pointerEvents={open ? 'auto' : 'none'}
                onPress={onClose}
            />

            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [{ translateX: drawerTranslateX }],
                    },
                ]}
            >
                <Text style={styles.title}>Navegação</Text>

                {items.map((item) => (
                    <Pressable
                        key={item.key}
                        style={[
                            styles.menuItem,
                            activeItem === item.key && styles.activeMenuItem,
                        ]}
                        onPress={() => onSelect(item.key)}
                    >
                        <Text style={styles.menuItemText}>{item.label}</Text>
                    </Pressable>
                ))}
            </Animated.View>
        </>
    );
};

const createStyles = (palette) => StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.72)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 280,
        backgroundColor: palette.surface,
        paddingTop: 56,
        paddingHorizontal: 16,
        borderRightWidth: 1,
        borderRightColor: palette.border,
    },
    title: {
        color: palette.textPrimary,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuItem: {
        backgroundColor: palette.background,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeMenuItem: {
        borderColor: palette.accentStrong,
        backgroundColor: palette.surfaceSoft,
    },
    menuItemText: {
        color: palette.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
});