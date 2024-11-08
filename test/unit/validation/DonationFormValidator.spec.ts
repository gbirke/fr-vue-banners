import { beforeEach, describe, expect, it, test } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import { AmountValidity } from '@src/utils/FormModel/AmountValidity';
import { Validity } from '@src/utils/FormModel/Validity';
import { DonationFormValidator } from '@src/validation/DonationFormValidator';
import { resetFormModel } from '@test/resetFormModel';

describe( 'DonationFormValidator', () => {

	const model = useFormModel();

	// The model values are in the global scope, and they need to be reset before each test
	beforeEach( () => resetFormModel( model ) );

	test.each( [
		[ '', '', AmountValidity.Invalid ],
		[ '', '0', AmountValidity.TooLow ],
		[ '', '0.99', AmountValidity.TooLow ],
		[ '', '1', AmountValidity.Valid ],
		[ '100', '', AmountValidity.Valid ],
		[ '', '99999.99', AmountValidity.Valid ],
		[ '', '100000', AmountValidity.TooHigh ]
	] )( 'sets amount validity during validation', (
		amountInputInEuros: string,
		customAmountInputInEuros: string,
		expectedAmountValidity: AmountValidity
	) => {
		model.selectedAmount.value = amountInputInEuros;
		model.customAmount.value = customAmountInputInEuros;

		( new DonationFormValidator( model ) ).validate();

		expect( model.amountValidity.value ).toBe( expectedAmountValidity );
	} );

	it( 'should set interval validity to invalid when interval is not set', function () {
		model.interval.value = '';

		( new DonationFormValidator( model ) ).validate();

		expect( model.intervalValidity.value ).toBe( Validity.Invalid );
	} );

	it( 'should set interval validity to valid when interval is set', function () {
		model.interval.value = '0';

		( new DonationFormValidator( model ) ).validate();

		expect( model.intervalValidity.value ).toBe( Validity.Valid );
	} );

	it( 'should set paymentMethod validity to invalid when paymentMethod is not set', function () {
		model.paymentMethod.value = '';

		( new DonationFormValidator( model ) ).validate();

		expect( model.paymentMethodValidity.value ).toBe( Validity.Invalid );
	} );

	it( 'should set paymentMethod validity to valid when paymentMethod is set', function () {
		model.paymentMethod.value = '0';

		( new DonationFormValidator( model ) ).validate();

		expect( model.paymentMethodValidity.value ).toBe( Validity.Valid );
	} );

	test.each( [
		[ '', '0', 'UEB', false ],
		[ '', '', 'UEB', false ],
		[ '', '', '', false ],
		[ '0', '', '', false ],
		[ '1', '', '', false ],
		[ '1', '0', '', false ],
		[ '', '0', '', false ],
		[ '1', '', 'PPL', false ],
		[ '1', '0', 'UEB', true ]
	] )( 'should return the validation result', (
		amountInputInEuros: string,
		interval: string,
		paymentMethod: string,
		expectedValidationResult: boolean
	) => {
		model.selectedAmount.value = amountInputInEuros;
		model.interval.value = interval;
		model.paymentMethod.value = paymentMethod;

		expect( ( new DonationFormValidator( model ) ).validate() ).toBe( expectedValidationResult );
	} );
} );
