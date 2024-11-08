import { Translator } from '@src/Translator';
import { NumberFormatter } from '@src/utils/DynamicContent/formatters/NumberFormatter';
import { DonationFormItems } from '@src/utils/FormItemsBuilder/DonationFormItems';
import { FormItem } from '@src/utils/FormItemsBuilder/FormItem';

export default class FormItemsBuilder {
	private readonly _formItems: DonationFormItems;
	private readonly _translator: Translator;
	private readonly _amountFormatter: NumberFormatter;

	public constructor( translator: Translator, amountFormatter: NumberFormatter ) {
		this._translator = translator;
		this._amountFormatter = amountFormatter;
		this._formItems = {
			intervals: [],
			amounts: [],
			paymentMethods: [],
			addressType: []
		};
	}

	private translate( item: FormItem ): FormItem {
		return {
			value: item.value,
			label: this._translator.translate( item.label ),
			className: item.className,
			notice: item.notice ? this._translator.translate( item.notice ) : null
		};
	}

	private formatAmounts( amount: number ): FormItem {
		return {
			value: String( amount ),
			label: this._amountFormatter( amount ),
			className: `amount-${amount}`
		};
	}

	public setIntervals( ...intervals: FormItem[] ): FormItemsBuilder {
		this._formItems.intervals = intervals.map( this.translate, this );
		return this;
	}

	public setAmounts( ...amounts: number[] ): FormItemsBuilder {
		this._formItems.amounts = amounts.map( this.formatAmounts, this );
		return this;
	}

	public setPaymentMethods( ...paymentMethods: FormItem[] ): FormItemsBuilder {
		this._formItems.paymentMethods = paymentMethods.map( this.translate, this );
		return this;
	}

	public setAddressTypes( ...addressType: FormItem[] ): FormItemsBuilder {
		this._formItems.addressType = addressType.map( this.translate, this );
		return this;
	}

	public getItems(): DonationFormItems {
		return this._formItems;
	}

}
