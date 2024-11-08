import { shallowMount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import SelectGroup from '@src/components/DonationForm/SubComponents/SelectGroup.vue';

describe( 'SelectGroup.vue', () => {
	let wrapper: VueWrapper<any>;

	beforeEach( () => {
		wrapper = shallowMount( SelectGroup, {
			props: {
				fieldName: 'interval',
				isValid: true,
				selectionItems: [
					{ value: '0', label: 'interval-once', className: 'interval-0' },
					{ value: '1', label: 'interval-monthly', className: 'interval-1', notice: 'notice' }
				],
				inputValue: ''
			}
		} );
	} );

	it( 'sets fieldName as class', () => {
		expect( wrapper.attributes( 'class' ) ).toContain( 'interval' );
	} );

	it( 'sets invalid css class when isValid becomes false', async () => {
		expect( wrapper.attributes( 'class' ) ).not.toContain( 'wmde-banner-select-group-container--with-error' );

		await wrapper.setProps( { isValid: false } );

		expect( wrapper.attributes( 'class' ) ).toContain( 'wmde-banner-select-group-container--with-error' );
	} );

	it( 'adds selection items as options', () => {
		expect( wrapper.find( '.interval-0' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.interval-1' ).exists() ).toBeTruthy();
	} );

	it( 'selects the current option', async () => {
		await wrapper.setProps( { inputValue: '1' } );

		expect( wrapper.find<HTMLInputElement>( '.interval-1 input' ).element.checked ).toBeTruthy();
	} );

	it( 'emits event when a radio button (value) is selected', async () => {
		await wrapper.find<HTMLInputElement>( '.interval-1 input' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:inputValue' ).length ).toBe( 1 );
		expect( wrapper.emitted( 'update:inputValue' )[ 0 ] ).toEqual( [ '1' ] );
	} );

	it( 'disables the options when disabledOptions are set', async () => {
		await wrapper.setProps( { disabledOptions: [ '1' ] } );

		expect( wrapper.find( '.interval-0 input' ).attributes( 'disabled' ) ).toBeUndefined();
		expect( wrapper.find( '.interval-1 input' ).attributes( 'disabled' ) ).toBe( '' );
		expect( wrapper.find( '.interval-1' ).attributes( 'class' ) ).toContain( 'wmde-banner-disabled' );
	} );

	it( 'displays a notice on the current option if one exists', async () => {
		await wrapper.setProps( { currentValue: '0' } );

		expect( wrapper.find( '.interval-0 .wmde-banner-select-group-notice' ).exists() ).toBeFalsy();

		await wrapper.setProps( { currentValue: '1' } );

		expect( wrapper.find( '.interval-1 .wmde-banner-select-group-notice' ).exists() ).toBeTruthy();
	} );

	it( 'displays an error message when one gets set', async () => {
		expect( wrapper.find( '.wmde-banner-select-group-error-message' ).exists() ).toBeFalsy();

		await wrapper.setProps( { errorMessage: 'this is the error message' } );
		const error = wrapper.find( '.wmde-banner-select-group-error-message' );

		expect( error.exists() ).toBeTruthy();
		expect( error.text() ).toBe( 'this is the error message' );
	} );

	it( 'displays the labels as slots if provided', () => {
		wrapper = shallowMount( SelectGroup, {
			slots: {
				'select-group-label': `<template #select-group-label><span class="custom-label"></span></template>`
			},
			props: {
				fieldName: 'interval',
				isValid: true,
				selectionItems: [
					{ value: '0', label: 'interval-once', className: 'interval-0' },
					{ value: '1', label: 'interval-monthly', className: 'interval-1', notice: 'notice' }
				],
				inputValue: ''
			}
		} );

		expect( wrapper.find( '.custom-label' ).exists() ).toBeTruthy();
	} );
} );
