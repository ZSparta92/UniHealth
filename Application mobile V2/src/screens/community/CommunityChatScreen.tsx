import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';
import { useCommunityGroup } from '../../hooks/useCommunityGroup';
import { CommunityGroup } from '../../models/CommunityGroup';

type CommunityChatScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'CommunityChat'>;

interface Props {
  navigation: CommunityChatScreenNavigationProp;
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
          <Text style={styles.groupCode}>{group.code}</Text>
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
        {showJoinButton && onJoin ? (
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: colors.purple.medium }]}
            onPress={(e) => {
              e.stopPropagation();
              onJoin(group);
            }}
          >
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.statusBadge, group.isActive && { backgroundColor: colors.status.success }]}>
            <Text style={styles.statusText}>{group.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const CommunityChatScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { groups, availableGroups, loading, joinGroup, refreshGroups, refreshAvailableGroups } = useCommunityGroup();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshGroups();
      refreshAvailableGroups();
    });
    return unsubscribe;
  }, [navigation, refreshGroups, refreshAvailableGroups]);

  const handleGroupPress = (group: CommunityGroup) => {
    navigation.navigate('GroupChat', { groupId: group.id });
  };

  const handleJoinGroup = async (group: CommunityGroup) => {
    const joinedGroup = await joinGroup(group.id);
    if (joinedGroup) {
      // Navigate to the group chat after joining
      navigation.navigate('GroupChat', { groupId: group.id });
    }
  };

  if (loading && groups.length === 0 && availableGroups.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Community Chat" showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      <PurpleHeader title="Community Chat" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* My Groups Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>My groups</Text>
          {groups.length === 0 ? (
            <View style={styles.emptySection}>
              <Text style={[styles.emptyText, { color: colors.text.secondary }]}>You haven't joined any groups yet.</Text>
            </View>
          ) : (
            <View style={styles.groupsList}>
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onPress={handleGroupPress}
                />
              ))}
            </View>
          )}
        </View>

        {/* Available Groups Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Available groups</Text>
          {availableGroups.length === 0 ? (
            <View style={styles.emptySection}>
              <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No available groups at the moment.</Text>
            </View>
          ) : (
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
          )}
        </View>

        {/* Note */}
        <View style={[styles.noteContainer, { backgroundColor: colors.purple.light, borderColor: colors.purple.medium }]}>
          <Text style={[styles.noteText, { color: colors.purple.darker }]}>
            Groups are supervised by psychologists.
          </Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
  },
  joinButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptySection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  noteContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loader: {
    marginTop: 40,
  },
});
