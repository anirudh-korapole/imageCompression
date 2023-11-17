import { ImageType } from "@models";

export default function checkImageType(type: ImageType) {
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const isTypeAllowed = allowedImageTypes.some(allowedType => allowedType === type);
    return isTypeAllowed;

};


