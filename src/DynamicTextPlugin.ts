import { App } from 'vue';
import { CampaignParameters } from '@src/domain/CampaignParameters';
import { Translator } from '@src/Translator';
import DynamicCampaignText from '@src/utils/DynamicContent/DynamicCampaignText';
import { Formatters } from '@src/utils/DynamicContent/Formatters';
import { ImpressionCount } from '@src/utils/ImpressionCount';

interface DynamicCampaignTextOptions {
    date: Date;
    translator: Translator;
    formatters: Formatters;
    campaignParameters: CampaignParameters;
    impressionCount: ImpressionCount;
	urgencyMessageDaysLeft?: number;
}

export default {
	install( app: App, options: DynamicCampaignTextOptions ): void {
		app.provide( 'dynamicCampaignText', new DynamicCampaignText(
			options.date,
			options.translator,
			options.formatters,
			options.campaignParameters,
			options.impressionCount,
			options.urgencyMessageDaysLeft
		) );
	}
};
