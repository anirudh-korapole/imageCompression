import canvasToDataURL from "./canvasToDataURL";
import canvasToFile from "./canvasToFile";
import dataURLToFile from "./dataURLToFile";
import dataURLToImage from "./dataURLToImage";
import downloadFile from "./downloadFile";
import fileToDataURL from "./fileToDataURL";
import imageToCanvas from "./imageToCanvas";
import urlToBlob from "./urlToBlob";
import urlToImage from "./urlToImage";
import { checkImageType } from "@utils";
import { ImageType, CompressConfig, CompressAccuratelyConfig } from "@models";

/**
 * Compress File (Blob) object
 * @param {Blob} file - A File (Blob) object
 * @param {(number|object)} config - If the input is a number type, the input range is 0-1, indicating the image compression quality, default 0.92; you can also enter an object type for more detailed configuration
 * @example
 * 		imageConversion.compress(file,0.8)
 *
 * 		imageConversion.compress(file,{
 * 			quality: 0.8 - Image compression quality
 * 			type："image/png" - The type of the converted image, options are "image/png", "image/jpeg", "image/gif"
 * 			width: 300 - The width of the generated image
 * 			height：200 - The height of the generated image
 * 			scale: 0.5 - The zoom ratio relative to the original image, setting config.scale will override the settings of config.width and config.height;
 * 			orientation:2 - Image rotation direction
 * 		})
 *
 * @returns {Promise(Blob)}
 */

async function compress(file: File, config: CompressConfig = {}): Promise<Blob> {
    if (!(file instanceof Blob)) {
        throw new Error('compress(): First arg must be a Blob object or a File object.')
    }
    if (typeof config !== 'object') {
        config = Object.assign({
            quality: config,
        });
    }
    config.quality = Number(config.quality);
    if (Number.isNaN(config.quality)) {
        return file;
    }

    const dataURL = await fileToDataURL(file);
    const arr = dataURL.split(',');
    const matchResult = arr[0].match(/:(.*?);/); // extracts MIME type from the fist part of the data url. (matches between ':' and ';')
    if (!matchResult) {
        throw new Error('Invalid Data URL format');
    }
    let originalMime = matchResult[1] as ImageType;
    let mime = ImageType.JPEG;
    if (config.type !== undefined) {
        if (checkImageType(config.type)) {
            mime = config.type;
            originalMime = config.type;
        }
    }
    else {
        throw new Error("config.type undefined")
    }
    const image = await dataURLToImage(dataURL);
    const canvas = await imageToCanvas(image, Object.assign({}, config));
    const compressDataURL = await canvasToDataURL(canvas, config.quality, mime);
    const compressFile = await dataURLToFile(compressDataURL, originalMime);
    if (compressFile.size > file.size) {
        return file;
    }
    return compressFile;

};

/**
 * Compresses a file accurately to a specified size and accuracy.
 * @param {Blob} file - The file to be compressed.
 * @param {compressAccuratelyConfig} [config={}] - The configuration object for compression.
 * @returns {Promise<Blob>} A promise that resolves to the compressed file.
 * @throws {Error} If the file is not a Blob or File object, or if the config is not an object.
 * @typedef {Object} CompressAccuratelyConfig
 * @property {number} [size] - The target size of the compressed file in KB.
 * @property {number} [accuracy] - The accuracy of the compression, between 0.8 and 0.99.
 * @property {ImageType} [type] - The image type of the compressed file.
 */


 


async function compressAccurately(file: Blob, config: CompressAccuratelyConfig = {}): Promise<Blob> {
    if (!(file instanceof Blob)) {
        throw new Error('compressAccurately(): First arg must be a Blob object or a File object');
    }
    if (typeof config !== 'object') {
        config = Object.assign({
            size: config,
        });
    }
    // If the specified size is not a number or a numberic string, do not process it
    config.size = Number(config.size);
    if (Number.isNaN(config.size)) {
        return file;
    }
    //If the specified size is larger than the original file size, do not process it
    if (config.size * 1024 > file.size) {
        return file;
    }
    config.accuracy = Number(config.accuracy);
    if (!config.accuracy || config.accuracy < 0.8 || config.accuracy > 0.99) {
        config.accuracy = 0.95; // Default accuracy is 0.95
    }

    const resultSize = {
        max: config.size * (2 - config.accuracy) * 1024,
        accurate: config.size * 1024,
        min: config.size * config.accuracy * 1024,
    };

    const dataURL = await fileToDataURL(file);
    const arr = dataURL.split(',');
    const matchResult = arr[0].match(/:(.*?);/); // extracts MIME type from the fist part of the data url. (matches between ':' and ';')
    if (!matchResult) {
        throw new Error('Invalid Data URL format');
    }
    let originalMime = matchResult[1] as ImageType;
    let mime = ImageType.JPEG;
    if (config.type !== undefined) {
        if (checkImageType(config.type)) {
            mime = config.type;
            originalMime = config.type;
        }
    }
    
    const image = await dataURLToImage(dataURL);
    const canvas = await imageToCanvas(image, Object.assign({}, config));
    /**
   * It was found through testing that the ratio of blob.size to dataURL.length is approximately 0.75
   * This ratio can be tested and verified by the dataURLtoFile method
   * Here, for the sake of performance, the blob.size is calculated directly by this ratio
   */
    const proportion = 0.75;
    let imageQuality = 0.5;
    let compressDataURL;
    const tempDataURLs: string[] = [];
    /**
   * The minimum granularity of the compression parameter for HTMLCanvasElement.toBlob() 
   * and HTMLCanvasElement.toDataURL() is 0.01, 
   * and 2 to the power of 7 is 128, 
   * which means that as long as the loop is 7 times, 
   * all possibilities will be covered
   */
    
    for (let x = 1; x <= 7; x++) {
        compressDataURL = await canvasToDataURL(canvas, imageQuality, mime);
        const calculationSize = compressDataURL.length * proportion;
        // if the accuracy value is not reached by the seventh loop it means that the image cannot meet this accuracy requirement
        // At this time, the dataURL that comes out of the last loop may not be the most accurate,
        // and the two dataURLs around it need to be compared with the three to select the most accurate one

        if (x === 7) {
            if (resultSize.max < calculationSize || resultSize.min > calculationSize) {
                compressDataURL = [compressDataURL, ...tempDataURLs]
                .filter(i => i)// remove null
                .sort((a,b) => Math.abs(a.length * proportion - resultSize.accurate))[0];
            }
            break;
        }

        if (resultSize.max < calculationSize) {
            tempDataURLs[1] = compressDataURL;
            imageQuality -= 0.5 ** (x + 1);
        }
        else if (resultSize.min > calculationSize) {
            tempDataURLs[0] = compressDataURL;
            imageQuality += 0.5 ** (x + 1);
        }
        else {
            break;
        }
    }
    if (!compressDataURL) {
        throw new Error("compresseAccurately(): compressDataURL is null");
    }
    const compressFile = await dataURLToFile(compressDataURL, originalMime);
    // If the compressed size is larger than the original file size, return the source file
    if (compressFile.size > file.size) {
        return file;
    }
    return compressFile;

};

export {
    canvasToDataURL,
    canvasToFile,
    dataURLToFile,
    dataURLToImage,
    downloadFile,
    fileToDataURL,
    imageToCanvas,
    urlToBlob,
    urlToImage,
    compress,
    compressAccurately
};

export {
    ImageType
};