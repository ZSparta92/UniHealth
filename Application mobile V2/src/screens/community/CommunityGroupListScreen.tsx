import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useCommunityGroup } from '../../hooks/useCommunityGroup';
import { CommunityGroup } from '../../models/CommunityGroup';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type CommunityGroupListScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'CommunityGroupList'>;

interface Props {
  navigation: CommunityGroupListScreenNavigationProp;
}

const GroupCard: React.FC<{
  group: CommunityGroup;
  onPress: (group: CommunityGroup) => void;
  showJoinButton?: boolean;
  onJoin?: (group: CommunityGroup) => void;
}> = ({ group, onPress, showJoinButton = false, onJoin }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.groupCard, { backgroundColor: colors.background.card }]}
      onPress={() => onPress(group)}
    >
      <View style={styles.groupHeader}>
        <View style={[styles.groupCodeContainer, { backgroundColor: colors.purple.medium }]}>
          <Text style={[styles.groupCode, { color: colors.text.white }]}>{group.code}</Text>
        </View>
        <View style={styles.groupInfo}>
          <Text style={[styles.groupTheme, { color: colors.text.primary }]}>{group.theme}</Text>
          <Text style={[styles.groupSupervisor, { color: colors.text.secondary }]}>Supervised by {group.supervisorName}</Text>
        </View>
      </View>
      {group.description && (
        <Text style={[styles.groupDescription, { color: colors.text.secondary }]} numberOfLines={2}>
          {group.description}
        </Text>
      )}
      <View style={styles.groupFooter}>
        <Text style={[styles.groupMembers, { color: colors.text.secondary }]}>
          {group.memberIds.length} / {group.maxMembers} members
        </Text>
        {showJoinButton ? (
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: colors.purple.medium }]}
            onPress={(e) => {
              e.stopPropagation();
              onJoin?.(group);
            }}
          >
            <Text style={[styles.joinButtonText, { color: colors.text.white }]}>Join</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.statusBadge, { backgroundColor: colors.background.gray }, group.isActive && { backgroundColor: colors.status.success }]}>
            <Text style={[styles.statusText, { color: colors.text.white }]}>{group.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const CommunityGroupListScreen: React.FC<Props> = ({ navigation }) => {
  const { groups, availableGroups, loading, userIsPsychologist, createGroup, refreshGroups, joinGroup, refreshAvailableGroups } = useCommunityGroup();
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('[CommunityGroupList] Screen focused, refreshing groups');
      refreshGroups();
      refreshAvailableGroups();
    });
    return unsubscribe;
  }, [navigation, refreshGroups, refreshAvailableGroups]);

  const handleGroupPress = (group: CommunityGroup) => {
    navigation.navigate('GroupChat', { groupId: group.id, groupName: group.code });
  };

  const handleJoinGroup = async (group: CommunityGroup) => {
    try {
      const joinedGroup = await joinGroup(group.id);
      if (joinedGroup) {
        Alert.alert('Success', `You've joined ${group.code} - ${group.theme}`);
      } else {
        Alert.alert('Error', 'Unable to join group. It may be full or you may already be a member.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join group. Please try again.');
    }
  };

  const handleCreateGroup = () => {
    if (!userIsPsychologist) {
      Alert.alert(
        'Access Restricted',
        'Only licensed psychologists can create supervised groups. This ensures proper moderation and safety for all participants.'
      );
      return;
    }
    navigation.navigate('CreateGroup');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Community Groups" showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Community Groups" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Information Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.purple.light, borderColor: colors.purple.medium }]}>
          <Text style={styles.infoIcon}>🔒</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text.primary }]}>Supervised & Anonymous</Text>
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              Groups are supervised by licensed psychologists. Your identity is protected with anonymized codes and display names.
            </Text>
          </View>
        </View>

        {/* Create Group Button (Psychologists only) */}
        {userIsPsychologist && (
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.purple.medium }]}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createButtonIcon}>➕</Text>
            <Text style={[styles.createButtonText, { color: colors.text.white }]}>Create New Group</Text>
          </TouchableOpacity>
        )}

        {/* My Groups Section */}
        {groups.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>My Groups</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
              Groups you've joined
            </Text>
            <View style={styles.groupsList}>
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onPress={handleGroupPress}
                />
              ))}
            </View>
          </View>
        )}

        {/* Available Groups Section */}
        {availableGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Available Groups</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
              Join a group to start connecting
            </Text>
            <View style={styles.groupsList}>
              {availableGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onPress={handleGroupPress}
                  showJoinButton={true}
                  onJoin={handleJoinGroup}
                />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {groups.length === 0 && availableGroups.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No Groups Available</Text>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              {userIsPsychologist
                ? 'Create a new supervised group to get started.'
                : 'No groups are available at the moment. Check back later or contact support if you need assistance.'}
            </Text>
          </View>
        )}
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
  infoBanner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  createButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  groupsList: {
    gap: 16,
  },
  groupCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  groupCodeContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupCode: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  groupInfo: {
    flex: 1,
  },
  groupTheme: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupSupervisor: {
    fontSize: 14,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupMembers: {
    fontSize: 14,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  joinButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  loader: {
    marginTop: 40,
  },
});

