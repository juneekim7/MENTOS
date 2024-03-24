module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['@stylistic'],
    rules: {
        '@stylistic/quotes': ['error', 'single'],
        '@stylistic/indent': ['error', 4],
        '@stylistic/semi': ['error', 'never'],
        '@stylistic/arrow-parens': ['error'],
        '@stylistic/arrow-spacing': ['error'],
        '@stylistic/block-spacing': ['error'],
        '@stylistic/brace-style': ['error'],
        '@stylistic/comma-dangle': ['error', {'generics': 'ignore'}],
        '@stylistic/comma-spacing': ['error'],
        '@stylistic/comma-style': ['error'],
        '@stylistic/computed-property-spacing': ['error'],
        '@stylistic/dot-location': ['error', 'property'],
        '@stylistic/eol-last': ['error', 'never'],
        '@stylistic/function-call-spacing': ['error'],
        '@stylistic/jsx-closing-bracket-location': ['error'],
        '@stylistic/jsx-closing-tag-location': ['error'],
        '@stylistic/jsx-indent': ['error', 4],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { 'varsIgnorePattern': '^_', 'argsIgnorePattern': '^_' }]
    },
}