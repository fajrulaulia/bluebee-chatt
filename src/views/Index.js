import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  PermissionsAndroid,
} from 'react-native';
import Login from './auth/Login'
import Register from './auth/Register'
import Index from './home/Index'
import Roomchatt from './home/RoomChatt'
const Stack = createStackNavigator();
function MyStack() {
  React.useEffect(() => {
    GetAllPermissions()
  })

  GetAllPermissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple
        ([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ]);
      if ((await PermissionsAndroid.check('android.permission.CAMERA') &&
        await PermissionsAndroid.check('android.permission.READ_EXTERNAL_STORAGE') &&
        await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE') &&
        await PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION'))) {
        return
      } else {
        console.log('all permissions denied');
        return
      }
    } catch (err) {
      console.err(err)
      return
    }
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="homepage"
        component={Index}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="roomchatt"
        component={Roomchatt}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}

export default MyStack