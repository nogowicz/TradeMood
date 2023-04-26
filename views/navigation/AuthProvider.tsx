import { ReactNode, createContext, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';


type AuthContextType = {
    user: FirebaseAuthTypes.User | null;
    setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signInAnonymously: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    login: async () => { },
    register: async () => { },
    logout: async () => { },
    resetPassword: async () => { },
    signInAnonymously: async () => { },
});



type AuthProviderProps = {
    children: ReactNode,
}


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    return <AuthContext.Provider
        value={{
            user,
            setUser,
            login: async (email: string, password: string) => {
                await auth().signInWithEmailAndPassword(email, password);
            },
            register: async (email: string, password: string, firstName: string, lastName: string) => {
                await auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        user.updateProfile({
                            displayName: `${firstName} ${lastName}`,
                        });
                        user.sendEmailVerification();
                    })

            },
            logout: async () => {
                try {
                    await auth().signOut();
                } catch (error) {
                    console.log(error);
                }
            },
            resetPassword: async (email: string) => {
                try {
                    await auth().sendPasswordResetEmail(email);
                } catch (error) {
                    console.log(error);
                }
            },
            signInAnonymously: async () => {
                try {
                    await auth().signInAnonymously();
                } catch (error) {
                    console.log(error);
                }
            }
        }}>{children}</AuthContext.Provider>
}