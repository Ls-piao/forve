// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    'autoprefixer': {browsers: 'last 5 version'},
    'postcss-px2rem-exclude': {
      remUnit: 16,
      exclude: /node_modules|folder_name/i
    }
  }
}
