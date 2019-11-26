import React, { Component } from 'react';
import Navigation from './navigation';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './store/store';


console.disableYellowBox = true
export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Navigation />
			</Provider>

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