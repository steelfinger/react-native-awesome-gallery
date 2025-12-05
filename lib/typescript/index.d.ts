import React from 'react';
import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
type Dimensions = {
    height: number;
    width: number;
};
export declare const useVector: (x1?: number, y1?: number) => {
    x: SharedValue<number>;
    y: SharedValue<number>;
};
export declare const snapPoint: (value: number, velocity: number, points: ReadonlyArray<number>) => number;
export type RenderItemInfo<T> = {
    index: number;
    item: T;
    setImageDimensions: (imageDimensions: Dimensions) => void;
};
type EventsCallbacks = {
    onSwipeToClose?: () => void;
    onTap?: () => void;
    onDoubleTap?: (toScale: number) => void;
    onLongPress?: () => void;
    onScaleStart?: (scale: number) => void;
    onScaleEnd?: (scale: number) => void;
    onPanStart?: () => void;
    onTranslationYChange?: (translationY: number, shouldClose: boolean) => void;
};
type RenderItem<T> = (imageInfo: RenderItemInfo<T>) => React.ReactElement | null;
export type GalleryRef = {
    setIndex: (newIndex: number, animated?: boolean) => void;
    reset: (animated?: boolean) => void;
};
export type GalleryReactRef = React.Ref<GalleryRef>;
type GalleryProps<T> = EventsCallbacks & {
    ref?: GalleryReactRef;
    data: T[];
    renderItem?: RenderItem<T>;
    keyExtractor?: (item: T, index: number) => string | number;
    initialIndex?: number;
    onIndexChange?: (index: number) => void;
    numToRender?: number;
    emptySpaceWidth?: number;
    doubleTapScale?: number;
    doubleTapInterval?: number;
    maxScale?: number;
    style?: ViewStyle;
    containerDimensions?: {
        width: number;
        height: number;
    };
    pinchEnabled?: boolean;
    swipeEnabled?: boolean;
    doubleTapEnabled?: boolean;
    disableTransitionOnScaledImage?: boolean;
    hideAdjacentImagesOnScaledImage?: boolean;
    disableVerticalSwipe?: boolean;
    disableSwipeUp?: boolean;
    loop?: boolean;
    onScaleChange?: (scale: number) => void;
    onScaleChangeRange?: {
        start: number;
        end: number;
    };
};
declare const Gallery: <T extends any>(p: GalleryProps<T> & {
    ref?: GalleryReactRef;
}) => React.ReactElement;
export default Gallery;
//# sourceMappingURL=index.d.ts.map