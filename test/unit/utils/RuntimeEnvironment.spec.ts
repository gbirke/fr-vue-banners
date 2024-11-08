import { describe, expect, it, test } from 'vitest';

import { LocationSlice, UrlRuntimeEnvironment } from '@src/utils/RuntimeEnvironment';
describe( 'UrlRuntimeEnvironment', function () {

	const newLocation = ( queryParams: string ): LocationSlice => ( {
		search: queryParams
	} );

	test.each( [
		[ '?devMode=1', true ],
		[ '?devMode=true', true ],
		[ '?p=devModeIsOn', true ],
		[ '?devbanner=Desktop_Test_DE_5', true ],
		[ '', false ]
	] )( 'can detect if is in development mode', function ( queryParams: string, expected: boolean ) {
		const environment = new UrlRuntimeEnvironment( newLocation( queryParams ) );
		expect( environment.isInDevMode ).toBe( expected );
	} );

	test.each( [
		[ '?devMode=1', false ],
		[ '?devMode=true', false ],
		[ '?p=devModeIsOn', false ],
		[ '?devbanner=Desktop_Test_DE_5', true ],
		[ '', false ]
	] )( 'can detect if is in the development environment', function ( queryParams: string, expected: boolean ) {
		const environment = new UrlRuntimeEnvironment( newLocation( queryParams ) );
		expect( environment.runsInDevEnvironment ).toBe( expected );
	} );

	it( 'checks location only once', function () {
		const location = newLocation( '?devMode=1' );
		const environment = new UrlRuntimeEnvironment( location );
		expect( environment.isInDevMode ).toBe( true );
		location.search = '';
		expect( environment.isInDevMode ).toBe( true );
	} );

	it( 'returns the delay value if not in dev mode', function () {
		const environment = new UrlRuntimeEnvironment( newLocation( '' ) );
		expect( environment.getBannerDelay( 7500 ) ).toBe( 7500 );
	} );

	it( 'returns a delay of 1 microsecond if in dev mode', function () {
		const environment = new UrlRuntimeEnvironment( newLocation( '?devMode=1' ) );
		expect( environment.getBannerDelay( 7500 ) ).toBe( 1 );
	} );
} );
