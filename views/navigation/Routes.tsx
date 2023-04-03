import { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';

import AuthStack from './auth-stack';
import HomeStack from './home-stack';


export default function Routes() {
    const { user, setUser } = useContext(AuthContext);


    return (
        <NavigationContainer>
            {user ? <HomeStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

