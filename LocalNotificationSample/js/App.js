
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
            <Space />
            <Text style={[styles.text]}>This application is using the launch count criteria. This criteria increments each time the app is backgrounded and refocused. The threshold for the launch count criteria is set to 3. Once the launch count criteria reaches 3, you can use check eligibility to trigger an invitation. After checking eligibility, background the app. A local notification should arrive after a few seconds.</Text>
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
  "customerId":"FSRTESTINGCODECID12345==",
  "notificationType":"EXIT_INVITE",
  "measures":
    [
        {
            "surveyId": "iphone_app_QA",
            "surveyStyle": "modern",
            "launchCount":3
        }
    ],
    "invite": {
        "logo": "ForeSee_logo",
        "baseColor": [237, 38, 54]
    },
    "survey": {
        "closeButtonColor": [12, 12, 12],
        "closeButtonBackgroundColor": [12, 12, 12],
        "headerColor": [237, 38, 54]
    }
}


export default App;
