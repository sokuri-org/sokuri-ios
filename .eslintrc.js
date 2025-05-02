module.exports = {
  root: true,
  parser: "babel-eslint",
  extends: ["@react-native", "plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020
  },
  plugins: ["prettier", "import", "react"],
  rules: {
    "prettier/prettier": "error",
    "no-console": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
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
        extensions: [".js", ".jsx"],
      },
    },
  },
};
