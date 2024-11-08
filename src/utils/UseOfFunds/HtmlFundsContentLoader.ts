import { UseOfFundsContent } from '@src/domain/UseOfFunds/UseOfFundsContent';
import { FundsContentLoader } from '@src/utils/UseOfFunds/FundsContentLoader';

export class HtmlFundsContentLoader implements FundsContentLoader {
	public getContent(): UseOfFundsContent {
		const element = document.getElementById( 'wmde-use-of-funds' );

		return JSON.parse( element.dataset.useOfFunds );
	}
}
