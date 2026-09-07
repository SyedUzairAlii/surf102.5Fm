import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RadioPlayer } from '../components/RadioPlayer';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/app-icon-image.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Surf 102.5 FM</Text>

        <Text style={styles.subtitle}>
          The Soundtrack of Your Life
        </Text>

       <RadioPlayer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 32,
  },

  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
  },

  subtitle: {
    color: '#b5b5b5',
    fontSize: 16,
    marginTop: 8,
  },

  playerPlaceholder: {
    marginTop: 48,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 16,
    backgroundColor: '#222222',
  },

  playerText: {
    color: '#ffffff',
    fontSize: 15,
  },
});