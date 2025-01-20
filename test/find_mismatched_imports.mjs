import fg from 'fast-glob';
import path from 'path';
import * as readline from 'node:readline';
import * as fs from 'node:fs';

const mismatchedImports = [];

// Find all test files in the banners folder, create a stream to iterate over them
const stream = fg.stream( 'test/banners/*/**/*.ts' );

// Regular expression to match import statements. We only care about the path part
// and that it contains the pattern "banners/CHANNEL_NAME/CAMPAIGN_NAME"
const importRegex = /import .+ from .+(banners\/\w+\/\w+)/;

for await ( const entry of stream ) {
	// skip thank_you banners, they are not organized by campaign
	if ( entry.includes( 'test/banners/thank_you' ) ) {
		continue;
	}

	// Extract expected path from entry, e.g. "banners/desktop/C24_WMDE_Desktop_01"
	const pathParts = entry.split( path.sep );
	// drop "test" prefix
	pathParts.shift();
	const expectedPath = pathParts.slice( 0, 3 ).join( path.sep );

	// Check each line of the file for mismatched imports
	const lineReader = readline.createInterface( {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		input: fs.createReadStream( entry ),
	} );
	let lineNumber = 1;
	for await ( const line of lineReader ) {
		const match = line.match( importRegex );
		if ( match && !match[ 1 ].includes( expectedPath ) ) {
			mismatchedImports.push( { entry, line, lineNumber } );
		}
		lineNumber++;
	}
}

if ( mismatchedImports.length === 0 ) {
	// Don't print anything if there are no mismatches, be a good POSIX citizen
	process.exit( 0 );
}

console.log( 'The following banner tests import from the wrong campaign folders:' );
console.log( mismatchedImports );
process.exit( 1 );
