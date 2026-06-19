import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onFinish: () => void;
}

export const WelcomeScreen = ({ onFinish }: WelcomeScreenProps) => {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(16)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2200),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  return (
    <TouchableOpacity activeOpacity={1} onPress={onFinish} style={styles.container}>
      <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
        {/* Wireframe image placeholder (was full-screen illustration) */}
        <View style={styles.bg}>
          <View style={styles.placeholderCross} />
          <View style={styles.placeholderCrossAlt} />
          <Text style={styles.placeholderLabel}>image placeholder</Text>
        </View>

        {/* Text lockup */}
        <Animated.View
          style={[
            styles.textWrap,
            {
              opacity: textOpacity,
              transform: [{ translateY: textY }],
            },
          ]}
        >
          <Text style={styles.title}>The Roots</Text>
          <Text style={styles.tagline}>Your journey to belonging starts here.</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECECEC',
  },
  // Wireframe "image" placeholder: bordered box with a diagonal cross
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: '#8A8A8A',
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderCross: {
    position: 'absolute',
    width: Math.hypot(width, height),
    height: 1,
    backgroundColor: '#B5B5B5',
    transform: [{ rotate: '60deg' }],
  },
  placeholderCrossAlt: {
    position: 'absolute',
    width: Math.hypot(width, height),
    height: 1,
    backgroundColor: '#B5B5B5',
    transform: [{ rotate: '-60deg' }],
  },
  placeholderLabel: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 13,
    color: '#8A8A8A',
    letterSpacing: 1,
  },
  textWrap: {
    position: 'absolute',
    bottom: height * 0.12,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 42,
    color: '#333333',
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: 'NotoSans_400Regular',
    fontSize: 15,
    color: '#6A6A6A',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
});
