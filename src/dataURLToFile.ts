import { ImageType } from "@models";
import { checkImageType } from "@utils";

/** An asynchronous function that converts a data URL string to a file object.
 * The file type can be specified when converting.
 *  This function takes a Data URL, extracts the MIME type, decodes the base64-encoded data, 
 *  and creates a Blob with the decoded data and the specified MIME type. 
 *  It returns the Blob wrapped in a Promise.
 * @param {string} dataURL
 * @param {string=} type - The image type after conversion ('image/png', 'image/jpeg', 'image/gif').
 * @returns {Promise(Blob)}
 */

export default async function dataURLToFile(dataURL: string, type: ImageType): Promise<Blob> {
    const arr = dataURL.split(',');
    const matchResult = arr[0].match(/:(.*?);/); // extracts MIME type from the fist part of the data url. (matches between ':' and ';')
    if (!matchResult) {
        return Promise.reject(new Error('Invalid Data URL format'));
    }
    let mime = matchResult[1];
    const binaryStr = atob(arr[1]);  // decodes base64-encoded data portion of data url and converts into binary data
    let binaryStrLength = binaryStr.length;
    const u8arr = new Uint8Array(binaryStrLength); // Create a typed array of 8-bit unsigned integers with the same length
    // Loop through the decoded data and assign each character code to the corresponding element in the typed array
    while (binaryStrLength--) {
        u8arr[binaryStrLength] = binaryStr.charCodeAt(binaryStrLength);
    }
    // if the image type is specified, its assigned
    if (checkImageType(type)) {
        mime = type;
    }
    return new Blob([u8arr], {
        type: mime,
    });

};