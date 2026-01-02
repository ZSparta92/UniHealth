import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type BreathingExerciseScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'BreathingExercise'>;

interface Props {
  navigation: BreathingExerciseScreenNavigationProp;
}

export const BreathingExerciseScreen: React.FC<Props> = ({ navigation }) => {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Breathing Exercise</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>4-4-4 Breathing Technique</Text>
          <Text style={styles.instructionsText}>
            This technique helps calm your nervous system and reduce anxiety. Follow the rhythm:
          </Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Inhale for 4 counts</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Hold for 4 counts</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Exhale for 4 counts</Text>
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
                <Text style={styles.phaseText}>{getPhaseText()}</Text>
                <Text style={styles.countdownText}>{countdown}</Text>
              </>
            )}
            {!isActive && <Text style={styles.startText}>Tap Start</Text>}
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isActive ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.stopButtonText}>Stop</Text>
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
    alignItems: 'center',
  },
  instructionsSection: {
    marginBottom: 40,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  stepsContainer: {
    backgroundColor: colors.background.card,
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
    backgroundColor: colors.purple.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 16,
    color: colors.text.primary,
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
    color: colors.text.white,
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  startText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
  },
  controlsContainer: {
    width: '100%',
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
  stopButton: {
    backgroundColor: colors.status.error,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
