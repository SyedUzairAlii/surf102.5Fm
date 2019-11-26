import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, Image } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setDataReducer } from '../../store/actions/authAction'
import appIcon from '../../assets/preview.png'
import { StackActions, NavigationActions } from 'react-navigation'


class WelcomeScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    goToRoute(route) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: route }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    componentDidMount() {

        (async () => {
            const { actions, navigation } = this.props
            let value = await AsyncStorage.getItem('auto')
            console.log(value, 'value from compon')
            if (value) {

                actions.setDataReducer('SWITCH', JSON.stringify(value)).then((response) => {
                    if (response) {
                        setTimeout(() => {
                            this.goToRoute('Home')
                        }, 1000);
                    }
                })

            }
            else {

                setTimeout(() => {
                    this.goToRoute('Home')
                }, 1000);

            }
        })();


    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Image
                    source={appIcon}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


function mapStateToProps(state) {
    return ({
        // name: state.authreducer.SWITCH,
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        actions: bindActionCreators({
            setDataReducer
        }, dispatch)
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);