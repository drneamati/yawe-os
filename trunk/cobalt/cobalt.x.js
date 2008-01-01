// XCobalt must be included only once.if(typeof window.XCobalt == 'undefined') {/*    YaweOS's XCobalt Client        < http://www.yawe.org/ >        < http://www.yawe.org/cobalt/x >    Copyright 2007 - The YaweOS's Development Team        < http://www.yawe.org/contact >    YaweOS is released under the    GNU General Public License (GPL) version 3    provided with this release in license.txt    or via web at gnu.org/licenses/gpl.txt*/// Start: CobaltExtender (CobEx) - Can be used for extending any objectif(typeof window.cobex == 'undefined')    window.cobex = function(object, newobject){if(typeof object!='object'||typeof newobject!='object')return false;for(var key in newobject){if(window.cobexAddExtender)newobject[key]=window.cobexAddExtender(newobject[key]);object[key]=newobject[key];}return true;}if(typeof window.cobexAddExtender == 'undefined')    window.cobexAddExtender = function(object){if(typeof object!='object')return object;if(typeof object.extend!='function')object.extend=function(extend){return window.cobex(this, extend);};for(var key in object){if(typeof object[key]=='object')object[key]=window.cobexAddExtender(object[key]);}return object;}// End: CobaltExtender (CobEx)  // // XCobalt Basic Object//var XCobalt = {    version: '0.1',    isIE: (navigator.appName == 'Microsoft Internet Explorer'),    extend: function(extend) { return window.cobex(this, extend); }}  // // XWindow Object//function XCobaltWindow(workspace, id) {	    // List of informations about the window. Don't edit them directly.    this.width      = 300;  // Window width (in pixel)    this.height     = 230;  // Window height (in pixel)    this.top        = 30;   // Nb of pixels from top relativly to the workspace    this.left       = 30;   // Nb of pixels from left relativly to the workspace    this.focuslevel = 0;    // The curent focus level of the window        // Editable informations    this.id         = id;   // Id of this window in the XCobalt registry	    // A list of references to HTML parts of the Window, not to the     // value or contents!    this.components = {        // -- Default components --        // The xlook module MUST NOT edit theses componants.        workspace   : workspace,        window      : false,		        // -- Add later by the xlook module --        // The xlook module MUST define theses informations        // The xlook module MAY define others components        title       : false,	// The window title        contents    : false,	// The window main area (contents)        status      : false		// The window status bar    };	    // Internal informations, not destined to users !! DON'T EDIT THEM !!    this._basefocus = 0;        // The focus level before that the window was                                // "stickovered" (default not (window not                                 // stickovered)) Note: window can't get focus                                // levels < 1.    this._drawed    = false;    // A flag to know if the window is written                                // in the DOM tree or not (default not).}  // // XWindow Object Prototype//XCobaltWindow.prototype = {    // Draw a window on the workspace    draw: function()    {        if(!this.components.window)        {            this.components.window = document.createElement('div');            this.components.window.style.position = 'absolute';            this.components.window.xwindowId = this.id;        }        if(!this._drawed)        {            if(this.components.workspace.appendChild)		       	this.components.workspace.appendChild(this.components.window);            else			    return false;            this._drawed = true;        }        this.components.window.style.width = (this.width*1)+'px';        this.components.window.style.height = (this.height*1)+'px';        this.components.window.style.top = (this.top*1)+'px';        this.components.window.style.left = (this.left*1)+'px';        return true;    },    // Destroy (hide) the window    destroy: function()    {        this.components.workspace.removeChild(this.components.window);        this._drawed = false;        return true;    },    // Move the window    move: function(left, top)    {        this.left = left*1;        this.top = top*1;        this.components.window.style.left = this.left+'px';        this.components.window.style.top = this.top+'px';        return true;    },    // Move the window relatively    relativeMove: function(left, top)    {        this.left = this.left+(left*1);        this.top = this.top+(top*1);        this.components.window.style.left = this.left+'px';        this.components.window.style.top = this.top+'px';                return true;    },    // Resize the window    resize: function(width, height)    {        this.width = width*1;        this.height = height*1;        this.components.window.style.width = this.width+'px';        this.components.window.style.height = this.height+'px';        return true;    },    // Resize the window relatively    relativeResize: function(width, height)    {        this.width = this.width+(width*1);        this.height = this.height+(height*1);                if(this.width < 1)            this.width = 1;        if(this.height < 1)            this.height = 1;        this.components.window.style.width = this.width+'px';        this.components.window.style.height = this.height+'px';        return true;    },    // Put the window over others    focus: function()    {        if(this._basefocus > 0)        {            this.components.window.style.zIndex = XCobalt.xcore.windowGetStickNewFocus();        }        else        {            this.components.window.style.zIndex = XCobalt.xcore.windowGetNewFocus();            this.focuslevel = this.components.window.style.zIndex;        }        return true;    },    // StickOver the window --> always on top    stickover: function()    {        this._basefocus = this.focuslevel;        return this.focus();    },    // StickDown the window --> reset to the normal focus level    stickdown: function()    {        this.components.window.style.zIndex = this._basefocus;        this._basefocus = 0;        return true;    },        // Function called when a window control button is used    control: function(control)    {        switch(control)        {            case 'fullscreen':                if(this._basefocus > 0)                    return this.stickdown();                else                    return this.stickover();                break;                            case 'reduce':                break;                            case 'close':                this.destroy();                break;                            default:                return false;        }                return true;    }}  // // XCobalt's core window managment functions//XCobalt.extend({xcore:{    // Return a xwindow object    windowsList: new Array,    window: function(id)    {        if(this.windowsList[id])            return this.windowsList[id];        else            return false;    },    // Create a new window    windowOpenCallback: false,    windowOpen: function(mainDiv)    {        var newWindowId = this.windowsList.length;        this.windowsList.push(new XCobaltWindow(mainDiv, newWindowId));        var xwindow = this.window(newWindowId);        xwindow.draw();        xwindow.focus();                XCobalt.xlook.init(xwindow);            if(typeof this.windowOpenCallback == 'function')        this.windowOpenCallback(xwindow);                    return xwindow;    },        // Return a new focus level, for stickdowned window    windowHighestFocus: 0,    windowGetNewFocus: function()    {        this.windowHighestFocus++;        return this.windowHighestFocus;    },        // Return a new focus level, for stickovered window    windowHighestStickFocus: 1000000000,    windowGetStickNewFocus: function()    {        this.windowHighestStickFocus++;        return this.windowHighestStickFocus;    }}});  // // XLook: generates some beautiful windows for eyes pleasure! :D//XCobalt.extend({xlook:{    init: function(xwindow)    {        xwindow.components.window.innerHTML = '<table class="xcobalt-windowLayout"><tr class="xcobalt-windowLayout-top"><td class="xcobalt-windowLayout-top-left xcobalt-windowLayout-left"></td><td class="xcobalt-windowLayout-top-center xcobalt-windowLayout-center"><div class="xcobalt-windowLayout-top-center-div"><span class="xcobalt-windowLayout-top-center-floatLeft"></span><span class="xcobalt-windowLayout-top-center-floatRight"></span><span class="xcobalt-windowLayout-top-center-title"></span></div></td><td class="xcobalt-windowLayout-top-right xcobalt-windowLayout-right"></td></tr><tr class="xcobalt-windowLayout-middle"><td class="xcobalt-windowLayout-middle-left xcobalt-windowLayout-left"></td><td class="xcobalt-windowLayout-middle-center xcobalt-windowLayout-center"></td><td class="xcobalt-windowLayout-middle-right xcobalt-windowLayout-right"></td></tr><tr class="xcobalt-windowLayout-bottom"><td class="xcobalt-windowLayout-bottom-left xcobalt-windowLayout-left"></td><td class="xcobalt-windowLayout-bottom-center xcobalt-windowLayout-center"></td><td class="xcobalt-windowLayout-bottom-right xcobalt-windowLayout-right"></td></tr></table>';                xwindow.components.window.onclick = function() { XCobalt.xcore.window(this.xwindowId).focus(); };                // Setup somes shortcuts for somes places of the table        xwindow.components.title = xwindow.components.window.getElementsByTagName('td')[1].getElementsByTagName('span')[2];        xwindow.components.contents = xwindow.components.window.getElementsByTagName('td')[4];                xwindow.components.title.innerHTML = 'No title';                // Drag 'n Drop        xwindow.components.title.xwindowId = xwindow.id;        xwindow.components.title.onmousedown = function(event)         {            XCobalt.xcore.window(this.xwindowId).focus();                    if(XCobalt.isIE)            {                XCobalt.xlook.dragXstart = window.event.clientX;                XCobalt.xlook.dragYstart = window.event.clientY;            }            else            {                XCobalt.xlook.dragXstart = event.clientX;                XCobalt.xlook.dragYstart = event.clientY;            }                        document.body.XCobaltCurentDragId = this.xwindowId;                        document.body.onmousemove = function(event)             {                if(XCobalt.isIE)                    XCobalt.xcore.window(this.XCobaltCurentDragId).relativeMove(window.event.clientX-XCobalt.xlook.dragXstart, window.event.clientY-XCobalt.xlook.dragYstart);                else                    XCobalt.xcore.window(this.XCobaltCurentDragId).relativeMove(event.clientX-XCobalt.xlook.dragXstart, event.clientY-XCobalt.xlook.dragYstart);                if(XCobalt.isIE)                {                    XCobalt.xlook.dragXstart = window.event.clientX;                    XCobalt.xlook.dragYstart = window.event.clientY;                }                else                {                    XCobalt.xlook.dragXstart = event.clientX;                    XCobalt.xlook.dragYstart = event.clientY;                }            }                        document.body.onmouseup = function(event)             {                if(XCobalt.isIE)                {                    document.body.onmousemove = null;                    document.body.onmouseup = null;                    document.body.XCobaltCurentDragId = null;                }                else                {                    delete document.body.onmousemove;                    delete document.body.onmouseup;                    delete document.body.XCobaltCurentDragId;                }            }                        return false;        };                // Resize        xwindow.components.window.getElementsByTagName('td')[8].xwindowId = xwindow.id;        xwindow.components.window.getElementsByTagName('td')[8].onmousedown = function(event)         {            XCobalt.xcore.window(this.xwindowId).focus();            if(XCobalt.isIE)            {                XCobalt.xlook.dragXstart = window.event.clientX;                XCobalt.xlook.dragYstart = window.event.clientY;            }            else            {                XCobalt.xlook.dragXstart = event.clientX;                XCobalt.xlook.dragYstart = event.clientY;            }            document.body.XCobaltCurentDragId = this.xwindowId;            document.body.onmousemove = function(event)             {                if(XCobalt.isIE)                    XCobalt.xcore.window(this.XCobaltCurentDragId).relativeResize(window.event.clientX-XCobalt.xlook.dragXstart, window.event.clientY-XCobalt.xlook.dragYstart);                else                    XCobalt.xcore.window(this.XCobaltCurentDragId).relativeResize(event.clientX-XCobalt.xlook.dragXstart, event.clientY-XCobalt.xlook.dragYstart);                if(XCobalt.isIE)                {                    XCobalt.xlook.dragXstart = window.event.clientX;                    XCobalt.xlook.dragYstart = window.event.clientY;                }                else                {                    XCobalt.xlook.dragXstart = event.clientX;                    XCobalt.xlook.dragYstart = event.clientY;                }            }            document.body.onmouseup = function(event)             {                if(XCobalt.isIE)                {                    document.body.onmousemove = null;                    document.body.onmouseup = null;                    document.body.XCobaltCurentDragId = null;                }                else                {                    delete document.body.onmousemove;                    delete document.body.onmouseup;                    delete document.body.XCobaltCurentDragId;                }            }            return false;        };                xwindow.components.window.getElementsByTagName('td')[1].getElementsByTagName('span')[1].innerHTML = '<a href="#" onclick="XCobalt.xcore.window('+xwindow.id+').control(\'reduce\');return false;">�</a> <a href="#" onclick="XCobalt.xcore.window('+xwindow.id+').control(\'fullscreen\');return false;">#</a> <a href="#" onclick="XCobalt.xcore.window('+xwindow.id+').control(\'close\');return false;">X</a>';    }}});  //***********************// // End: XWindow Inteface ////***********************//}