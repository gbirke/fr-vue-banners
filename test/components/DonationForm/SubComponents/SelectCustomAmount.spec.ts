import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import SelectCustomAmount from '@src/components/DonationForm/SubComponents/SelectCustomAmount.vue';

describe( 'SelectCustomAmount.vue', () => {

	let wrapper: VueWrapper<any>;
	beforeEach( () => {
		wrapper = shallowMount( SelectCustomAmount, {
			// attachTo: document.body allows us to test if the text field was focused
			attachTo: document.body,
			props: {
				placeholder: 'placeholder-text',
				fieldName: 'fld-custom-amount',
				inputValue: ''
			}
		} );
	} );

	it( 'updates the CSS classes when a value is entered', async () => {
		await wrapper.setProps( { inputValue: '2500' } );

		expect( wrapper.attributes( 'class' ) ).toContain( 'value-entered' );
	} );

	it( 'emits event when a value is entered', async () => {
		await wrapper.find<HTMLInputElement>( 'input[type=text]' ).setValue( '5555' );

		expect( wrapper.emitted( 'update:inputValue' ).length ).toBe( 1 );
		expect( wrapper.emitted( 'update:inputValue' )[ 0 ] ).toEqual( [ '5555' ] );
	} );

	it( 'updates the CSS classes when input field gets focused', async () => {
		await wrapper.find<HTMLInputElement>( 'input[type=text]' ).trigger( 'focus' );

		expect( wrapper.attributes( 'class' ) ).toContain( 'focused' );
	} );

	it( 'should check radio button when input field is focused', async () => {
		await wrapper.find<HTMLInputElement>( 'input[type=text]' ).trigger( 'focus' );

		expect( wrapper.find<HTMLInputElement>( 'input[type=radio]' ).element.checked ).toBeTruthy();
	} );

	it( 'should check radio button when input field has custom amount', async () => {
		await wrapper.setProps( { inputValue: '2500' } );

		expect( wrapper.find<HTMLInputElement>( 'input[type=radio]' ).element.checked ).toBeTruthy();
	} );

	it( 'should show euro symbol when field is focused', async () => {
		expect( wrapper.find( '.wmde-banner-select-custom-amount-euro-symbol' ).exists() ).toBe( false );

		await wrapper.find<HTMLInputElement>( 'input[type=text]' ).trigger( 'focus' );

		expect( wrapper.find( '.wmde-banner-select-custom-amount-euro-symbol' ).exists() ).toBe( true );
	} );

	it( 'should show euro symbol when field has an entered value', async () => {
		expect( wrapper.find( '.wmde-banner-select-custom-amount-euro-symbol' ).exists() ).toBe( false );

		await wrapper.setProps( { inputValue: '2500' } );

		expect( wrapper.find( '.wmde-banner-select-custom-amount-euro-symbol' ).exists() ).toBe( true );
	} );

	it( 'renders field name of radio input', async () => {
		expect( wrapper.find( 'input[type=radio]' ).attributes( 'name' ) ).toBe( 'fld-custom-amount' );
	} );

	it( 'checks if radio element has focus on click', async () => {
		await wrapper.find( '.wmde-banner-select-custom-amount-radio' ).trigger( 'click' );

		expect( wrapper.find( 'input[type=text]' ).element ).toBe( document.activeElement );
	} );

	it( 'should propagate focus event on text input to the parent', async () => {
		await wrapper.find<HTMLInputElement>( 'input[type=text]' ).trigger( 'focus' );

		expect( wrapper.emitted( 'focus' ).length ).toBe( 1 );
	} );

	it( 'should propagate focus event when the radio button is clicked', async () => {
		await wrapper.find( '.wmde-banner-select-custom-amount-radio' ).trigger( 'click' );

		expect( wrapper.emitted( 'focus' ).length ).toBe( 1 );
	} );

	it( 'should propagate blur event on text input to the parent', async () => {
		await wrapper.find<HTMLInputElement>( 'input[type=text]' ).trigger( 'blur' );

		expect( wrapper.emitted( 'blur' ).length ).toBe( 1 );
	} );

	it( 'selects text on focus', async () => {
		await wrapper.setProps( { inputValue: '42424242' } );

		const input = wrapper.find<HTMLInputElement>( 'input[type=text]' );
		await input.trigger( 'focus' );

		const selected = input.element.value.slice( input.element.selectionStart, input.element.selectionEnd );

		expect( selected ).toBe( '42424242' );
	} );

	it( 'should hide placeholder when the input has focus', async () => {
		const input = wrapper.find<HTMLInputElement>( 'input[type=text]' );

		await input.trigger( 'focus' );

		expect( input.attributes( 'placeholder' ) ).toBe( '' );
	} );

	it( 'should render the placeholder when the input in out of focus', async () => {
		const input = wrapper.find<HTMLInputElement>( 'input[type=text]' );

		expect( input.attributes( 'placeholder' ) ).toBe( 'placeholder-text' );
	} );
} );
