export const API_KEY ='AIzaSyD4fZYRmwQC95i5EIi9nH6Zy8YF2vTkvC4';

export const value_converter = (value) => {
    if (!value) return "0";
    const num = Number(value);
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + "K";
    }
    return num.toString();
};