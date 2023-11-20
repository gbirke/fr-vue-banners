import { DynamicProgressBarContent } from '@src/utils/DynamicContent/DynamicProgressBarContent';

export interface DynamicContent {
	currentDayName: string;
	currentDate: string;
	currentDateAndTime: () => string;
	daysLeftSentence: string;
	campaignDaySentence: string;
	visitorsVsDonorsSentence: string;
	donorsNeededSentence: string;
	goalDonationSum: string;
	overallImpressionCount: number;
	progressBarContent: DynamicProgressBarContent;
}
