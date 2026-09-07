import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Only sync icons actually used via gbt_icon() / gbt_icon_e().
 * Add entries here when introducing new icons.
 */
const icons = [
	{ name: 'arrow-down', style: 'solid', size: 20 },
	{ name: 'arrow-down-tray', style: 'outline', size: 24 },
	{ name: 'arrow-path', style: 'outline', size: 24 },
	{ name: 'arrow-right', style: 'outline', size: 24 },
	{ name: 'arrow-top-right-on-square', style: 'outline', size: 24 },
	{ name: 'arrows-right-left', style: 'outline', size: 24 },
	{ name: 'beaker', style: 'outline', size: 24 },
	{ name: 'book-open', style: 'outline', size: 24 },
	{ name: 'calendar-days', style: 'solid', size: 16 },
	{ name: 'chat-bubble-left-right', style: 'outline', size: 24 },
	{ name: 'check', style: 'solid', size: 16 },
	{ name: 'check-badge', style: 'solid', size: 24 },
	{ name: 'clipboard-document-list', style: 'outline', size: 24 },
	{ name: 'clock', style: 'solid', size: 20 },
	{ name: 'shield-check', style: 'solid', size: 20 },
	{ name: 'sparkles', style: 'solid', size: 16 },
	{ name: 'ticket', style: 'solid', size: 20 },
	{ name: 'document-text', style: 'solid', size: 20 },
	{ name: 'exclamation-circle', style: 'solid', size: 20 },
	{ name: 'exclamation-triangle', style: 'outline', size: 24 },
	{ name: 'eye', style: 'outline', size: 24 },
	{ name: 'eye-slash', style: 'outline', size: 24 },
	{ name: 'information-circle', style: 'solid', size: 20 },
	{ name: 'key', style: 'outline', size: 24 },
	{ name: 'lifebuoy', style: 'outline', size: 24 },
	{ name: 'lock-closed', style: 'outline', size: 24 },
	{ name: 'paint-brush', style: 'outline', size: 24 },
	{ name: 'plus-circle', style: 'solid', size: 20 },
	{ name: 'question-mark-circle', style: 'outline', size: 24 },
	{ name: 'question-mark-circle', style: 'solid', size: 16 },
	{ name: 'shopping-bag', style: 'solid', size: 16 },
	{ name: 'star', style: 'solid', size: 16 },
	{ name: 'x-circle', style: 'solid', size: 20 },
	{ name: 'x-mark', style: 'solid', size: 20 },
];

const scriptDir = path.dirname( fileURLToPath( import.meta.url ) );
const root = path.resolve( scriptDir, '..' );
const src = path.join( root, 'node_modules', 'heroicons' );
const dest = path.join( root, 'icons' );

if ( ! fs.existsSync( src ) ) {
	console.error( 'heroicons not found. Run npm install first.' );
	process.exit( 1 );
}

// Clear only Heroicon size trees; keep payment/ and other non-synced assets.
for ( const size of [ '16', '20', '24' ] ) {
	fs.rmSync( path.join( dest, size ), { recursive: true, force: true } );
}

let copied = 0;
for ( const { name, style, size } of icons ) {
	const from = path.join( src, String( size ), style, `${ name }.svg` );
	const toDir = path.join( dest, String( size ), style );
	const to = path.join( toDir, `${ name }.svg` );

	if ( ! fs.existsSync( from ) ) {
		console.error( `Missing icon: ${ size }/${ style }/${ name }.svg` );
		process.exit( 1 );
	}

	fs.mkdirSync( toDir, { recursive: true } );
	fs.copyFileSync( from, to );
	copied++;
}

console.log( `Synced ${ copied } Heroicons to ./icons` );
