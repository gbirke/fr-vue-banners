import * as useOfFundsContent from 'fundraising-frontend-content/i18n/de_DE/data/use_of_funds_content.json';
import { UseOfFundsContent } from '@src/domain/UseOfFunds/UseOfFundsContent';
import { FundsContentLoader } from '@src/utils/UseOfFunds/FundsContentLoader';

export class DeJSONFundsContentLoader implements FundsContentLoader {

	public getContent(): UseOfFundsContent {
		return useOfFundsContent as UseOfFundsContent;
	}
}
