import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type ResourceDetailScreenRouteProp = RouteProp<ResourcesStackParamList, 'ResourceDetail'>;
type ResourceDetailScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'ResourceDetail'>;

interface Props {
  route: ResourceDetailScreenRouteProp;
  navigation: ResourceDetailScreenNavigationProp;
}

export const ResourceDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { resourceId } = route.params;
  const { colors } = useTheme();

  // Mock resource data - in real app, fetch from storage
  const resource = {
    id: resourceId,
    title: 'Mental Health Resources',
    description: 'Comprehensive guide to mental health support and resources available to students.',
    content: `Mental health is an important aspect of overall well-being, especially for students who face various challenges during their academic journey.

This resource provides information about:
- Available support services
- How to access help
- Self-care strategies
- Emergency contacts

Remember, seeking help is a sign of strength, not weakness.`,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Resource" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text.primary }]}>{resource.title}</Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>{resource.description}</Text>
        <View style={[styles.contentBox, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.contentText, { color: colors.text.primary }]}>{resource.content}</Text>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  contentBox: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
