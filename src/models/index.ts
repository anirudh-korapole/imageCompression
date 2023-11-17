export enum ImageType {
    'PNG' = 'image/png',
    'JPEG' = 'image/jpeg',
    'GIF' = 'image/gif'
}

interface BaseConfig {
    [key: string]: any;
}

export interface ImageToCanvasConfig extends BaseConfig {
    width?: number,
    height?: number,
    scale?: number,
    orientation?: number,
}

export interface CompressConfig extends ImageToCanvasConfig {
    quality?: number,
    type?: ImageType,
}

export interface CompressAccuratelyConfig extends ImageToCanvasConfig {
    size?: number,
    accuracy?: number,
    type?: ImageType
}