import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';

// We will build these screen components next
import IntakeScreen from '../screens/IntakeScreen';
import LoadingScreen from '../screens/LoadingScreen';
import RoutineScreen from '../screens/RoutineScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intake"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: false, // Cleaner aesthetic for the fig theme
      }}
    >
      <Stack.Screen 
        name="Intake" 
        component={IntakeScreen} 
        options={{ title: 'Configure Routine' }} 
      />
      <Stack.Screen 
        name="Loading" 
        component={LoadingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Routine" 
        component={RoutineScreen} 
        options={{ title: 'Your Plan', headerBackTitle: 'Back' }} 
      />
    </Stack.Navigator>
  );
}