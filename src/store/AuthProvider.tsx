import { ReactNode, createContext, useContext, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useIntl } from "react-intl";
import Snackbar from "react-native-snackbar";
import firestore from '@react-native-firebase/firestore';


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
    updateAboutMe: (newAboutMe: string) => Promise<void>;
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
    updateAboutMe: async () => { },
});



type AuthProviderProps = {
    children: ReactNode,
}


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const intl = useIntl();

    //translations:
    const logoutErrorTranslation = intl.formatMessage({
        id: "views.home.profile.provider.error.logout",
        defaultMessage: "Error occurred while logging out"
    });
    const singInAnonymouslyErrorTranslation = intl.formatMessage({
        id: "views.home.profile.provider.error.sign-in-anonymously",
        defaultMessage: "Error occurred while logging in"
    });

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
                        let displayName = `${firstName.trim()} ${lastName.trim()}`;
                        let photoURL = imageUrl || "";
                        const aboutMe = "";

                        if (photoURL) {
                            user.updateProfile({
                                displayName: displayName,
                                photoURL: photoURL
                            })
                        } else {
                            user.updateProfile({
                                displayName: displayName,
                                photoURL: ""
                            })
                        }


                        user.sendEmailVerification();
                        firestore().collection('users').doc(user.uid).set({
                            email: email,
                            displayName: displayName,
                            photoURL: photoURL,
                            followers: [],
                            following: [],
                            aboutMe: aboutMe
                        });

                    })

            },
            logout: async () => {
                try {
                    await auth().signOut();
                } catch (error) {
                    console.log(error);
                    Snackbar.show({
                        text: logoutErrorTranslation,
                        duration: Snackbar.LENGTH_SHORT
                    });
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
                    Snackbar.show({
                        text: singInAnonymouslyErrorTranslation,
                        duration: Snackbar.LENGTH_SHORT
                    });
                }
            },
            updateEmail: async (newEmail: string) => {
                const user = auth().currentUser;
                if (user) {
                    await user.updateEmail(newEmail);
                    await user.sendEmailVerification();

                    firestore().collection('users').doc(user.uid).update({
                        email: newEmail
                    });
                }
            },
            updatePersonalData: async (firstName: string, lastName: string) => {
                const user = auth().currentUser;
                if (user) {
                    let displayName = `${firstName.trim()} ${lastName.trim()}`;
                    await user.updateProfile({
                        displayName: displayName
                    });
                    firestore().collection('users').doc(user.uid).update({
                        displayName: displayName
                    });
                }
            },
            updateProfilePicture: async (imageUrl: string | null | undefined) => {
                const user = auth().currentUser;
                if (user) {
                    await user.updateProfile({
                        photoURL: imageUrl
                    });
                    firestore().collection('users').doc(user.uid).update({
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
            updateAboutMe: async (aboutMe: string) => {
                const user = auth().currentUser;
                if (user) {
                    await firestore().collection('users').doc(user.uid).update({
                        aboutMe: aboutMe
                    });
                }
            }
        }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return authContext;
}