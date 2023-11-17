/**
 * An asynchronous function that loads a file object from an image URL
 * @param {string} url - Image URL
 * @returns {Promise(Blob)}
 */

export default function urlToBlob(url: string): Promise<Blob> {
    // Return a promise that resolves to a file object
    return fetch(url).then(response => response.blob());
};

