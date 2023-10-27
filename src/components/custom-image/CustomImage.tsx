import { StyleProp, View, ImageSourcePropType, ImageURISource, Image, ImageStyle } from 'react-native';
import React, { useState } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type ImageProps = {
    url?: string;
    source?: number | undefined | ImageSourcePropType | any;
    style: StyleProp<ImageStyle>;
    size?: number;
};

export default function CustomImage({ url, source, style, size }: ImageProps) {
    const [isImageDownloading, setIsImageDownloading] = useState(false);

    const handleImageLoad = () => {
        setIsImageDownloading(!isImageDownloading);
    };

    return (
        <>
            {(url || source) && isImageDownloading && (
                <SkeletonPlaceholder>
                    <View style={style} />
                </SkeletonPlaceholder>
            )}
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
                onLoadStart={handleImageLoad}
                onLoadEnd={handleImageLoad}
            />
        </>
    );
}
