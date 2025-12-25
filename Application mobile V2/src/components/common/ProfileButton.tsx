import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

interface ProfileButtonProps {
  style?: any;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ style }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to Profile tab
    const tabNav = navigation.getParent();
    if (tabNav) {
      (tabNav as any).navigate('ProfileTab');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.profileButton, { backgroundColor: colors.background.white }, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.profileIcon}>👤</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    position: 'absolute',
    top: 12,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 20,
  },
});

