export interface CampaignProjectionParameters {
	donationTarget: number,
	/**
     * The date where the number of donors (donorsBase) and donation sum (baseDonationSum) were measured
     */
	updatedAt: string,
	donationSumBase: number,
	donationCountBase: number,
	donationAmountPerMinute: number,
	donationCountPerMinute: number,
	/**
     * Needed to calculate missing number of donors by dividing the projected amount missing
     */
	averageAmountPerDonation: number
}

export interface ThankYouCampaignParameters {
	numberOfDonors: number;
	numberOfMembers: number;
	progressBarPercentage: number;
}

/**
 * Campaign parameters is a value object with string and number primitives used to pass values from
 * the "environment" of the banner (i.e. wikipedia.org or wikipedia.de) to the dynamic text rendering.
 */
export interface CampaignParameters {
	campaignProjection: CampaignProjectionParameters,
	millionImpressionsPerDay: number,

	/**
     * Date in YYYY-MM-DD format
     */
	startDate: string,

	/**
     * Date in YYYY-MM-DD format (code will automatically add the time of 23:59:59)
     */
	endDate: string,
	numberOfMembers: number,
	isLateProgress: boolean,
	dramaTextIsVisible: boolean,
	urgencyMessageDaysLeft: number,

	thankYouCampaign: ThankYouCampaignParameters
}
