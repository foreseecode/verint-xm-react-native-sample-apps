
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
            <Text style={[styles.text]}>This sample demonstrates the In Session type, which denotes that the survey is presented at the point where the user accepts the invitation. Follow the instructions below to check eligibility.</Text>
            <Space />
            <Text style={[styles.text]}>This app is using the significant event criteria. This criteria increments each time when the "Check Eligibility" button is clicked. The threshold for the significant event criteria is set to 1.</Text>
            <ForeSeeButton
              title="Check Eligibility"
              onPress={() => { 
                // Increment the significant event count so that we're eligible for an invite
                // based on the criteria in foresee_configuration.json
                ForeSee.incrementSignificantEvent("instant_invite")
                
                // Launch an invite as a demo
                ForeSee.checkEligibility() }} />
            <ForeSeeButton
              title="Reset State"
              onPress={() => { ForeSee.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invite is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const foreSeeConfig = {
	"clientId":"FSRTESTINGCODECID12345==",
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
		"logo": "foresee_logo",
		"baseColor": [235, 43, 61]
	}
}

export default App;