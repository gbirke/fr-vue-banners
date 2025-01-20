import pluginVue from 'eslint-plugin-vue';

/**
 * This is an ESLint flat configuration object to configure the formatting rules of the Wikimedia Deutschland FUN team.
 * It's heavily inspired by the Wikimedia eslint-config-wikimedia package.
 */
export default {
	name: 'WMDE FUN Vue Coding Style Formatting',
	plugins: {
		'vue': pluginVue,
	},
	rules: {
		'vue/array-bracket-spacing': [ 'error', 'always' ],
		'vue/block-spacing': 'error',
		'vue/brace-style': [ 'error', '1tbs' ],
		'vue/comma-spacing': [ 'error', { before: false, after: true } ],
		'vue/comma-style': [ 'error', 'last' ],
		'vue/dot-location': [ 'error', 'property' ],
		'vue/func-call-spacing': 'error',
		'vue/keyword-spacing': 'error',
		'vue/object-curly-spacing': [ 'error', 'always' ],
		'vue/space-in-parens': [ 'error', 'always', { exceptions: [ 'empty' ] } ],
		'vue/space-infix-ops': 'error',
		'vue/space-unary-ops': [ 'error', { words: true, nonwords: false } ],
	},
};
