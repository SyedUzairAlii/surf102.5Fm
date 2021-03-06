import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Switch, Dimensions, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import appIcon from '../../assets/appicon.png'
import splash from '../../assets/thumbnail.png'
import playBtn from '../../assets/play.png'
import pauseBtn from '../../assets/pause.png'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Audio } from 'expo-av'
import Slider from 'react-native-slider';
import { MaterialIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import ShareComponent from '../../component/share'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
class PlaylistItem {
    constructor(name, uri, image) {
        this.name = name;
        this.uri = uri;
        this.image = image;
    }
}
const PLAYLIST = [
    new PlaylistItem(
        'Comfort Fit - “Sorry”',
        'http://ice.surf1025.com:8000/surf1025',
        'https://facebook.github.io/react/img/logo_og.png'
    ),
];
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFFFFF';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = 'Loading...';
const BUFFERING_STRING = 'Buffering...';
const RATE_SCALE = 3.0;
let NameTime;


class Home extends Component {
    constructor(props) {
        super(props)

        this.index = 0;
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;
        this.playbackInstance = null;
        this.state = {
            playbackInstanceName: LOADING_STRING,
            playbackInstancePosition: null,
            playbackInstanceDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isBuffering: false,
            isLoading: true,
            fontLoaded: false,
            volume: 1.0,
            rate: 1.0,
            portrait: null,
            switchValue: false,
            songName: '',
            appLoading: true
        };
    }



    componentDidMount() {
        this._activate();
        this.songname()
        this.checkName("start")
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });

        // (async () => {
        let value = JSON.parse(this.props.switch)
        // console.log(value, 'value props')
        if (value == null) {

            this.setState({
                switchValue: true
            })
            this._loadNewPlaybackInstance(true).then(() => {
                this.setState({
                    isPlaying: false,
                    appLoading: false
                }, () => {
                    this._onPlayPausePressed()

                })
            })

        } else {

            if (value == 'true') {
                this.setState({
                    switchValue: true
                })
                this._loadNewPlaybackInstance(true).then(() => {
                    this.setState({
                        isPlaying: false,
                        appLoading: false
                    }, () => {
                        this._onPlayPausePressed()

                    })
                })

            } else {
                this._loadNewPlaybackInstance(false).then(() => {
                    this.setState({
                        isPlaying: false,
                        appLoading: false
                    })
                })
                // this.setState({
                //     isPlaying: true
                // }, () => {
                //     this._loadNewPlaybackInstance(true).then(() => {
                //         this.setState({
                //             isPlaying: false
                //         }, () => {
                //             this._onPlayPausePressed()
                //         })
                //     })
                // })
            }

        }
        // })();

        // this._loadNewPlaybackInstance(true);
    }

    componentWillUnmount() {
        this._deactivate()
        // console.log("unmout run")
    }
    _activate = () => {
        activateKeepAwake()
        // console.log("activate")

    }

    _deactivate = () => {
        deactivateKeepAwake()
        // console.log("deactivate")

    }

    async _loadNewPlaybackInstance(playing) {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance.setOnPlaybackStatusUpdate(null);
            this.playbackInstance = null;
        }
        const source = { uri: PLAYLIST[this.index].uri };
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            volume: this.state.volume,
        };
        const { sound, status } = await Audio.Sound.create(
            source,
            initialStatus,
            this._onPlaybackStatusUpdate
        );
        this.playbackInstance = sound;

        this._updateScreenForLoading(false);
    }

    _updateScreenForLoading(isLoading) {
        if (isLoading) {
            this.setState({
                isPlaying: false,
                playbackInstanceName: LOADING_STRING,
                playbackInstanceDuration: null,
                playbackInstancePosition: null,
                isLoading: true,
            });
        } else {
            this.setState({
                playbackInstanceName: PLAYLIST[this.index].name,
                portrait: PLAYLIST[this.index].image,
                isLoading: false,
            });
        }
    }

    _onPlaybackStatusUpdate = status => {
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                volume: status.volume,
            });
            if (status.didJustFinish) {
                this._advanceIndex(true);
                this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    };

    _advanceIndex(forward) {
        this.index =
            (this.index + (forward ? 1 : PLAYLIST.length - 1)) %
            PLAYLIST.length;
    }

    async _updatePlaybackInstanceForIndex(playing) {
        this._updateScreenForLoading(true);

        this._loadNewPlaybackInstance(playing);
    }

    _onPlayPausePressed = () => {
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                this.playbackInstance.pauseAsync();
                this.checkName("stop")
            } else {
                this.playbackInstance.playAsync();
                this.checkName("start")
                this.songname()
            }
        }
    };

    _onStopPressed = () => {
        if (this.playbackInstance != null) {
            this.playbackInstance.stopAsync();
        }
    };

    _onForwardPressed = () => {
        if (this.playbackInstance != null) {
            this._advanceIndex(true);
            this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
        }
    };

    _onBackPressed = () => {
        if (this.playbackInstance != null) {
            this._advanceIndex(false);
            this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
        }
    };
    checkName = (i) => {

        if (i === "start") {
            nameTime = setInterval(() => {
                this.songname()
                // console.log("run ")
            }, 10000)

        }
        if (i === "stop") {
            // console.log("clear time out")
            clearInterval(nameTime)
        }
    }
    songname = () => {
        let request = {
            method: "GET",

        };
        fetch('http://ice.surf1025.com:8000/status-json.xsl', request)
            .then(response => {
                response.json()
                    .then(response => {

                        // console.log(response.icestats.source, 'ye dhekho response');
                        response.icestats.source.map((i) => {
                            if (i.listenurl === "http://vs35.applesources.net:8000/surf1025") {
                                // console.log(i.title, 'ye dhekho response');
                                if (i.title !== this.state.songName) {
                                    this.setState({
                                        songName: i.title
                                    })

                                }
                            }
                        })
                    }

                    )
            })
            .catch(error => {
                console.error(error, 'ye error ');
            })
    }
    _onVolumeSliderValueChange = value => {
        if (this.playbackInstance != null) {
            this.playbackInstance.setVolumeAsync(value);
        }
    };

    _trySetRate = async rate => {
        if (this.playbackInstance != null) {
            try {
                await this.playbackInstance.setRateAsync(rate);
            } catch (error) {
                // Rate changing could not be performed, possibly because the client's Android API is too old.
            }
        }
    };

    _onRateSliderSlidingComplete = async value => {
        this._trySetRate(value * RATE_SCALE);
    };

    _onSeekSliderValueChange = value => {
        if (this.playbackInstance != null && !this.isSeeking) {
            this.isSeeking = true;
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
            this.playbackInstance.pauseAsync();
        }
    };

    _onSeekSliderSlidingComplete = async value => {
        if (this.playbackInstance != null) {
            this.isSeeking = false;
            const seekPosition = value * this.state.playbackInstanceDuration;
            if (this.shouldPlayAtEndOfSeek) {
                this.playbackInstance.playFromPositionAsync(seekPosition);
            } else {
                this.playbackInstance.setPositionAsync(seekPosition);
            }
        }
    };

    _getSeekSliderPosition() {
        if (
            this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return (
                this.state.playbackInstancePosition /
                this.state.playbackInstanceDuration
            );
        }
        return 0;
    }

    _getMMSSFromMillis(millis) {
        const totalSeconds = millis / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);

        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return '0' + string;
            }
            return string;
        };
        return padWithZero(minutes) + ':' + padWithZero(seconds);
    }

    _getTimestamp() {
        if (
            this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return `${this._getMMSSFromMillis(
                this.state.playbackInstancePosition
            )} / ${this._getMMSSFromMillis(
                this.state.playbackInstanceDuration
            )}`;
        }
        return '';
    }


    appIcon() {
        return (
            <Image
                style={{ width: 200, height: 200 }}
                source={appIcon}
            />
        )
    }

    playPauseBtn(play) {
        return (
            play ?
                <Image
                    style={{ width: 50, height: 50 }}
                    source={playBtn}
                />
                :
                <Image
                    style={{ width: 50, height: 50 }}
                    source={pauseBtn}
                />
        )
    }

    _handleToggleSwitch() {
        AsyncStorage.setItem('auto', JSON.stringify(!this.state.switchValue))

        this.setState({
            switchValue: !this.state.switchValue
        }, () => {
        })

    }

    render() {
        const { isLoading } = this.state
        return (


            < View style={{ flex: 1, borderWidth: 1, width: '100%', justifyContent: 'center', paddingVertical: 20 }
            }>

                <View style={{ paddingVertical: 10, alignSelf: 'center' }}>
                    {
                        this.appIcon()
                    }
                </View>

                {
                    !isLoading ?
                        <View>

                            <View style={{ paddingVertical: '5%', alignSelf: 'center' }}>
                                <TouchableOpacity onPress={this._onPlayPausePressed} activeOpacity={0.7}>
                                    {
                                        this.state.isPlaying ?
                                            this.playPauseBtn(false)
                                            :
                                            this.playPauseBtn(true)

                                    }
                                </TouchableOpacity>
                            </View>

                            <View>
                                <Text style={{ fontSize: 18, alignSelf: 'center', paddingVertical: 20 }}>
                                    {
                                        this.state.isPlaying ?
                                            'Current Playing'
                                            :
                                            'Stopped / Pause'
                                    }
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    this.state.isPlaying ?
                                        <Text numberOfLines={1} style={{ fontSize: 16, alignSelf: 'center', paddingVertical: 10, paddingBottom: 10, color: '#295DAA' }}>
                                            {this.state.songName}

                                        </Text>
                                        :
                                        <Text style={{ fontSize: 16, alignSelf: 'center', paddingVertical: 10, paddingBottom: 10, color: 'white' }}>Text here</Text>
                                }
                            </View>
                        </View>
                        :
                        <View style={{ height: 150 }}>
                            <ActivityIndicator size={'large'} />
                        </View>
                }

                <View style={{ flexDirection: 'row', paddingVertical: 5, justifyContent: 'space-between', paddingHorizontal: 20 }}>
                    <View>
                        <Switch
                            onValueChange={() => this._handleToggleSwitch()}
                            value={this.state.switchValue}
                        //  tintColor={'#295DAA'}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 19, color: 'grey' }}>
                            {'Auto play'}
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 7, }}>
                        {/* <View style={{ paddingHorizontal: 7, }}>
                            <MaterialIcons
                                name="volume-up"
                                size={40}
                                color="#56D5FA"
                            />
                        </View> */}
                        <Slider
                            style={styles.volumeSlider}
                            value={1}
                            onValueChange={this._onVolumeSliderValueChange}
                            thumbTintColor="#000000"
                            minimumTrackTintColor="#4CCFF9"
                        />
                    </View>
                    <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 19, color: 'grey' }}>
                            {'Volume'}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <ShareComponent />
                </View>
            </View >

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: BACKGROUND_COLOR,
    },
    portraitContainer: {
        marginTop: 80,
    },
    portrait: {
        height: 200,
        width: 200,
    },
    detailsContainer: {
        height: 40,
        marginTop: 40,
        alignItems: 'center',
    },
    playbackContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    playbackSlider: {
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10,
    },
    text: {
        fontSize: FONT_SIZE,
        minHeight: FONT_SIZE,
    },
    buttonsContainerBase: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonsContainerTopRow: {
        maxHeight: 40,
        minWidth: DEVICE_WIDTH / 2.0,
        maxWidth: DEVICE_WIDTH / 2.0,
        borderWidth: 1,
    },
    buttonsContainerMiddleRow: {
        maxHeight: 40,
        alignSelf: 'stretch',
        paddingRight: 20,
        borderWidth: 1,
    },
    volumeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: DEVICE_WIDTH - 70,
        maxWidth: DEVICE_WIDTH - 120,
        borderWidth: 1,
    },
    volumeSlider: {
        width: DEVICE_WIDTH - 180,
    },
    buttonsContainerBottomRow: {
        alignSelf: 'stretch',
        borderWidth: 1,
    },
    rateSlider: {
        width: DEVICE_WIDTH - 30,
        borderWidth: 1,
    },
});



function mapStateToProps(state) {
    return ({
        switch: state.authReducers.SWITCH,
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        actions: bindActionCreators({
            // getContent
        }, dispatch)
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);