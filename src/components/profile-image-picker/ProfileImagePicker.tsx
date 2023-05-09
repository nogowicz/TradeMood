import {
    TouchableOpacity,
    Image,
    GestureResponderEvent,
} from 'react-native'


import AddPhoto from 'assets/signup-screen/AddPhoto.svg';
import { Dispatch, SetStateAction } from 'react';

type ProfileImagePickerProps = {
    activeOpacity?: number;
    size?: number;
    imageUrl: string | null | undefined;
    setImageUrl: Dispatch<SetStateAction<string | null | undefined>>;
    onPress: (event: GestureResponderEvent) => void;
}


export default function ProfileImagePicker({
    activeOpacity = 0.5,
    size = 170,
    imageUrl,
    onPress
}: ProfileImagePickerProps) {



    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
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
