// Utility functions for URL validation, shortcode generation, and validation

// Validate URL format using regex
export function isValidUrl(url) {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol optional
    '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
    'localhost|' + // localhost
    '\\d{1,3}(\\.\\d{1,3}){3})' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-zA-Z\\d_]*)?$',
    'i'
  );
  return !!urlPattern.test(url);
}

// Validate shortcode: alphanumeric, length 3-10
export function isValidShortcode(code) {
  const shortcodePattern = /^[a-zA-Z0-9]{3,10}$/;
  return shortcodePattern.test(code);
}

// Generate a random shortcode of length 6
export function generateShortcode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
