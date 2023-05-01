import { useContext, useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import AuthStack from './auth-stack';
import HomeStack from './home-stack';


export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChange(newUser: FirebaseAuthTypes.User | null) {
        if (newUser && newUser.displayName) {
            setUser(newUser);
        } else {
            setUser(null);
        }
        if (initializing) {
            setInitializing(false);
        }
    }


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChange);
        return subscriber;
    });

    if (initializing) {
        return null;
    }

    return (
        <NavigationContainer>
            {user ? <HomeStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

