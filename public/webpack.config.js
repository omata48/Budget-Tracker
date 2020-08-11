const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    app: "./assets/js/index.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      name: "Online/Offline Budget Tracker",
      short_name: "Budget Tracker",
      description: "An application that allows you to keep track of your expenses",
      background_color: "#317EFB",
      theme_color: "#317EFB",
      display: "standalone",
      start_url: "/",
      icons: [{
        src: path.resolve("./assets/images/icons/icon-192x192.png"),
        sizes: [192, 512],
        destination: path.join("assets", "icons")
      }]
    })
  ]
};

module.exports = config;
