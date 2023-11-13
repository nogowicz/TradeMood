import { StyleProp, View, ImageSourcePropType, Image, ImageStyle, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type ImageProps = {
    url?: string;
    source?: number | undefined | ImageSourcePropType | any;
    style: StyleProp<ImageStyle>;
    size?: number;
};

export default function CustomImage({ url, source, style, size }: ImageProps) {
    const [isImageDownloading, setIsImageDownloading] = useState(true);
    const [imageSource, setImageSource] = useState<ImageSourcePropType>();

    const handleImageLoadStart = () => {
        setIsImageDownloading(true);
    };

    const handleImageLoadEnd = () => {
        setIsImageDownloading(false);
    };

    useEffect(() => {
        if (url) {
            setImageSource({ uri: url });
        } else if (source) {
            setImageSource(source);
        }
    }, [url, source]);
    return (
        <>
            {(url || source) && isImageDownloading && (
                <SkeletonPlaceholder>
                    <View style={style} />
                </SkeletonPlaceholder>
            )}
            {imageSource && (
                <Image
                    source={imageSource}
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
                />
            )}
        </>
    );
}