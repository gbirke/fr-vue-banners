import { SizeIssueChecker } from '@src/utils/SizeIssueChecker/SizeIssueChecker';
import { Vector2 } from '@src/utils/Vector2';

export class WindowSizeIssueChecker implements SizeIssueChecker {
	private readonly _minimumAllowedWidth: number;

	/**
	 * This is for adding or removing space from the banner dimensions to allow individual
	 * banners to adjust the parameters of when they are shown
	 */
	private readonly _manualSpaceAdjustment: Vector2 = Vector2.ZERO;

	public constructor( minimumAllowedWidth: number = 0, manualSpaceAdjustment: Vector2 = Vector2.ZERO ) {
		this._minimumAllowedWidth = minimumAllowedWidth;
		this._manualSpaceAdjustment = manualSpaceAdjustment;
	}

	public hasSizeIssues( bannerDimensions: Vector2, skinSpaceAdjustment: Vector2 ): boolean {
		const adjustedBannerDimensions = bannerDimensions
			.add( this._manualSpaceAdjustment )
			.add( skinSpaceAdjustment );

		const bannerWidth = window.innerWidth;
		const spaceUnderBanner = window.innerHeight - adjustedBannerDimensions.y;

		return spaceUnderBanner <= 0 || bannerWidth < this._minimumAllowedWidth;
	}
}
