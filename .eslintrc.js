module.exports = {
  root: true,
  extends: ["@react-native", "plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["prettier", "import", "react"],
  rules: {
    "prettier/prettier": "error",
    "no-console": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    "import/extensions": "off",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "unknown",
        ],
        pathGroups: [
          { pattern: "react*", group: "external", position: "before" },
          { pattern: "@hooks/*", group: "internal", position: "after" },
          { pattern: "@pages/*", group: "internal", position: "after" },
          { pattern: "@components/*", group: "internal", position: "after" },
        ],
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
