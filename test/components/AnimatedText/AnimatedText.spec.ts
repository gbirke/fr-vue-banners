import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HighlightedText from '@src/components/AnimatedText/AnimatedText.vue';

describe( 'AnimatedText.vue', () => {

	it( 'shows when it has text', () => {
		const wrapper = shallowMount( HighlightedText, {
			props: {
				content: 'I have text'
			}
		} );

		expect( wrapper.html() ).toStrictEqual( '<span class="wmde-banner-text-animated-highlight">I have text</span>' );
	} );

	it( 'does not show if text is empty', () => {
		const wrapper = shallowMount( HighlightedText, {
			props: {
				content: ''
			}
		} );

		expect( wrapper.html() ).toStrictEqual( '<!--v-if-->' );
	} );

} );
