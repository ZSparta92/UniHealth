import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type SavorMomentScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'SavorMoment'>;

interface Props {
  navigation: SavorMomentScreenNavigationProp;
}

export const SavorMomentScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Savor the Moment" showBack />

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.instructionTitle, { color: colors.text.primary }]}>Take a moment to appreciate this feeling</Text>
        
        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, { color: colors.purple.medium }]}>{seconds}</Text>
          <Text style={[styles.timerLabel, { color: colors.text.secondary }]}>seconds</Text>
        </View>

        {!isComplete && (
          <Text style={[styles.instructionText, { color: colors.text.secondary }]}>
            {!isRunning
              ? 'Take a deep breath and start when you\'re ready'
              : 'Breathe deeply and focus on this positive moment'}
          </Text>
        )}

        {isComplete && (
          <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>✨</Text>
            <Text style={[styles.completeText, { color: colors.text.primary }]}>Great! You took time to savor this moment.</Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          {!isRunning && !isComplete && (
            <TouchableOpacity style={[styles.startButton, { backgroundColor: colors.purple.medium }]} onPress={handleStart}>
              <Text style={[styles.startButtonText, { color: colors.text.white }]}>Start</Text>
            </TouchableOpacity>
          )}

          {isRunning && (
            <TouchableOpacity style={[styles.pauseButton, { backgroundColor: colors.status.error }]} onPress={handleReset}>
              <Text style={[styles.pauseButtonText, { color: colors.text.white }]}>Stop</Text>
            </TouchableOpacity>
          )}

          {isComplete && (
            <>
              <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.background.gray }]} onPress={handleReset}>
                <Text style={[styles.resetButtonText, { color: colors.text.primary }]}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.doneButton, { backgroundColor: colors.purple.medium }]} onPress={handleDone}>
                <Text style={[styles.doneButtonText, { color: colors.text.white }]}>Done</Text>
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
  },
  timerLabel: {
    fontSize: 18,
    marginTop: 8,
  },
  instructionText: {
    fontSize: 18,
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
    textAlign: 'center',
    fontWeight: '600',
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
  },
  startButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  pauseButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
