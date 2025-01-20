import pluginVue from 'eslint-plugin-vue';

export default {
	plugins: {
		vue: pluginVue,
	},
	rules: {
		'vue/component-tags-order': [ 'error', {
			'order': [ 'template', 'script', 'style' ],
		} ],
		'vue/html-indent': [ 'error', 'tab' ],
		'vue/html-closing-bracket-newline': 'off',

		// NEEDS_TEAM_DECISION
		/*
		'vue/max-attributes-per-line': [ 'warn', {
			'singleline': 2,
			'multiline': 1,
		} ],
		'vue/no-boolean-default': [ 'error', 'default-false' ],
		 */
		'vue/no-deprecated-scope-attribute': 'error',
		'vue/no-deprecated-slot-attribute': 'error',
		'vue/no-deprecated-slot-scope-attribute': 'error',
		'vue/no-duplicate-attr-inheritance': 'error',
		'vue/no-invalid-model-keys': 'error',
		'vue/no-multiple-objects-in-class': 'error',
		'vue/no-reserved-component-names': [ 'error', {
			'disallowVueBuiltInComponents': true,
			'disallowVue3BuiltInComponents': true,
		} ],
		'vue/no-static-inline-styles': [ 'error', {
			'allowBinding': true,
		} ],
		'vue/no-undef-properties': 'error',
		'vue/no-undef-components': 'error',
		'vue/no-unused-properties': [ 'error', {
			'groups': [ 'props', 'data', 'computed', 'methods', 'setup' ],
			'deepData': false,
			'ignorePublicMembers': true,
		} ],
		'vue/no-unused-refs': 'error',
		'vue/no-use-computed-property-like-method': 'error',
		'vue/no-useless-mustaches': 'error',
		// NEEDS_TEAM_DECISION
		// 'vue/no-useless-v-bind': 'error',
		'vue/no-v-text': 'error',
		'vue/brace-style': [ 'error', '1tbs', { 'allowSingleLine': true } ],
		'vue/padding-line-between-blocks': [ 'error', 'always' ],
		'vue/v-on-function-call': 'error',
		'vue/component-name-in-template-casing': [ 'error', 'PascalCase' ],
		'vue/no-child-content': 'error',
		'vue/no-expose-after-await': 'error',
		// NEEDS_TEAM_DECISION
		// 'vue/prefer-separate-static-class': 'error',
		'vue/no-v-text-v-html-on-component': 'error',
	},
};
