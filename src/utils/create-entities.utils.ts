export const getArrayIfNeeded = function(input) {
    return Array.isArray(input) == false ? new Array(input) : input;
};