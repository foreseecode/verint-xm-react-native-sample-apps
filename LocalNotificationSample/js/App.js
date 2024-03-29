
import React, { Component } from 'react';

import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
  PermissionsAndroid,
} from 'react-native';

import { VerintButton } from './VerintButton'
import { styles } from './styles'
import { VerintXM } from 'react-native-verint-xm-sdk'

const Space = (props) => {
  return (
    <View style={{height: 20}} />
  );
};

const requestNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state={
      siginificantEvent: 0,
      pageViews: 0
    }

    if (Platform.OS === 'android') {
      requestNotificationPermission();
    }
 
    VerintXM.setDebugLogEnabled(true)
    VerintXM.startWithConfigurationJson(JSON.stringify(config))
    VerintXM.setSkipPoolingCheck(true)

  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
            <Space />
            <Text style={[styles.text]}>This sample demonstrates the Exit Invite type, which denotes that the invitation appears as a local notification that appears after the app is exited. Follow the instructions below to check eligibility.</Text>
            <Space />
            <Text style={[styles.text]}>This application is using the launch count criteria. This criteria increments each time the app is backgrounded and refocused. The threshold for the launch count criteria is set to 3. Once the launch count criteria reaches 3, you can use check eligibility to trigger an invitation. After checking eligibility, background the app. A local notification should arrive after a few seconds.</Text>
            <VerintButton
              title="Check Eligibility"
              onPress={() => { 
                // Launch an invite as a demo
                VerintXM.checkEligibility() }} />
            <VerintButton
              title="Reset State"
              onPress={() => { VerintXM.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invitation local notification is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const config = {
    "notificationType":"EXIT_INVITE",
    "invite": {
        "logo": "VerintXM.logo",
        "baseColor": [43, 101, 242]
    },
    "survey": {
        "closeButtonColor": [255, 255, 255],
        "closeButtonBackgroundColor": [12, 12, 12],
        "headerColor": [43, 101, 242]
    },
    "surveyManagement": {
        "surveys": [
        {
            "url": "https://survey.vovici.com/se/705E3F053FB8395201",
            "name": "SampleSurvey",
            "launchCount": 3
        }
    ]
  }
}


export default App;
