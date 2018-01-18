/**
 * draw random numbers and round them to integer
 * @param {Integer} min
 * @param {Integer} max
 * @returns {Integer} random number
 */
function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


