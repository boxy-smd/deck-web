module.exports.customInstance = function customInstance(config, options) {
  return Promise.resolve(Object.assign({}, config, options)).then(response => response)
}
