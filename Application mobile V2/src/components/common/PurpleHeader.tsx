import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { BackButton } from './BackButton';

interface PurpleHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

/**
 * PurpleHeader - Single source of truth for all screen headers
 * 
 * Rules:
 * - Full-width purple background
 * - Centered page title
 * - Back button on top-left (only when navigation.canGoBack() or showBack=true)
 * - Community Chat icon on top-right (always)
 * - Safe area insets respected
 * - NO profile icon
 */
export const PurpleHeader: React.FC<PurpleHeaderProps> = ({
  title,
  showBack,
  onBackPress,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Auto-detect if we can go back (unless explicitly overridden)
  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBack !== undefined ? showBack : canGoBack;

  const handleCommunityChatPress = () => {
    // Navigate to CommunityGroupList in MainNavigator
    const mainNav = navigation.getParent()?.getParent();
    if (mainNav) {
      (mainNav as any).navigate('CommunityGroupList');
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.purple.light, paddingTop: Math.max(12, insets.top + 8) }]}>
      {/* Top row: Back button (left) and Community Chat icon (right) */}
      <View style={styles.topRow}>
        {shouldShowBack ? (
          <BackButton onPress={onBackPress} />
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <TouchableOpacity
          style={styles.communityChatButton}
          onPress={handleCommunityChatPress}
          activeOpacity={0.7}
        >
          <Text style={styles.communityChatIcon}>💬</Text>
          <Text style={[styles.communityChatLabel, { color: colors.text.white }]}>Community</Text>
        </TouchableOpacity>
      </View>

      {/* Centered title */}
      <Text style={[styles.title, { color: colors.text.white }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    // paddingTop is set dynamically based on safe area insets
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  communityChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  communityChatIcon: {
    fontSize: 20,
  },
  communityChatLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

