module.exports = { 
  plugins: { 
    'autoprefixer': {browsers: 'last 5 version'},
    'postcss-px2rem-exclude': {
      remUnit: 16,
      exclude: /node_modules|folder_name/i
    }
  } 
}