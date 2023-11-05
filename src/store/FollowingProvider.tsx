import { firebase } from '@react-native-firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState, } from 'react';

export const FollowingContext = createContext<{
    ids: string[];
    follow: (userUID: string) => void;
    unFollow: (userUID: string) => void;
    isFollowing: (userUID: string) => boolean;
    getFollowersCount: (userUID: string) => number;
    getFollowingCount: (userUID: string) => number;

}>({
    ids: [],
    follow: (userUID: string) => { },
    unFollow: (userUID: string) => { },
    isFollowing: (userUID: string) => false,
    getFollowersCount: (userUID: string) => 0,
    getFollowingCount: (userUID: string) => 0,
});

type FollowingContextProviderProps = {
    children: ReactNode;
};

function FollowingContextProvider({ children }: FollowingContextProviderProps) {
    const [followingPersonsIds, setFollowingPersonsIds] = useState<string[]>([]);
    const [followersIds, setFollowersIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching following persons and followers")
            const user = firebase.auth().currentUser;
            if (user) {
                const userRef = firebase.firestore().collection('users').doc(user.uid);
                const doc = await userRef.get();
                if (doc.exists) {
                    const data = doc.data();
                    if (data) {
                        if (data.following) {
                            setFollowingPersonsIds(data.following);
                        }
                        if (data.followers) {
                            setFollowersIds(data.followers);
                        }
                    } else {
                        const newData = {
                            following: [],
                            followers: [],
                        };
                        await userRef.set(newData, { merge: true });
                    }
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
            const userRefA = firebase.firestore().collection('users').doc(user.uid);
            const userRefB = firebase.firestore().collection('users').doc(userUID);

            firebase.firestore().runTransaction(async (transaction) => {
                const docA = await transaction.get(userRefA);
                const docB = await transaction.get(userRefB);

                if (docA.exists && docB.exists) {
                    const dataA = docA.data();
                    const dataB = docB.data();

                    if (dataA && dataB && dataA.following && dataB.followers) {
                        const updatedFollowingA = dataA.following.filter((uid: string) => uid !== userUID);
                        const updatedFollowersB = dataB.followers.filter((uid: string) => uid !== user.uid);

                        transaction.update(userRefA, { following: updatedFollowingA });
                        transaction.update(userRefB, { followers: updatedFollowersB });

                        setFollowingPersonsIds(updatedFollowingA);
                        setFollowersIds(updatedFollowersB);
                    }
                }
            });
        }
    }

    function isFollowing(userUID: string) {
        return followingPersonsIds.includes(userUID);
    }

    function getFollowersCount() {
        return followersIds.length;
    }

    function getFollowingCount() {
        return followingPersonsIds.length;
    }

    const value = {
        ids: followingPersonsIds,
        follow: follow,
        unFollow: unFollow,
        isFollowing: isFollowing,
        getFollowersCount: getFollowersCount,
        getFollowingCount: getFollowingCount
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