import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type SavorMomentScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'SavorMoment'>;

interface Props {
  navigation: SavorMomentScreenNavigationProp;
}

export const SavorMomentScreen: React.FC<Props> = ({ navigation }) => {
  const [seconds, setSeconds] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const handleStart = () => {
    setIsRunning(true);
    setIsComplete(false);
    setSeconds(30);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setSeconds(30);
  };

  const handleDone = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <Text style={styles.screenTitle}>Savor the Moment</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.instructionTitle}>Take a moment to appreciate this feeling</Text>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{seconds}</Text>
          <Text style={styles.timerLabel}>seconds</Text>
        </View>

        {!isComplete && (
          <Text style={styles.instructionText}>
            {!isRunning
              ? 'Take a deep breath and start when you\'re ready'
              : 'Breathe deeply and focus on this positive moment'}
          </Text>
        )}

        {isComplete && (
          <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>✨</Text>
            <Text style={styles.completeText}>Great! You took time to savor this moment.</Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          {!isRunning && !isComplete && (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          )}

          {isRunning && (
            <TouchableOpacity style={styles.pauseButton} onPress={handleReset}>
              <Text style={styles.pauseButtonText}>Stop</Text>
            </TouchableOpacity>
          )}

          {isComplete && (
            <>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 2,
  },
  brandSubtitle: {
    fontSize: 9,
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.purple.medium,
  },
  timerLabel: {
    fontSize: 18,
    color: colors.text.secondary,
    marginTop: 8,
  },
  instructionText: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  completeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  completeEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  completeText: {
    fontSize: 18,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
  },
  startButton: {
    backgroundColor: colors.purple.medium,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  pauseButton: {
    backgroundColor: colors.status.error,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: colors.background.gray,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: colors.purple.medium,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
