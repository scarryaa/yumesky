module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": "off",
        "@typescript-eslint/semi": "off",
        "@typescript-eslint/member-delimiter-style": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
              "checksVoidReturn": false
            }
          ]
    }
}
