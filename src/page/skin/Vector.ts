import { Skin } from '@src/page/skin/Skin';

class Vector implements Skin {
	protected _searchFieldId: string = 'searchInput';
	protected _editButtonSelector: string = '.mw-editsection a, .vector-menu-tabs a';

	private _searchField: HTMLInputElement;
	// TODO The next "disable" comment might be unnecessary when we upgrade to ESLint 9 and more recent versions of the TypeScript ESLint plugin
	// eslint-disable-next-line no-undef
	private _editButtons: NodeListOf<Element>;
	private _hideBannerCallback: () => void;
	private readonly _referencedHideBannerCallback: () => void;

	public constructor() {
		this._searchField = document.getElementById( this._searchFieldId ) as HTMLInputElement;
		this._editButtons = document.querySelectorAll( this._editButtonSelector );
		this._referencedHideBannerCallback = (): void => this._hideBannerCallback();

		this._searchField.addEventListener( 'focus', this._referencedHideBannerCallback );
		for ( let i = 0; i < this._editButtons.length; i++ ) {
			this._editButtons[ i ].addEventListener( 'click', this._referencedHideBannerCallback );
		}
	}

	public addHideBannerListener( hideBannerListener: () => void ): void {
		this._hideBannerCallback = hideBannerListener;
	}

	public removeEventListeners(): void {
		this._searchField.removeEventListener( 'focus', this._referencedHideBannerCallback );
		for ( let i = 0; i < this._editButtons.length; i++ ) {
			this._editButtons[ i ].removeEventListener( 'click', this._referencedHideBannerCallback );
		}
	}

	public minimumVisiblePageBeneathBanner(): number {
		return 160;
	}
}

export default Vector;
