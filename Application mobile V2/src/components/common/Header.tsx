import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showProfileIcon?: boolean;
  showBrainIllustration?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  showProfileIcon = true,
  showBrainIllustration = false,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: colors.purple.light }]}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={[styles.backText, { color: colors.text.white }]}>← Back</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.brandTitle, { color: colors.purple.darker }]}>UniHealth</Text>
      {subtitle && <Text style={[styles.brandSubtitle, { color: colors.purple.darker }]}>{subtitle}</Text>}
      {showProfileIcon && (
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={[styles.profileIconText, { color: colors.text.white }]}>👤</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.screenTitle, { color: colors.text.white }]}>{title}</Text>
      {showBrainIllustration && (
        <View style={styles.brainIllustration}>
          <Text style={styles.brainEmoji}>🧠</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  profileIconText: {
    fontSize: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  brainIllustration: {
    position: 'absolute',
    right: 20,
    top: 120,
  },
  brainEmoji: {
    fontSize: 60,
  },
});
