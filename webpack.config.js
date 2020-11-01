const path=require("path");
module.exports = {
  entry: "./src/index.tsx",
  output: {
      filename: "bundle.js",
      path: __dirname + "/public/dist"
  },

  // Enable source maps for debugging webpack's output.
  devtool: "source-map", //MYNOTE --if we use 'source-map' we don see our source automatically -only if we open //# inline-source-map
  
  mode: 'development',

  resolve: {
      // Add '.ts', '.tsx', 'js', 'json' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
      rules: [
          // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
          { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
          {test: /\.mp3$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: '../src/sound/'
            }
        },

          // All output '.js' files will have any source maps re-processed by 'source-map-loader'.
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  /*externals: {
    "react": "React",
    "react-dom": "ReactDOM"
}*/ //MY NOTES this section causes error
  
};    