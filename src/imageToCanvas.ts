import { ImageToCanvasConfig } from "@models"; 

/**
 * 
 * An asynchronous function that transforms an Image object to a Canvas object
 * @param {image} image - An image object
 * @typedef {Object=} config - An optional config object for transforming to canvas
 *      @param {number} width - The width of the canvas image, default is the image width
 *      @param {number} height - The height of the canvas image, default is the image height
 *      @param {number} scale - The scale ratio relative to the image, range 0-10, default is no scaling
 *                              config.scale will override config.width and config.height
 *      @param {number} orientation - The image rotation parameter, default is no rotation
 *      Reference as follows:
 *      Parameter   Rotation Direction
 *      1           0 degree
 *      2           Horizontal Flip
 *      3           180 degrees
 *      4           Vertical Flip
 *      5           Clockwise 90° + horizontal flip
 *      6           Clockwise 90°
 *      7           Clockwise 90° + vertical flip
 *      8           Counter-clockwise 90°
 *      
 * @type {config}
 * @returns {Promise(canvas)} A promise that contains a canvas object as an argument
 * 
 */

export default async function imageToCanvas(image: HTMLImageElement, config: ImageToCanvasConfig = {}): Promise<HTMLCanvasElement> {
    const myConfig = { ...config };
    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');
    let height;
    let width;
    for (const i in myConfig) {
        if (Object.prototype.hasOwnProperty.call(myConfig, i)) {
            myConfig[i] = Number(myConfig[i]);
        }
    }

    if (!myConfig.scale) {
        width = myConfig.width || (myConfig.height && myConfig.height * image.width / image.height) || image.width;
        height = myConfig.height || (myConfig.width && myConfig.width * image.height / image.width) || image.height;
    } else {
        const scale = myConfig.scale > 0 && myConfig.scale < 10 ? myConfig.scale : 1;
        width = image.width * scale;
        height = image.height * scale;
    }

    if ([5, 6, 7, 8].some(orientationValue => orientationValue === myConfig.orientation)) {
        cvs.height = width;
        cvs.width = height;
    }
    else {
        cvs.height = height;
        cvs.width = width;
    }

    //
   // Ensure that ctx is defined and not null
    if (ctx) {
        // set the orientation
        switch (myConfig.orientation) {
        case 3:
            ctx.rotate(180 * Math.PI / 180);
            ctx.drawImage(image, -cvs.width, -cvs.height, cvs.width, cvs.height);
            break;
        case 6:
            ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(image, 0, -cvs.width, cvs.height, cvs.width);
            break;
        case 8:
            ctx.rotate(270 * Math.PI / 180);
            ctx.drawImage(image, -cvs.height, 0, cvs.height, cvs.width);
            break;
        case 2:
            // translate the context by the canvas width
            ctx.translate(cvs.width, 0);
            // scale the context by -1 horizontally
            ctx.scale(-1, 1);
            ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
            break;
        case 4:
            ctx.translate(cvs.width, 0);
            ctx.scale(-1, 1);
            ctx.rotate(180 * Math.PI / 180);
            ctx.drawImage(image, -cvs.width, -cvs.height, cvs.width, cvs.height);
            break;
        case 5:
            ctx.translate(cvs.width, 0);
            ctx.scale(-1, 1);
            ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(image, 0, -cvs.width, cvs.height, cvs.width);
            break;
        case 7:
            ctx.translate(cvs.width, 0);
            ctx.scale(-1, 1);
            ctx.rotate(270 * Math.PI / 180);
            ctx.drawImage(image, -cvs.height, 0, cvs.height, cvs.width);
            break;
        default:
            // draw the image on the canvas normally
            ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
        }
    } else {
        // Handle the case where ctx is null
        console.error("Canvas rendering context (ctx) is null.");
    }
    // Return the canvas object as the resolved value of the promise
    return cvs;
};

