export default function checkImageType(type) {
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const isTypeAllowed = allowedImageTypes.some(allowedType => allowedType === type);
    return isTypeAllowed;
}
//# sourceMappingURL=checkImageType.js.map