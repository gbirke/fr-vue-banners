import { computed, ref, watch } from 'vue';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { Intervals, RecurringIntervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { AmountValidity } from '@src/utils/FormModel/AmountValidity';
import { FormModel } from '@src/utils/FormModel/FormModel';
import { Validity } from '@src/utils/FormModel/Validity';
import { parseFloatFromFormattedString } from '@src/utils/parseFloatFromFormattedString';

export type TransactionFee = {
	fixedFee: number;
	percentage: number;
	minimumPercentage: number;
};

export const TRANSACTION_FEES = new Map<string, TransactionFee>( [
	[ 'PPL', { fixedFee: 0.35, percentage: 0.015, minimumPercentage: 0 } ],
	[ 'MCP', { fixedFee: 0.29, percentage: 0.0175, minimumPercentage: 0.35 } ]
] );

const interval = ref<string>( '' );
const intervalValidity = ref<Validity>( Validity.Unset );

const selectedAmount = ref<string>( '' );
const amountValidity = ref<AmountValidity>( AmountValidity.Unset );
const customAmount = ref<string>( '' );
const numericAmount = computed( (): number => parseFloatFromFormattedString( selectedAmount.value || customAmount.value ) );

const paymentMethod = ref<string>( '' );
const paymentMethodValidity = ref<Validity>( Validity.Unset );

const addressType = ref<string>( '' );
const addressTypeValidity = ref<Validity>( Validity.Unset );

const hasTransactionFee = ref<boolean>( false );

const disabledIntervals = computed( (): string[] => {
	if ( paymentMethod.value === PaymentMethods.SOFORT.value ) {
		return RecurringIntervals;
	} else {
		return [];
	}
} );

const disabledPaymentMethods = computed( (): string[] => {
	if ( interval.value === Intervals.ONCE.value || interval.value === '' ) {
		return [];
	} else {
		return [ PaymentMethods.SOFORT.value ];
	}
} );

const disabledAddressTypes = computed( (): string[] => {
	if ( paymentMethod.value === PaymentMethods.DIRECT_DEBIT.value ) {
		return [ AddressTypes.ANONYMOUS.value ];
	}
	return [];
} );

const transactionFee = computed( () => {
	const fee = TRANSACTION_FEES.get( paymentMethod.value );
	if ( fee === undefined ) {
		return 0;
	}
	const calculatedFee = fee.fixedFee + Math.max( numericAmount.value * fee.percentage, fee.minimumPercentage );
	// See https://stackoverflow.com/q/11832914/130121 for an in-depth analysis how to round to 2 decimal places
	return Math.round( ( calculatedFee + Number.EPSILON ) * 100 ) / 100;
} );

const totalNumericAmount = computed( () => {
	return numericAmount.value + ( hasTransactionFee.value ? transactionFee.value : 0 );
} );

watch( interval, ( newInterval: string ) => {
	if ( intervalValidity.value === Validity.Invalid && newInterval !== '' ) {
		intervalValidity.value = Validity.Valid;
	}
} );

watch( paymentMethod, ( newPaymentMethod: string ) => {
	if ( paymentMethodValidity.value === Validity.Invalid && newPaymentMethod !== '' ) {
		paymentMethodValidity.value = Validity.Valid;
	}
	if ( newPaymentMethod === PaymentMethods.DIRECT_DEBIT.value && addressType.value === AddressTypes.ANONYMOUS.value ) {
		addressType.value = '';
		addressTypeValidity.value = Validity.Unset;
	}
} );

watch( selectedAmount, ( newAmount: string, oldAmount: string ) => {
	if ( ![ AmountValidity.Unset, AmountValidity.Valid ].includes( amountValidity.value ) && newAmount !== '' ) {
		amountValidity.value = AmountValidity.Valid;
	}
	if ( oldAmount === '' && newAmount !== '' ) {
		customAmount.value = '';
	}
} );

watch( customAmount, ( newCustomAmount: string, oldCustomAmount: string ) => {
	if ( ![ AmountValidity.Unset, AmountValidity.Valid ].includes( amountValidity.value ) && newCustomAmount !== '' ) {
		amountValidity.value = AmountValidity.Valid;
	}
	if ( oldCustomAmount === '' && newCustomAmount !== '' ) {
		selectedAmount.value = '';
	}
} );

export function useFormModel(): FormModel {
	return {
		interval,
		intervalValidity,
		disabledIntervals,

		selectedAmount,
		customAmount,
		numericAmount,
		totalNumericAmount,
		amountValidity,

		paymentMethod,
		paymentMethodValidity,
		disabledPaymentMethods,
		addressType,

		addressTypeValidity,
		disabledAddressTypes,

		hasTransactionFee,
		transactionFee
	};
}
