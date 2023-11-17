/**
 * An asynchronous function that converts a file object (Blob) to a data URL string
 * @param {Blob} file - A file object
 * @returns {Promise(string)} A promise that contains a data URL string as an argument
 */

export default function fileToDataURL(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = (e) => {
            if (!e.target) {
                return reject(new Error('Target file is null'));
            }
            return resolve(e.target.result as string);
        };
        reader.readAsDataURL(file);

    });
};


