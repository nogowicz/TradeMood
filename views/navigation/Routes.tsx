import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from 'store/AuthProvider';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import AuthStack from './auth-stack';
import HomeStack from './home-stack';


export default function Routes() {
    const { user, setUser } = useAuth();
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChange(newUser: FirebaseAuthTypes.User | null) {
        setUser(newUser);

        if (initializing) {
            setInitializing(false);
        }
    }


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChange);
        return subscriber;
    });

    useEffect(() => {
        if (user) {
            const unsubscribe = auth().onUserChanged((updatedUser) => {
                setUser(updatedUser);
            });
            return unsubscribe;
        }
    }, [user]);


    if (initializing) {
        return null;
    }

    return (
        <NavigationContainer>
            {user ? <HomeStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

