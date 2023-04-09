import './src/lib/dayjs';

import { StatusBar } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_800ExtraBold,
  });

  return !fontsLoaded ?
  <Loading /> :
  <>
    <Routes />
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
  </>
  ;
}
