import {
    TouchableOpacity,
    GestureResponderEvent,
    View,
} from 'react-native'


import AddPhoto from 'assets/signup-screen/AddPhoto.svg';
import { Dispatch, SetStateAction, useState } from 'react';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

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
    const [isImageDownloading, setIsImageDownloading] = useState(false);

    const handleImageLoad = () => {
        setIsImageDownloading(!isImageDownloading);
    };

    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
        >
            {imageUrl ? (
                <>
                    {isImageDownloading && (
                        <SkeletonPlaceholder>
                            <View style={{ height: size, width: size, borderRadius: size / 2 }} />
                        </SkeletonPlaceholder>
                    )}
                    <FastImage
                        source={{ uri: imageUrl }}
                        style={{
                            height: size,
                            width: size,
                            borderRadius: size / 2,
                            display: isImageDownloading ? 'none' : 'flex'
                        }}
                        onLoadStart={handleImageLoad}
                        onLoadEnd={handleImageLoad}
                    />
                </>
            ) : (
                <AddPhoto height={size} width={size} />
            )}
        </TouchableOpacity>
    );
};
