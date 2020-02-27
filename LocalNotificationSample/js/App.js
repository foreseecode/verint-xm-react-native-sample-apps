
import React, { Component } from 'react';

import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
} from 'react-native';

import { ForeSeeButton } from './ForeSeeButton'
import { styles } from './styles'
import { ForeSee } from 'react-native-foresee-sdk'

const Space = (props) => {
  return (
    <View style={{height: 20}} />
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state={
      siginificantEvent: 0,
      pageViews: 0
    }
 
    ForeSee.setDebugLogEnabled(true)
    ForeSee.startWithConfigurationJson(JSON.stringify(foreSeeConfig))
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/foresee_logo.png')} style={{width: 80, height: 80, alignItems: 'center'}} />

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
            <Space />
            <Text style={[styles.text]}>This sample demonstrates the Exit Invite type, which denotes that the invitation appears as a local notification that appears after the app is exited. Follow the instructions below to check eligibility.</Text>
            <ForeSeeButton
              title="Check Eligibility"
              onPress={() => { 
                // Launch an invite as a demo
                ForeSee.checkEligibility() }} />
            <ForeSeeButton
              title="Reset State"
              onPress={() => { ForeSee.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invitation local notification is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const foreSeeConfig = {
  "clientId":"FSRTESTINGCODECID12345==",
  "notificationType":"EXIT_INVITE",
  "measures":
    [
        {
         "surveyId": "iphone_app_QA",
         "surveyStyle": "modern",
         "daysSinceLaunch":0,
         "launchCount":0
        }
    ],
    "invite": {
        "logo": "ForeSee_logo",
        "baseColor": [237, 38, 54]
    }
}


export default App;