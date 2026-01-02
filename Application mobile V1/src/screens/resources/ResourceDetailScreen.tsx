import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type ResourceDetailScreenRouteProp = RouteProp<ResourcesStackParamList, 'ResourceDetail'>;
type ResourceDetailScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'ResourceDetail'>;

interface Props {
  route: ResourceDetailScreenRouteProp;
  navigation: ResourceDetailScreenNavigationProp;
}

export const ResourceDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { resourceId } = route.params;

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Resource</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{resource.title}</Text>
        <Text style={styles.description}>{resource.description}</Text>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{resource.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    backgroundColor: colors.purple.light,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
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
    marginBottom: 4,
  },
  profileIcon: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  profileIconText: {
    fontSize: 18,
    color: colors.text.white,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
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
    color: colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  contentBox: {
    backgroundColor: colors.background.card,
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
    color: colors.text.primary,
    lineHeight: 24,
  },
});
