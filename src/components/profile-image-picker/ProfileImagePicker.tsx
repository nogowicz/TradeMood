import {
    GestureResponderEvent,
    Pressable,
} from 'react-native'
import AddPhoto from 'assets/signup-screen/AddPhoto.svg';
import { Dispatch, SetStateAction } from 'react';
import Image from 'components/image/Image';
import { useTheme } from 'store/ThemeContext';

import ProfileIcon from 'assets/icons/ProfileExperimantal.svg'

type ProfileImagePickerProps = {
    activeOpacity?: number;
    size?: number;
    imageUrl: string | null | undefined;
    setImageUrl: Dispatch<SetStateAction<string | null | undefined>>;
    onPress?: (event: GestureResponderEvent) => void;
}


export default function ProfileImagePicker({
    activeOpacity = 0.5,
    size = 170,
    imageUrl,
    onPress
}: ProfileImagePickerProps) {
    const theme = useTheme();
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                opacity: (onPress && pressed) ? activeOpacity : 1
            })}
        >
            {imageUrl ? (
                <Image
                    style={{ height: size, width: size, borderRadius: size / 2 }}
                    size={size}
                    url={imageUrl}
                />
            ) : (
                <ProfileIcon stroke={theme.TERTIARY} height={size} width={size} strokeWidth={3} />
            )}
        </Pressable>
    );
};
