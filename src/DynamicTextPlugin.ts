import { App } from 'vue';
import { Translator } from '@src/Translator';
import { Formatters } from '@src/utils/DynamicContent/Formatters';
import { CampaignParameters } from '@src/domain/CampaignParameters';
import { ImpressionCount } from '@src/utils/ImpressionCount';
import DynamicCampaignText from '@src/utils/DynamicContent/DynamicCampaignText';

interface DynamicCampaignTextOptions {
	date: Date;
	translator: Translator;
	formatters: Formatters;
	campaignParameters: CampaignParameters;
	impressionCount: ImpressionCount;
	/**
	 * @deprecated This should be removed in the 2025 campaign cleanup
	 */
	urgencyMessageDaysLeft?: number;
}

export default {
	install( app: App, options: DynamicCampaignTextOptions ): void {
		app.provide( 'dynamicCampaignText', new DynamicCampaignText(
			options.date,
			options.translator,
			options.formatters,
			options.campaignParameters,
			options.impressionCount
		) );
	}
};
