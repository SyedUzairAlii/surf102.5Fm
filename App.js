import React, { Component } from 'react';
import Navigation from './navigation';
import { StyleSheet, Text, View } from 'react-native';


export default class App extends Component {
	render() {
		return (
			<Navigation />

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