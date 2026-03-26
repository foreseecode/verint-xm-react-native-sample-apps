import React, { useState, useEffect } from 'react';
import { NativeEventEmitter, EmitterSubscription, Platform, PermissionsAndroid } from 'react-native';
import { StatusBar, useColorScheme, View } from 'react-native';
import {
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { VerintButton } from './src/VerintButton';
import { styles } from './src/styles';

import { VerintXM } from 'react-native-verint-xm-sdk';

const requestNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const verintEmitter = new NativeEventEmitter(VerintXM.nativeModule);
    const subscriptions: EmitterSubscription[] = [];

    const addListener = (eventName: string, emitter: NativeEventEmitter): EmitterSubscription => {
      const subscription = emitter.addListener(
        eventName,
        (event) => {
          const message = event && typeof event.message !== 'undefined' && event.message !== null ? ` ${event.message}` : '';
          console.log('[[' + eventName + ']]' + message);
              VerintXM.setSignificantEventCount("international_transfer_add", 1);
              VerintXM.setSignificantEventCount("lang_en", 1);
        }
      );
      subscriptions.push(subscription);
      return subscription;
    };

    // startup listeners
    addListener('onStarted', verintEmitter);
    addListener('onStartedWithError', verintEmitter);
    addListener('onFailedToStartWithError', verintEmitter);

    // invite/survey lifecycle listeners
    addListener('onInvitePresented', verintEmitter);
    addListener('onSurveyPresented', verintEmitter);
    addListener('onSurveyCompleted', verintEmitter);
    addListener('onSurveyCancelledByUser', verintEmitter);
    addListener('onSurveyCancelledWithNetworkError', verintEmitter);
    addListener('onInviteCompleteWithAccept', verintEmitter);
    addListener('onInviteCompleteWithDecline', verintEmitter);
    addListener('onInviteNotShownWithEligibilityFailed', verintEmitter);
    addListener('onInviteNotShownWithSamplingFailed', verintEmitter);

    if (Platform.OS === 'android') {
      requestNotificationPermission();
    }
 
    VerintXM.setDebugLogEnabled(true);
    VerintXM.startWithConfigurationUrl("https://ucm-eu.verint-cdn.com/files/sites/bank-dhofar/draft/msdk-config.json");

    // Cleanup function to remove all listeners
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {

  const Space = () => {
    return (
      <View style={{ height: 20 }} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={{ width: '90%' }} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Space />
        <Image source={require('./assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch' }}>
          <Space />
          <Text style={[styles.text]}>This sample demonstrates the Exit Invite type, which denotes that the invitation appears as a local notification that appears after the app is exited. Follow the instructions below to check eligibility.</Text>
          <Space />
          <Text style={[styles.text]}>This application is using the launch count criteria. This criteria increments each time the app is backgrounded and refocused. The threshold for the launch count criteria is set to 3. Once the launch count criteria reaches 3, you can use check eligibility to trigger an invitation. After checking eligibility, background the app. A local notification should arrive after a few seconds.</Text>
          <VerintButton
            title='Check Eligibility'
            onPress={() => { 
              // Launch an invite as a demo
              VerintXM.checkEligibility();
            }} />
          <VerintButton
            title='Reset State'
            onPress={() => { VerintXM.resetState(); }} />
          <Space />
          <Text style={[styles.text]}>Once the local notification invitation is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          <Space />
          <DebugContent />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DebugContent() {
  const { version: libraryVersion } = require('./node_modules/react-native-verint-xm-sdk/package.json');
  const [nativeSDKVersion, setNativeSDKVersion] = useState<string>('Loading...');

  useEffect(() => {
    VerintXM.getVersion().then(setNativeSDKVersion);
  }, []);

  return (
    <Text style={[styles.text]}>VerintXM {libraryVersion} | Native SDK {nativeSDKVersion}</Text>
  );
}

export default App;
