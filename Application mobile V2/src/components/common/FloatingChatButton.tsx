import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Keyboard, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

interface FloatingChatButtonProps {
  style?: any;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ style }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handlePress = () => {
    // Navigate to Community Group List - go up to MainNavigator
    const mainNav = navigation.getParent()?.getParent();
    if (mainNav) {
      (mainNav as any).navigate('CommunityGroupList');
    }
  };

  // Calculate bottom position: above tab bar (80px) + safe area, but move up when keyboard is open
  const bottomPosition = keyboardHeight > 0 
    ? keyboardHeight + 16 // Above keyboard when open
    : 80 + insets.bottom; // Above tab bar when closed

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        {
          backgroundColor: colors.purple.medium,
          bottom: bottomPosition,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.chatIcon}>💬</Text>
      <Text style={[styles.chatLabel, { color: colors.text.white }]}>Community</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 56,
  },
  chatIcon: {
    fontSize: 20,
  },
  chatLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

