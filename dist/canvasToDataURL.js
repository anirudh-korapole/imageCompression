var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ImageType } from "@models";
import { checkImageType } from "@utils";
/**
 * an asynchronous function that converts a canvas object into a data URL string
 * @param {canvas} canvas
 * @param {number=} quality - A number between 0 and 1, indicating the image compression quality. Default is 0.92
 * @param {string=} type - The image type after conversion ('image/png', 'image/jpeg' or 'image/gif'). Default is 'image/jpeg'
 * @returns {Promise(string)} a promise that contains a data URL as an argument
 */
export default function canvasToDataURL(canvas, quality = 0.92, type = ImageType.JPEG) {
    return __awaiter(this, void 0, void 0, function* () {
        // checking if image is of valid type. if not, its assigned a default value JPEG
        if (!checkImageType(type)) {
            type = ImageType.JPEG;
        }
        return canvas.toDataURL(type, quality);
    });
}
;
//# sourceMappingURL=canvasToDataURL.js.map