import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

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
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.brandTitle}>UniHealth</Text>
      {subtitle && <Text style={styles.brandSubtitle}>{subtitle}</Text>}
      {showProfileIcon && (
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.screenTitle}>{title}</Text>
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
    backgroundColor: colors.purple.light,
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
    color: colors.text.white,
    fontWeight: '500',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.purple.darker,
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
    color: colors.text.white,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.white,
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
