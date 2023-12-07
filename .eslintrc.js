module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2021,
    sourceType: "module",
  },

  extends: ["plugin:prettier/recommended"],

  plugins: ["@typescript-eslint", "prettier"],

  rules: {
    "no-console": "off",
  },
}
