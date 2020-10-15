import React,{Component}from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {AppState} from 'react-native'
import Online from './src/utils/online'
const onlineService = new Online()


import Navigator from './src/views/index'
class App extends Component {

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      onlineService.setStatusOnline()
    }else{
      onlineService.setStatusOffline()
    }
  }
  render(){
    return (
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    )
  }
};


export default App;
