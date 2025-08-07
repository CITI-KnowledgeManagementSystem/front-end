'use client';

import { Transformer } from 'markmap-lib';
import * as markmap from 'markmap-view';
import { Markmap, loadCSS, loadJS } from 'markmap-view';

export const transformer = new Transformer();
// const { scripts, styles } = transformer.getAssets();
// console.log('markmap assets', { scripts, styles });
// if (styles) loadCSS(styles);
// if (scripts) {
// 	loadJS(scripts, {
// 		// For plugins to access the `markmap` module
// 		getMarkmap: () => markmap,
// 	});
// }