import React, { useState, useEffect } from 'react';
import { NativeEventEmitter, EmitterSubscription } from 'react-native';
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

    // custom invite listener
    const customInviteSubscription = verintEmitter.addListener(
      "shouldShowCustomInvite",
      (data) => {
        // this demonstrates a no-invite custom invite that immediately shows the survey
        VerintXM.customInviteAccepted();
      }
    );
    subscriptions.push(customInviteSubscription);

    VerintXM.setDebugLogEnabled(true);
    VerintXM.startWithSiteKey("mobsdk-react-insession-sample");

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

  const [customInviteEnabled, setCustomInviteEnabled] = useState<boolean>(false);

  const Space = () => {
    return (
      <View style={{ height: 20 }} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ width: '90%' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Space />
        <Image source={require('./assets/verint.png')} style={{ width: 167, height: 75, resizeMode: 'contain', alignItems: 'center' }} />
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch' }}>
          <Space />
          <Text style={[styles.text]}>This sample demonstrates the In Session type, which denotes that the survey is presented at the point where the user accepts the invitation. Follow the instructions below to check eligibility.</Text>
          <Space />
          <Text style={[styles.text]}>This app is using the significant event criteria. This criteria increments each time when the "Check Eligibility" button is clicked. The threshold for the significant event criteria is set to 1.</Text>
          <VerintButton
            title="Check Eligibility"
            onPress={() => {
              // Increment the significant event count so that we're eligible for an invite
              // based on the criteria in config
              VerintXM.incrementSignificantEvent("instant_invite")
              // Launch an invite as a demo
              VerintXM.checkEligibility()
            }} />
          <VerintButton
            title="Reset State"
            onPress={() => { VerintXM.resetState() }} />
          <Space />
          <Text style={[styles.text]}>Once the invite is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          <VerintButton
            title={`Skip invite using custom invites (${customInviteEnabled})`}
            onPress={() => {
              const enabled = !customInviteEnabled;
              VerintXM.setCustomInviteEnabled(enabled);
              setCustomInviteEnabled(enabled);
            }} />
          <Space />
          <Text style={[styles.text]}>When enabled the survey will be displayed immediately using a custom invite that skips the UI and immediately accepts the invite.</Text>
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
