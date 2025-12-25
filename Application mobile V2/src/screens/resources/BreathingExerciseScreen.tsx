import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type BreathingExerciseScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'BreathingExercise'>;

interface Props {
  navigation: BreathingExerciseScreenNavigationProp;
}

export const BreathingExerciseScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Cycle through phases: inhale -> hold -> exhale -> inhale
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 4;
            } else {
              setPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setPhase('inhale');
      setCountdown(4);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCountdown(4);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return colors.status.success;
      case 'hold':
        return colors.purple.medium;
      case 'exhale':
        return colors.status.error;
      default:
        return colors.purple.light;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.white }]}>
      {/* Header */}
      <PurpleHeader title="Breathing Exercise" showBack />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.instructionsSection}>
          <Text style={[styles.instructionsTitle, { color: colors.text.primary }]}>4-4-4 Breathing Technique</Text>
          <Text style={[styles.instructionsText, { color: colors.text.secondary }]}>
            This technique helps calm your nervous system and reduce anxiety. Follow the rhythm:
          </Text>
          <View style={[styles.stepsContainer, { backgroundColor: colors.background.card }]}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.stepNumberText, { color: colors.text.primary }]}>1</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text.primary }]}>Inhale for 4 counts</Text>
            </View>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.stepNumberText, { color: colors.text.primary }]}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text.primary }]}>Hold for 4 counts</Text>
            </View>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.purple.light }]}>
                <Text style={[styles.stepNumberText, { color: colors.text.primary }]}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text.primary }]}>Exhale for 4 counts</Text>
            </View>
          </View>
        </View>

        {/* Breathing Circle */}
        <View style={styles.breathingContainer}>
          <View
            style={[
              styles.breathingCircle,
              {
                backgroundColor: getPhaseColor(),
                transform: [{ scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.1 : 1.0 }],
              },
            ]}
          >
            {isActive && (
              <>
                <Text style={[styles.phaseText, { color: colors.text.white }]}>{getPhaseText()}</Text>
                <Text style={[styles.countdownText, { color: colors.text.white }]}>{countdown}</Text>
              </>
            )}
            {!isActive && <Text style={[styles.startText, { color: colors.text.white }]}>Tap Start</Text>}
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isActive ? (
            <TouchableOpacity style={[styles.startButton, { backgroundColor: colors.purple.medium }]} onPress={handleStart}>
              <Text style={[styles.startButtonText, { color: colors.text.white }]}>Start Exercise</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.stopButton, { backgroundColor: colors.status.error }]} onPress={handleStop}>
              <Text style={[styles.stopButtonText, { color: colors.text.white }]}>Stop</Text>
            </TouchableOpacity>
          )}
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
    alignItems: 'center',
  },
  instructionsSection: {
    marginBottom: 40,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  stepsContainer: {
    borderRadius: 12,
    padding: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 16,
    flex: 1,
  },
  breathingContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  startText: {
    fontSize: 18,
    fontWeight: '600',
  },
  controlsContainer: {
    width: '100%',
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
  stopButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
