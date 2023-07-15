import { StyleProp, StyleSheet, Text, View, ImageSourcePropType, ImageURISource } from 'react-native';
import React, { useState } from 'react';
import FastImage, { ImageStyle, FastImageProps, Source } from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type ImageProps = {
    url?: string;
    source?: number | Source | undefined;
    style: StyleProp<ImageStyle>;
    size?: number;
};

export default function Image({ url, source, style, size }: ImageProps) {
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
            <FastImage
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
