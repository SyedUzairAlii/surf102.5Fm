import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/home'


const StackNavigator = createStackNavigator({
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