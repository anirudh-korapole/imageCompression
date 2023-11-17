/** An asynchronous funtion that converts a data URL string into an image object
 * @param {string} dataURL - data URL string
 * @returns {Promise{Image}} - A promise that contains an image object as an argument
 */

export default async function dataURLToImage(dataURL: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('dataURLToImage(): dataURL is illegal'));
        image.src = dataURL;
    });
};
