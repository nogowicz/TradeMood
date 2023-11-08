import { StyleProp, View, ImageSourcePropType, Image, ImageStyle, Text } from 'react-native';
import React, { useState } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type ImageProps = {
    url?: string | null;
    source?: number | undefined | ImageSourcePropType | any;
    style: StyleProp<ImageStyle>;
    size?: number;
};

export default function CustomImage({ url, source, style, size }: ImageProps) {
    const [isImageDownloading, setIsImageDownloading] = useState(true);
    const [isImageLoadError, setIsImageLoadError] = useState(false);

    const handleImageLoadStart = () => {
        setIsImageDownloading(true);
        setIsImageLoadError(false);
    };

    const handleImageLoadEnd = () => {
        setIsImageDownloading(false);
    };

    const handleImageError = () => {
        setIsImageDownloading(false);
        setIsImageLoadError(true);
    };

    return (
        <>
            {(url || source) && isImageDownloading && !isImageLoadError && (
                <SkeletonPlaceholder>
                    <View style={style} />
                </SkeletonPlaceholder>
            )}
            {(
                <Image
                    source={url ? { uri: url } : source}
                    style={[
                        {
                            height: size,
                            width: size,
                            borderRadius: size && size / 2,
                            display: (url || source) && isImageDownloading ? 'none' : 'flex',
                        },
                        style,
                    ]}
                    onLoadStart={handleImageLoadStart}
                    onLoadEnd={handleImageLoadEnd}
                    onError={handleImageError}
                />
            )}
        </>
    );
}