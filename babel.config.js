module.exports = function (api) {
  api.cache(true)
  console.log(process.argv)
  return {
    presets: [
      'babel-preset-expo',
      // TODO: once I upgrade react
      // ['@babel/preset-react', { runtime: 'automatic' }],
    ],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            'react-kawaii': 'react-kawaii/lib/native/',
          },
        },
      ],
    ],
  }
}
