/**
 * A function that downloads an image to the local machine
 * @param {Blob} file - A file (Blob) object
 * @param {string=} fileName - the file name after downloading (optional parameter, defaults to a timestamp if not provided)
 */

export default function downloadFile(file: File, fileName: string): void {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = fileName || Date.now().toString(36);
    document.body.appendChild(link);
    const evt = new MouseEvent('click', { // simulating a mouse click
        bubbles: false,
        cancelable: false,
        view: window
    });
    link.dispatchEvent(evt);
    document.body.removeChild(link);
};