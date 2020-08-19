const { ALPHANUMERIC } = require("../constants");

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = "";

  for (let i = 0; i < length; i++) {
    text += ALPHANUMERIC.charAt(
      Math.floor(Math.random() * ALPHANUMERIC.length)
    );
  }
  return text;
};

module.exports = generateRandomString;
