import { ImageType } from "@models";
import { checkImageType } from "@utils";


/**
 * an asynchronous function that converts a canvas object into a data URL string
 * @param {canvas} canvas
 * @param {number=} quality - A number between 0 and 1, indicating the image compression quality. Default is 0.92
 * @param {string=} type - The image type after conversion ('image/png', 'image/jpeg' or 'image/gif'). Default is 'image/jpeg'
 * @returns {Promise(string)} a promise that contains a data URL as an argument
 */

export default async function canvasToDataURL(canvas: HTMLCanvasElement, quality: number = 0.92, type: ImageType = ImageType.JPEG): Promise<string> {
    // checking if image is of valid type. if not, its assigned a default value JPEG
    if(!checkImageType(type)) {
        type = ImageType.JPEG;
    }
    return canvas.toDataURL(type, quality)
};

