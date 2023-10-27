import { firebase } from '@react-native-firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export const FollowingContext = createContext<{
    ids: string[];
    follow: (userUID: string) => void;
    unFollow: (userUID: string) => void;
    isFollowing: (userUID: string) => boolean;
}>({
    ids: [],
    follow: (userUID: string) => { },
    unFollow: (userUID: string) => { },
    isFollowing: (userUID: string) => false,
});

type FollowingContextProviderProps = {
    children: ReactNode;
};

function FollowingContextProvider({ children }: FollowingContextProviderProps) {
    const [followingPersonsIds, setFollowingPersonsIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching following persons")
            const user = firebase.auth().currentUser;
            if (user) {
                const userRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userRef.get();
                if (doc.exists) {
                    const data = doc.data();
                    if (data && data.following) {
                        setFollowingPersonsIds(data.following);
                    }
                } else {
                    const newData = {
                        followingPersonsIds: [],
                    };
                    await userRef.set(newData);
                }
            }
        };

        fetchData();
    }, []);

    function follow(userUID: string) {
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            firebase.firestore().runTransaction(async (transaction) => {
                const doc = await transaction.get(userRef);
                if (doc.exists) {
                    const data = doc.data();
                    if (data && data.following) {
                        const updatedIds = [...data.following, userUID];
                        transaction.update(userRef, { following: updatedIds });
                        setFollowingPersonsIds(updatedIds);
                    } else {
                        transaction.set(userRef, { following: [userUID] }, { merge: true });
                        setFollowingPersonsIds([userUID]);
                    }
                }
            });
        }
    }

    function unFollow(userUID: string) {
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            firebase.firestore().runTransaction(async (transaction) => {
                const doc = await transaction.get(userRef);
                if (doc.exists) {
                    const data = doc.data();
                    if (data && data.following) {
                        const updatedIds = data.following.filter(
                            (userUID: string) => userUID !== userUID
                        );
                        transaction.update(userRef, { following: updatedIds });
                        setFollowingPersonsIds(updatedIds);
                    }
                }
            });
        }
    }

    function isFollowing(userUID: string) {
        return followingPersonsIds.includes(userUID);
    }

    const value = {
        ids: followingPersonsIds,
        follow: follow,
        unFollow: unFollow,
        isFollowing: isFollowing,
    };

    return (
        <FollowingContext.Provider value={value}>{children}</FollowingContext.Provider>
    );
}

export default FollowingContextProvider;



export function useFollowing() {
    const followingPersons = useContext(FollowingContext);

    if (followingPersons === undefined) {
        throw new Error('useFollowing must be used within an FollowingContext');
    }

    return followingPersons;
}