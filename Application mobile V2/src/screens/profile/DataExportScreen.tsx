import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { useMood } from '../../hooks/useMood';
import { useJournal } from '../../hooks/useJournal';
import { Storage } from '../../storage/asyncStorage';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type DataExportScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'DataExport'>;

interface Props {
  navigation: DataExportScreenNavigationProp;
}

export const DataExportScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { entries: moodEntries } = useMood();
  const { entries: journalEntries } = useJournal();
  const { colors } = useTheme();
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setExporting(true);

      // Collect all user data
      const allKeys = await Storage.getAllKeys();
      const dataObject: Record<string, any> = {};

      for (const key of allKeys) {
        const value = await Storage.getItem(key);
        if (value) {
          try {
            dataObject[key] = JSON.parse(value);
          } catch {
            dataObject[key] = value;
          }
        }
      }

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: user,
        moodEntries: moodEntries,
        journalEntries: journalEntries,
        allStorageData: dataObject,
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Display data in alert with option to copy to clipboard
      Alert.alert(
        'Data Export',
        `Your data has been prepared for export.\n\n` +
        `Total entries:\n` +
        `- Mood entries: ${moodEntries.length}\n` +
        `- Journal entries: ${journalEntries.length}\n\n` +
        `Would you like to copy the data to clipboard?`,
        [
          {
            text: 'Copy to Clipboard',
            onPress: async () => {
              try {
                await Clipboard.setStringAsync(jsonString);
                Alert.alert('Success', 'Data copied to clipboard! You can now paste it anywhere.');
                console.log('Exported Data:', jsonString);
              } catch (error) {
                console.error('Error copying to clipboard:', error);
                Alert.alert('Error', 'Failed to copy to clipboard. Check console for data.');
                console.log('Exported Data:', jsonString);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Export Data" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: colors.text.primary }]}>Export Your Data</Text>
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            You can export all your data stored in the app, including:
          </Text>
          <View style={[styles.dataList, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.dataItem, { color: colors.text.primary }]}>• User profile information</Text>
            <Text style={[styles.dataItem, { color: colors.text.primary }]}>• Mood entries ({moodEntries.length} entries)</Text>
            <Text style={[styles.dataItem, { color: colors.text.primary }]}>• Journal entries ({journalEntries.length} entries)</Text>
            <Text style={[styles.dataItem, { color: colors.text.primary }]}>• All other app data</Text>
          </View>
          <Text style={[styles.warningText, { color: colors.text.secondary }]}>
            The data will be exported as a JSON file that you can save or share.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: colors.purple.medium }, exporting && styles.exportButtonDisabled]}
          onPress={handleExportData}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <Text style={[styles.exportButtonText, { color: colors.text.white }]}>Export My Data</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  infoSection: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  dataList: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  dataItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  warningText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  exportButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
