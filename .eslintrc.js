module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
        jest: true,
    },
    globals: {
        require: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: 'module',
    },
    rules: {
        'no-var': ['error'],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'key-spacing': ['error'],
        'max-len': ['warn', 100],
        'prefer-const': ['error'],
        'arrow-spacing': ['error'],
        'no-unused-vars': ['warn'],
        semi: ['error', 'always'],
        'space-infix-ops': ['error'],

        quotes: ['error', 'single', { avoidEscape: true }],
        'eol-last': ['error', 'always'],
        'no-trailing-spaces': ['error'],
        'arrow-parens': ['error', 'as-needed'],
        'no-whitespace-before-property': ['error'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
                maxEOF: 0,
                maxBOF: 0,
            },
        ],
    },
};
