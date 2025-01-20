import typescriptEslint from '@typescript-eslint/eslint-plugin';
import formatting from './formatting.mjs';

export default {
	name: 'WMDE FUN TypeScript Coding Style',
	plugins: {
		...formatting.plugins,
		'@typescript-eslint': typescriptEslint,
	},
	rules: {
		...formatting.rules,
		...typescriptEslint.configs.recommended.rules,

		'@typescript-eslint/array-type': [ 'error', { 'default': 'array' } ],
		'@typescript-eslint/explicit-function-return-type': [ 'error', {
			'allowExpressions': true,
			'allowTypedFunctionExpressions': true,
			'allowHigherOrderFunctions': true,
		} ],
		'@typescript-eslint/explicit-module-boundary-types': [ 'error' ],
		'@typescript-eslint/explicit-member-accessibility': [ 'error', { 'accessibility': 'explicit' } ],
		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-empty-interface': [ 'error', { 'allowSingleExtends': true } ],
		'@typescript-eslint/no-this-alias': 'error',
		// problematic in TypeScript / ES6
		'@typescript-eslint/no-unused-vars': [ 'error', { 'argsIgnorePattern': '^_' } ],
		'@typescript-eslint/no-useless-constructor': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/unified-signatures': 'error',

	},
};
