import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/home'
import Welcome from '../screens/welcome/welcomeScreen'


const StackNavigator = createStackNavigator({
    Welcome: {
        screen: Welcome
    },
    Home: {
        screen: Home
    },
}, {
        navigationOptions: {
            drawerLockMode: 'locked-closed'
        },
        headerMode: 'none'
    }
);

const Navigation = createAppContainer(StackNavigator)
export default Navigation;