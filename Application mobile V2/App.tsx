import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

// BOOT DIAGNOSTIC MODE - Temporary debug infrastructure
// This will identify the exact module causing "Property 'colors' doesn't exist"

interface BootState {
  currentStep: string;
  logs: string[];
  error: { message: string; stack: string } | null;
  loadedModules: { [key: string]: boolean };
  readyToRender: boolean;
  loadedComponents: {
    ThemeProvider?: any;
    AuthProvider?: any;
    SafeAreaProvider?: any;
    NavigationContainer?: any;
    AppNavigator?: any;
  };
}

export default function App() {
  const [bootState, setBootState] = useState<BootState>({
    currentStep: 'Initializing...',
    logs: [],
    error: null,
    loadedModules: {},
    readyToRender: false,
    loadedComponents: {},
  });

  const addLog = (message: string) => {
    setBootState(prev => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${message}`],
    }));
    console.log(`[BOOT] ${message}`);
  };

  const setStep = (step: string) => {
    setBootState(prev => ({ ...prev, currentStep: step }));
    addLog(`Step: ${step}`);
  };

  const setError = (error: Error) => {
    setBootState(prev => ({
      ...prev,
      error: {
        message: error.message,
        stack: error.stack || 'No stack trace available',
      },
      currentStep: `❌ ERROR at: ${prev.currentStep}`,
    }));
    addLog(`ERROR: ${error.message}`);
    console.error('[BOOT ERROR]', error);
  };

  const markModuleLoaded = (moduleName: string) => {
    setBootState(prev => ({
      ...prev,
      loadedModules: { ...prev.loadedModules, [moduleName]: true },
    }));
  };

  // Safe require helper - returns error flag
  const safeRequire = <T,>(stepName: string, requireFn: () => T): { result: T | null; error: Error | null } => {
    setStep(stepName);
    try {
      const result = requireFn();
      markModuleLoaded(stepName);
      addLog(`✅ Successfully loaded: ${stepName}`);
      return { result, error: null };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      addLog(`❌ FAILED to load: ${stepName}`);
      return { result: null, error: err };
    }
  };

  // Dynamic loading sequence
  useEffect(() => {
    let isMounted = true;
    let hasError = false;

    const loadApp = async () => {
      if (!isMounted || hasError) return;

      // Step 1: Load ThemeContext
      const { result: ThemeContextModule, error: err1 } = safeRequire('Loading ThemeContext...', () => 
        require('./src/context/ThemeContext')
      );
      if (err1 || !ThemeContextModule) {
        hasError = true;
        return;
      }
      setBootState(prev => ({
        ...prev,
        loadedComponents: { ...prev.loadedComponents, ThemeProvider: ThemeContextModule.ThemeProvider },
      }));

      // Step 2: Load AuthContext
      const { result: AuthContextModule, error: err2 } = safeRequire('Loading AuthContext...', () => 
        require('./src/context/AuthContext')
      );
      if (err2 || !AuthContextModule) {
        hasError = true;
        return;
      }
      setBootState(prev => ({
        ...prev,
        loadedComponents: { ...prev.loadedComponents, AuthProvider: AuthContextModule.AuthProvider },
      }));

      // Step 3: Load SafeAreaProvider
      const { result: SafeAreaModule, error: err3 } = safeRequire('Loading SafeAreaProvider...', () => 
        require('react-native-safe-area-context')
      );
      if (err3 || !SafeAreaModule) {
        hasError = true;
        return;
      }
      setBootState(prev => ({
        ...prev,
        loadedComponents: { ...prev.loadedComponents, SafeAreaProvider: SafeAreaModule.SafeAreaProvider },
      }));

      // Step 4: Load NavigationContainer
      const { result: NavigationModule, error: err4 } = safeRequire('Loading NavigationContainer...', () => 
        require('@react-navigation/native')
      );
      if (err4 || !NavigationModule) {
        hasError = true;
        return;
      }
      setBootState(prev => ({
        ...prev,
        loadedComponents: { ...prev.loadedComponents, NavigationContainer: NavigationModule.NavigationContainer },
      }));

      // Step 5: Load AppNavigator (this might trigger screen imports)
      const { result: AppNavigatorModule, error: err5 } = safeRequire('Loading AppNavigator...', () => 
        require('./src/navigation/AppNavigator')
      );
      if (err5 || !AppNavigatorModule) {
        hasError = true;
        return;
      }
      setBootState(prev => ({
        ...prev,
        loadedComponents: { ...prev.loadedComponents, AppNavigator: AppNavigatorModule.AppNavigator },
      }));

      // Step 6: All modules loaded successfully
      if (isMounted && !hasError) {
        setStep('✅ All modules loaded - Rendering app...');
        addLog('Starting full app render...');
        
        // Mark as ready to render
        setBootState(prev => ({
          ...prev,
          currentStep: 'App Running',
          readyToRender: true,
        }));
      }
    };

    // Small delay to ensure first render completes
    setTimeout(() => {
      loadApp();
    }, 100);

    return () => {
      isMounted = false;
    };
  }, []);

  // If all modules loaded successfully, render the actual app
  const { ThemeProvider, AuthProvider, SafeAreaProvider, NavigationContainer, AppNavigator } = bootState.loadedComponents;
  if (bootState.readyToRender && ThemeProvider && AuthProvider && SafeAreaProvider && NavigationContainer && AppNavigator && !bootState.error) {
    return (
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  // If error occurred, show error screen
  if (bootState.error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🚨 BOOT ERROR DETECTED</Text>
          <Text style={styles.stepText}>{bootState.currentStep}</Text>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.errorSection}>
            <Text style={styles.errorTitle}>Error Message:</Text>
            <Text style={styles.errorText}>{bootState.error.message}</Text>
          </View>

          <View style={styles.errorSection}>
            <Text style={styles.errorTitle}>Stack Trace:</Text>
            <ScrollView nestedScrollEnabled style={styles.stackContainer}>
              <Text style={styles.stackText}>{bootState.error.stack}</Text>
            </ScrollView>
          </View>

          <View style={styles.errorSection}>
            <Text style={styles.errorTitle}>Loaded Modules:</Text>
            {Object.entries(bootState.loadedModules).map(([name, loaded]) => (
              <Text key={name} style={styles.logText}>
                {loaded ? '✅' : '❌'} {name}
              </Text>
            ))}
          </View>

          <View style={styles.errorSection}>
            <Text style={styles.errorTitle}>Boot Log:</Text>
            {bootState.logs.map((log, index) => (
              <Text key={index} style={styles.logText}>{log}</Text>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Loading screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Boot Diagnostic Mode</Text>
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
        <Text style={styles.stepText}>{bootState.currentStep}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loaded Modules:</Text>
          {Object.entries(bootState.loadedModules).length === 0 ? (
            <Text style={styles.logText}>No modules loaded yet...</Text>
          ) : (
            Object.entries(bootState.loadedModules).map(([name, loaded]) => (
              <Text key={name} style={styles.logText}>
                {loaded ? '✅' : '⏳'} {name}
              </Text>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boot Log:</Text>
          {bootState.logs.length === 0 ? (
            <Text style={styles.logText}>Waiting for first step...</Text>
          ) : (
            bootState.logs.map((log, index) => (
              <Text key={index} style={styles.logText}>{log}</Text>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
  },
  header: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0000ff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  spinner: {
    marginVertical: 10,
  },
  stepText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  errorSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ff0000',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#ffeeee',
    padding: 10,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  stackContainer: {
    maxHeight: 300,
    backgroundColor: '#ffeeee',
    padding: 10,
    borderRadius: 4,
  },
  stackText: {
    fontSize: 12,
    color: '#000000',
    fontFamily: 'monospace',
  },
  logText: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

