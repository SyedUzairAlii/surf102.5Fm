import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';

import { STATION } from '../constants/station';

export function RadioPlayer() {
  const player = useAudioPlayer({
    uri: STATION.streamUrl,
  });

  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {status.playing ? 'LIVE NOW' : 'READY TO PLAY'}
      </Text>

      <Pressable style={styles.playButton} onPress={handlePlayPause}>
        {status.isBuffering ? (
          <ActivityIndicator size="large" color="#111111" />
        ) : (
          <Text style={styles.playButtonText}>
            {status.playing ? 'Pause' : 'Play'}
          </Text>
        )}
      </Pressable>

      <Text style={styles.stationName}>{STATION.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  status: {
    color: '#8d8d8d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 20,
  },
  playButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '700',
  },
  stationName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
});