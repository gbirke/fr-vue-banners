import { UseOfFundsContent } from '@src/domain/UseOfFunds/UseOfFundsContent';

export const useOfFundsContent: UseOfFundsContent = {
	applicationOfFundsData: [],
	benefitsList: { benefits: [], headline: '' },
	callToAction: '',
	comparison: { citationLabel: '', companies: [], headline: '', paragraphs: [], subhead: '' },
	detailedReports: {
		germany: { intro: '', linkName: '', linkUrl: '' },
		international: { intro: '', linkName: '', linkUrl: '' },
		mixed: { text: '' }
	},
	intro: { headline: '', text: '' },
	orgchart: { headline: '', imageUrl: '', organizationClasses: {}, paragraphs: [] },
	provisional: ''
};
