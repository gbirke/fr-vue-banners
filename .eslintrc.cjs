module.exports = {
	'extends': [
		'wikimedia',
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'plugin:import/recommended',
		'plugin:import/typescript'
	],
	'settings': {
		'import/resolver': {
			typescript: true,
			node: true
		}
	},
	'parserOptions': {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser'
	},
	'root': true,
	'env': {
		browser: true,
		node: true,
		es6: true,
		mocha: true
	},
	'globals': {
		mw: false
	},
	'plugins': [
		'@stylistic/ts'
	],
	'rules': {
		// TODO: Turn this rule back on when this is merged https://github.com/vuejs/eslint-plugin-vue/pull/2268
		'vue/no-setup-props-destructure': [ 'off' ],

		// Make unused vars throw a linter error
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',

		// We want to use const and let wherever we like. TypeScript will inform us about use-before-declaration situations
		'vars-on-top': [ 'off' ],

		// use as few quotes as possible
		'quote-props': [ 'error', 'consistent-as-needed', { keywords: true } ],

		// Allow template literals
		'quotes': [ 'error', 'single', { allowTemplateLiterals: true } ],

		// We have big monitors
		'max-len': [ 'error', { code: 180 } ],

		// jsdoc should use TypeScript type information, most doc comments may just inform about the purpose of a function/method
		'jsdoc/require-param': [ 'off' ],
		'jsdoc/require-returns': [ 'off' ],

		// This forces script and style lang in Vue single file components
		'vue/block-lang': [ 'error', {
			script: { lang: 'ts' },
			style: { lang: 'scss' }
		} ],

		// Workaround for Typescript enums, see https://github.com/typescript-eslint/typescript-eslint/issues/2483
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': [ 'error' ],

		'@stylistic/ts/type-annotation-spacing': 'error',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',

		// This forces private properties to be prefixed with an underscore
		'no-underscore-dangle': [
			'error',
			{
				allowAfterThis: true
			}
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'classProperty',
				modifiers: [ 'private' ],
				format: [ 'camelCase' ],
				leadingUnderscore: 'require'
			},
			// Allow PHP-like public CLASS_CONSTANTS
			{
				selector: 'classProperty',
				modifiers: [ 'public', 'static', 'readonly' ],
				format: [ 'UPPER_CASE' ],
				leadingUnderscore: 'forbid'
			},
			{
				selector: 'classProperty',
				modifiers: [ 'public' ],
				format: [ 'camelCase' ],
				leadingUnderscore: 'forbid'
			},
			{
				selector: 'parameterProperty',
				format: [ 'camelCase' ],
				leadingUnderscore: 'forbid'
			},
			{
				selector: 'parameter',
				format: [ 'camelCase' ],
				leadingUnderscore: 'forbid'
			}
		],
		'sort-imports': [ 'error', {
			ignoreCase: true,
			ignoreDeclarationSort: true
		} ],
		'import/order': [ 1, {
			groups: [ 'external', 'builtin', 'internal', 'sibling', 'parent', 'index' ],
			pathGroups: [
				{ pattern: '@src/createVueApp', group: 'external' },
				{ pattern: '@banners/*', group: 'internal' },
				{ pattern: '@src/*', group: 'internal' },
				{ pattern: '@test/*', group: 'internal' },
				{ pattern: '@environment/**', group: 'internal' }
			],
			alphabetize: {
				order: 'asc',
				caseInsensitive: true
			}
		} ]
	},
	'overrides': [
		{
			// enable the rule specifically for TypeScript files
			files: [ '*.ts', '*.mts', '*.cts', '*.tsx', '*.vue' ],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/explicit-member-accessibility': 'error'
			}
		}
	]
};
