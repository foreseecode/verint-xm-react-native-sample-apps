
import React, { Component } from 'react';

import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
} from 'react-native';

import { VerintButton } from './VerintButton'
import { styles } from './styles'
import { VerintXM } from 'react-native-verint-sdk'

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
 
    VerintXM.setDebugLogEnabled(true)
    VerintXM.startWithConfigurationJson(JSON.stringify(config))
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/verint.png')} style={{width: 167, height: 75, resizeMode: 'contain', alignItems: 'center'}} />

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
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
                VerintXM.checkEligibility() }} />
            <VerintButton
              title="Reset State"
              onPress={() => { VerintXM.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invite is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const config = {
    "customerId":"FSRTESTINGCODECID12345==",
    "notificationType": "IN_SESSION",
    "measures":
    [
      {
          "surveyId": "iphone_app_QA",
          "surveyStyle": "modern",
          "significantEventThresholds": {
              "instant_invite":1
          }
      }
    ],
    "cppParameters": {
        "sample_app":"In Session Sample CPP"
    },
    "invite": {
        "logo": "verint_logo",
        "baseColor": [43, 101, 242]
    },
    "survey": {
        "closeButtonColor": [255, 255, 255],
        "closeButtonBackgroundColor": [12, 12, 12],
        "headerColor": [43, 101, 242]
    }
}

export default App;
