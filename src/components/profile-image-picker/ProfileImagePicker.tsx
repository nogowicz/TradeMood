import {
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native'


import AddPhoto from 'assets/signup-screen/AddPhoto.svg';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import Image from 'components/image/Image';
import { themeContext } from 'store/themeContext';

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
    const theme = useContext(themeContext);
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
        >
            {imageUrl ? (
                <Image
                    style={{ height: size, width: size, borderRadius: size / 2 }}
                    size={size}
                    url={imageUrl}
                />
            ) : (
                <AddPhoto stroke={theme.TERTIARY} height={size} width={size} strokeWidth={3} />
            )}
        </TouchableOpacity>
    );
};
