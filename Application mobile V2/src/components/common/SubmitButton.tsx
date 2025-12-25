import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  style?: any;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  loadingText,
  style,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? colors.background.gray : colors.purple.medium,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color={colors.text.white} style={styles.loader} />
          <Text style={[styles.buttonText, { color: colors.text.white }]}>
            {loadingText || 'Loading...'}
          </Text>
        </>
      ) : (
        <Text style={[styles.buttonText, { color: colors.text.white }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 52,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginRight: 8,
  },
});

