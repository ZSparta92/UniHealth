import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useTheme, ColorScheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type AboutScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'About'>;

interface Props {
  navigation: AboutScreenNavigationProp;
}

export const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  
  // Create styles with theme colors
  const styles = useMemo(() => makeStyles(colors), [colors]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="About" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>UniHealth</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.text}>
            A privacy-focused mental health support app designed for students. Track your mood, journal your thoughts, 
            connect with therapists, and access resources to support your mental wellbeing.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.text}>
            All your data is stored locally on your device. We don't collect, transmit, or share any personal information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Text style={styles.text}>
            If you need help or have questions, please reach out through the app or contact emergency services if you're in crisis.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles factory function - colors must be provided at runtime
const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text.primary,
    textAlign: 'center',
  },
  version: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text.primary,
  },
  text: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
});
