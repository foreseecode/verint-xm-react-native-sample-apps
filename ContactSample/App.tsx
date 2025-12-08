import React, { useState, useEffect } from 'react';
import { NativeEventEmitter, EmitterSubscription, Alert } from 'react-native';
import { StatusBar, useColorScheme, View } from 'react-native';
import {
  Text,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

import { VerintButton } from './src/VerintButton';
import { styles } from './src/styles';

import { VerintXM } from 'react-native-verint-xm-sdk';

const Space = () => {
  return (
    <View style={{height: 20}} />
  );
};

async function getContactDetails(type: string, callback: (details: string | null) => void): Promise<void> {
  try {
    const details = await VerintXM.getContactDetails(type);
    callback(details);
  } catch (e) {
    console.error(e);
  }
}

async function getPreferredContactType(callback: (details: string | null) => void): Promise<void> {
  try {
    const details = await VerintXM.getPreferredContactType();
    callback(details);
  } catch (e) {
    console.error(e);
  }
}

const Stack = createNativeStackNavigator();

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

    // handler for invalid contact details
    const invalidInputSubscription = verintEmitter.addListener(
      "shouldSetInvalidInput",
      (data: any) => {
        Alert.alert("Invalid input! Reset state, set contact details, and try again.");
        VerintXM.customInviteDeclined();
    });
    subscriptions.push(invalidInputSubscription);


    VerintXM.setDebugLogEnabled(true);
    VerintXM.startWithSiteKey("mobsdk-react-contact-sample");

    // Cleanup function to remove all listeners
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={AppContent}
            options={{ title: "Contact Invite Sample" }}
          />
          <Stack.Screen 
            name="SetContactDetails" 
            component={SetContactDetailsContent}
            options={{ title: "Set Contact Details" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

interface NavigationProps {
  navigation: any;
}

function AppContent({ navigation }: NavigationProps) {

  const [customInviteEnabled, setCustomInviteEnabled] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView 
        style={{ width: '90%' }} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Space />
        <Image source={require('./assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch' }}>
          <Space />
          <Text style={[styles.text]}>This sample demonstrates the Contact invite type, which delivers survey links via email or SMS. Use the "Set Contact Details" page to pre-set contact details for the invite. The SDK transitions to an idle state after an invite is displayed. Use "Reset State" to test again. (This will also delete pre-set contact details.). Follow the instructions below to check eligibility. Internet connection is required.</Text>
          <Space />
          <Text style={[styles.text]}>Option 1: The app can trigger an invite by launching 3 times. Try exiting the app and re-entering 3 times, then click the "Check Eligibility" button.</Text>
          <Space />
          <Text style={[styles.text]}>Option 2: Significant events can also be used to trigger an invite. Click the "Increment Significant Event" button below a few times, then click the "Check Eligibility" button to trigger an invite.</Text>
          <VerintButton
            title="Check Eligibility"
            onPress={() => { 
              // Launch an invite as a demo
              VerintXM.checkEligibility();
            }} />
          <VerintButton
            title="Increment Significant Event"
            onPress={() => { 
              // Increment the significant event count so that we're eligible for an invite
              // based on the criteria in the config
              VerintXM.incrementSignificantEvent("instant_invite");
            }} />
          <VerintButton
            title="Set Contact Details"
            onPress={() => { navigation.navigate('SetContactDetails'); }} />
          <VerintButton
            title="Reset State"
            onPress={() => { VerintXM.resetState(); }} />
          <Space />
          <Text style={[styles.text]}>Once the invite is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          <VerintButton
            title={`Skip invite using custom invites (${customInviteEnabled})`}
            onPress={() => {
              const enabled = !customInviteEnabled;
              VerintXM.setCustomInviteEnabled(enabled, 'CONTACT');
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

function SetContactDetailsContent() {
    const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredContactType, setPreferredContactType] = useState("");

  useEffect(() => {
    getContactDetails("email", (details) => { setEmail(details ?? ""); });
    getContactDetails("phone", (details) => { setPhone(details ?? ""); });
    getPreferredContactType((details) => { setPreferredContactType(details ?? ""); });
  }, []);
 
  const preferredContactTypes = ['email', 'phone'];
  
  return(
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView 
        style={{ width: '90%' }} 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Space />
        <Image source={require('./assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />
        <Space />
        <Text style={[styles.text]}>Email Address:</Text>
        <Space />
        <TextInput
          style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <Space />
        <Text style={[styles.text]}>Phone Number:</Text>
        <Space />
        <TextInput
          style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text => setPhone(text)}
          value={phone}
        />
        <Space />
        <Text style={[styles.text]}>Preferred Contact Type:</Text>
        <Space />
        <SegmentedControl
          values={preferredContactTypes}
          selectedIndex={(() => {
            const i = preferredContactTypes.indexOf(preferredContactType);
            return i === -1 ? undefined : i;
          })()}
          style={{ width: 300 }}
          onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
            setPreferredContactType(preferredContactTypes[selectedSegmentIndex]);
          }}
        />
        <Space />
        <VerintButton
          title="Save"
          style={{ width: 200, height: 40 }}
          onPress={() => { 
            VerintXM.setContactDetails(`${email}`, "email");
            VerintXM.setContactDetails(`${phone}`, "phone");
            VerintXM.setPreferredContactType(preferredContactType);
          }}
        />
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