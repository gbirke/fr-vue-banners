import { shallowMount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SelectionInput from '@src/components/Footer/SelectionInput.vue';
import { TimerStub } from '@test/fixtures/TimerStub';

describe( 'SelectionInput.vue', () => {

	beforeEach( () => {
		vi.useFakeTimers();
	} );

	afterEach( () => {
		vi.restoreAllMocks();
	} );

	const getWrapper = (): VueWrapper<any> => {
		return shallowMount( SelectionInput, {
			props: {
				value: 'value'
			},
			global: {
				provide: {
					timer: new TimerStub()
				}
			}
		} );
	};

	it( 'sets prop value as both values', () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '.wmde-banner-selection-input-input' ).element.value ).toBe( 'value' );
		expect( wrapper.find( '.wmde-banner-selection-input-text' ).text() ).toBe( 'value' );
	} );

	it( 'sets focusedValue as input text when one is provided as a prop', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { focusedValue: 'focusedValue' } );

		expect( wrapper.find<HTMLInputElement>( '.wmde-banner-selection-input-input' ).element.value ).toBe( 'focusedValue' );
		expect( wrapper.find( '.wmde-banner-selection-input-text' ).text() ).toBe( 'value' );
	} );

	it( 'selects text on focus', () => {
		const wrapper = getWrapper();

		const input = wrapper.find<HTMLInputElement>( '.wmde-banner-selection-input-input' );
		input.trigger( 'focus' );
		vi.runAllTimers();
		const selected = input.element.value.slice( input.element.selectionStart, input.element.selectionEnd );

		expect( selected ).toBe( 'value' );
	} );

	it( 'sets and removes focus class', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { focusedValue: 'focusedValue' } );

		const input = wrapper.find<HTMLInputElement>( '.wmde-banner-selection-input-input' );

		await input.trigger( 'focus' );

		expect( wrapper.classes() ).toContain( 'focused' );

		await input.trigger( 'blur' );

		expect( wrapper.classes() ).not.toContain( 'focused' );
	} );
} );
