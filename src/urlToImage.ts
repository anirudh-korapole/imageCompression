/**
 * An asynchronous function that loads an image object from an image URL
 * @param {string} url - Image URL
 * @returns {Promise(Image)} A promise that contains an image object as an argument
 */

export default function urlToImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('urlToImage(): Image failed to load, please check the image URL'));
        image.src = url;
    });
};