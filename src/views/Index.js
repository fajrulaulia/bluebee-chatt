import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './auth/Login'
import Register from './auth/Register'
import Index from './home/Index'
import Roomchatt from './home/RoomChatt'
import { requestMultiple, PERMISSIONS,checkMultiple } from 'react-native-permissions';

const Stack = createStackNavigator();

function MyStack() {

  React.useEffect(() => {
    async function anyNameFunction() {
      await GetAllPermissions();
    }
    anyNameFunction();
  })

  GetAllPermissions = async () => {
    try {
      await requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
      checkMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]).then(
        (statuses) => {
          console.log('PERMISSIONS.ANDROID.CAMERA', statuses[PERMISSIONS.ANDROID.CAMERA]);
          console.log('PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
          console.log('PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE', statuses[ PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
          console.log('PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
        },
      );
      return

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