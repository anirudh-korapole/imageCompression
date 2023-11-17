import { ImageType } from "@models";

/** An asynchronous function that converts a canvas object to a file object
 * @param {canvas} canvas
 * @param {number=} quality - A number between 0 and 1, indicating the image compression quality. Default is 0.92
 * @param {string=} type - The image type after conversion ('image/png', 'image/jpeg', 'image/gif'). Default is 'image/jpeg'
 * @returns {Promise(Blob)} - A Promise that contains a file object as an argument
 */

export default function canvasToFile(canvas: HTMLCanvasElement, quality: number = 0.92, type: ImageType = ImageType.JPEG): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob); // Resolve with the Blob if it's not null
          } else {
            reject(new Error('Failed to create Blob')); // Reject with an error if it's null
          }
        }, type, quality);
      });
      
};