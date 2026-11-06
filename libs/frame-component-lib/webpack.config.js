const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "not_exist_path")
        ],
        use:
        [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
