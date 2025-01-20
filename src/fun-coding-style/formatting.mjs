import eslintStylistic from '@stylistic/eslint-plugin';

/**
 * This is an ESLint flat configuration object to configure the space-heavy formatting rules of the Wikimedia Deutschland FUN team.
 * It's heavily inspired by the Wikimedia eslint-config-wikimedia package.
 */
export default {
	name: 'WMDE FUN Coding Style Formatting',
	plugins: {
		'@stylistic': eslintStylistic,
	},
	rules: {
		'@stylistic/array-bracket-spacing': [ 'error', 'always' ],
		'@stylistic/block-spacing': 'error',
		'@stylistic/brace-style': [ 'error', '1tbs' ],
		'@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
		'@stylistic/comma-spacing': [ 'error', { before: false, after: true } ],
		'@stylistic/comma-style': [ 'error', 'last' ],
		'@stylistic/computed-property-spacing': [ 'error', 'always' ],
		'@stylistic/dot-location': [ 'error', 'property' ],
		'@stylistic/eol-last': 'error',
		'@stylistic/func-call-spacing': 'error',
		'@stylistic/indent': [ 'error', 'tab', { SwitchCase: 1 } ],
		'@stylistic/keyword-spacing': 'error',
		'@stylistic/linebreak-style': [ 'error', 'unix' ],
		'@stylistic/max-len': [ 'warn', {
			code: 170,
			tabWidth: 4,
			ignorePattern: '^[\\s]*(//|<!--) (es|style)lint-.+',
			ignoreUrls: true,
			ignoreComments: false,
			ignoreRegExpLiterals: true,
			ignoreStrings: true,
			ignoreTemplateLiterals: true,
		} ],
		'@stylistic/max-statements-per-line': [ 'error', { max: 1 } ],
		'@stylistic/member-delimiter-style': 'error',
		'@stylistic/new-parens': 'error',
		'@stylistic/no-floating-decimal': 'error',
		'@stylistic/no-tabs': [ 'error', { allowIndentationTabs: true } ],
		'@stylistic/no-trailing-spaces': 'error',
		'@stylistic/no-whitespace-before-property': 'error',
		'@stylistic/object-curly-spacing': [ 'error', 'always' ],
		'@stylistic/quotes': [ 'error', 'single', { allowTemplateLiterals: true } ],
		'@stylistic/semi': [ 'error', 'always' ],
		'@stylistic/semi-spacing': [ 'error', { before: false, after: true } ],
		'@stylistic/semi-style': [ 'error', 'last' ],
		'@stylistic/space-before-blocks': [ 'error', 'always' ],
		'@stylistic/space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' } ],
		'@stylistic/space-in-parens': [ 'error', 'always', { exceptions: [ 'empty' ] } ],
		'@stylistic/space-infix-ops': 'error',
		'@stylistic/space-unary-ops': [ 'error', { words: true, nonwords: false } ],
		'@stylistic/spaced-comment': [ 'error', 'always', {
			exceptions: [ '*', '!' ],
			block: { balanced: true },
		} ],
		'@stylistic/switch-colon-spacing': [ 'error', { after: true, before: false } ],
		'@stylistic/type-annotation-spacing': [ 'error', {
			'before': false,
			'after': true,
			'overrides': {
				'arrow': {
					'before': true,
					'after': true,
				},
				'colon': {
					'before': false,
					'after': true,
				},
			},
		} ],
		'@stylistic/wrap-iife': 'error',
	},
};
