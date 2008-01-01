// CobaltUI must be included only once.
if(typeof window.CobaltUI == 'undefined') {

/*

	YaweOS's Cobalt User Interface
		< http://www.yawe.org/ >
		< http://www.yawe.org/cobalt/ui >

 	Copyright 2007 - The YaweOS's Development Team
 	    < http://www.yawe.org/contact >

	YaweOS is released under the
	GNU General Public License (GPL) version 3
	provided with this release in license.txt
	or via web at gnu.org/licenses/gpl.txt

*/

// Start: CobaltExtender (CobEx) - Can be used for extending any object
if(typeof window.cobex == 'undefined')
    window.cobex = function(object, newobject){if(typeof object!='object'||typeof newobject!='object')return false;for(var key in newobject){if(window.cobexAddExtender)newobject[key]=window.cobexAddExtender(newobject[key]);object[key]=newobject[key];}return true;}
if(typeof window.cobexAddExtender == 'undefined')
    window.cobexAddExtender = function(object){if(typeof object!='object')return object;if(typeof object.extend!='function')object.extend=function(extend){return window.cobex(this, extend);};for(var key in object){if(typeof object[key]=='object')object[key]=window.cobexAddExtender(object[key]);}return object;}
// End: CobaltExtender (CobEx)

// Base Object
var CobaltUI = {
	version: '0.1',
	isIE: (navigator.appName == 'Microsoft Internet Explorer'),

	extend: function(extend)
	{
	    return window.cobex(this, extend);
	}
}

}