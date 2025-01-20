import { createApp } from 'vue';
import config from '@environment/config';
import type { Component, App } from 'vue';

// Declare external "Vue" object, which might or might not exist
// In Production it's a global variable, in the dev environment it's undefined
declare var Vue: unknown;

type Data = Record<string, unknown>;

interface MediaWikiVue {
	createMwApp( rootComponent: Component, rootProps?: Data ): App
}

function isMediaWikiVue( vueObject: any ): vueObject is MediaWikiVue {
	return vueObject.createMwApp !== undefined;
}

function shouldLoadMediaWikiVue(): boolean {
	if ( config.env === 'development' ) {
		return false;
	}

	if ( typeof Vue === 'undefined' || Vue === null ) {
		return false;
	}

	if ( typeof Vue !== 'object' && typeof Vue !== 'function' ) {
		return false;
	}

	return true;
}

/**
 * This is a wrapper around createApp, which uses MediaWiki-provided Vue instance if available (i.e. in Production)
 */
export function createVueApp( rootComponent: Component, rootProps?: Data ): App {
	if ( shouldLoadMediaWikiVue() && isMediaWikiVue( Vue ) ) {
		return Vue.createMwApp( rootComponent, rootProps );
	}
	return createApp( rootComponent, rootProps );
}
