import {
    TouchableOpacity,
    Image,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import AddPhoto from 'assets/signup-screen/AddPhoto.svg';
import { Dispatch, SetStateAction } from 'react';

type ProfileImagePickerProps = {
    activeOpacity?: number;
    size?: number;
    imageUrl: string | null;
    setImageUrl: Dispatch<SetStateAction<string | null>>;
}


export default function ProfileImagePicker({
    activeOpacity = 0.5,
    size = 102,
    imageUrl,
    setImageUrl
}: ProfileImagePickerProps) {
    const uploadImage = async () => {
        launchImageLibrary({
            mediaType: 'photo'
        }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const { uri, fileName } = response.assets[0];

                const storageRef = storage().ref(`usersProfilePictures/${fileName}`);

                const blob = uri ? await fetch(uri).then((response) => response.blob()) : null;

                if (blob) {
                    const uploadTask = storageRef.put(blob);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Postęp przesyłania: ${progress}%`);
                        },
                        (error) => {
                            console.log(error);
                        },
                        () => {
                            if (uploadTask.snapshot !== null) {
                                console.log('Upload is ' + uploadTask.snapshot.bytesTransferred + ' bytes done.');
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    console.log('File available at', downloadURL);
                                    setImageUrl(downloadURL);
                                });

                            } else {
                                console.log('Wystąpił błąd podczas przesyłania pliku.');
                            }
                        }
                    )

                } else {
                    console.error('Błąd: brak danych pliku');
                }
            }
        });
    }


    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={uploadImage}
        >
            {imageUrl ?
                <Image
                    source={{ uri: imageUrl }}
                    style={{ height: size, width: size, borderRadius: size / 2 }}
                /> :
                <AddPhoto height={size} width={size} />}
        </TouchableOpacity>
    );
};
