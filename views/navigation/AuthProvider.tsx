import { ReactNode, createContext, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';


type AuthContextType = {
    user: FirebaseAuthTypes.User | null;
    setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string, imageUrl: string | null | undefined) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signInAnonymously: () => Promise<void>;
    updateEmail: (newEmail: string) => Promise<void>;
    updatePersonalData: (firstName: string, lastName: string) => Promise<void>,
    updateProfilePicture: (imageUrl: string | null | undefined) => Promise<void>,
    updatePassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    login: async () => { },
    register: async () => { },
    logout: async () => { },
    resetPassword: async () => { },
    signInAnonymously: async () => { },
    updateEmail: async () => { },
    updatePersonalData: async () => { },
    updateProfilePicture: async () => { },
    updatePassword: async () => { },
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
            register: async (email: string, password: string, firstName: string, lastName: string, imageUrl: string | null | undefined) => {
                await auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        if (imageUrl) {
                            user.updateProfile({
                                displayName: `${firstName.trim()} ${lastName.trim()}`,
                                photoURL: imageUrl
                            })

                        } else {
                            user.updateProfile({
                                displayName: `${firstName.trim()} ${lastName.trim()}`
                            })

                        }


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
                await auth().sendPasswordResetEmail(email);
            },
            signInAnonymously: async () => {
                try {
                    await auth().signInAnonymously();
                } catch (error) {
                    console.log(error);
                }
            },
            updateEmail: async (newEmail: string) => {
                const user = auth().currentUser;
                if (user) {
                    await user.updateEmail(newEmail);
                    await user.sendEmailVerification();
                }
            },
            updatePersonalData: async (firstName: string, lastName: string) => {
                const user = auth().currentUser;
                if (user) {
                    await user.updateProfile({
                        displayName: `${firstName.trim()} ${lastName.trim()}`
                    });
                }
            },
            updateProfilePicture: async (imageUrl: string | null | undefined) => {
                const user = auth().currentUser;
                if (user) {
                    await user.updateProfile({
                        photoURL: imageUrl
                    });
                }
            },
            updatePassword: async (newPassword: string) => {
                const user = auth().currentUser;
                if (user) {
                    await user.updatePassword(newPassword);
                }
            },
        }}>{children}</AuthContext.Provider>
}