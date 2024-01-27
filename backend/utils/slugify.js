module.exports = function(str) {
  return str.trim().replace(/\s+/g, '_').toLowerCase()
}