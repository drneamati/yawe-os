<?php
/*
	Copyright (C) 2007 Babsweb.net <contact@babsweb.net>

	GL::Core is a part of GenericLibrairies.

	GenericLibrairies is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 3 of the License, or
	(at your option) any later version.

	GenericLibrairies is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
  
/*
	__Library Informations__

	GenericLibrairies::Core (v 1.0)
	
	Core library

	[Dependencies]
	    - PHP, version 4.0.7+
			(4.0.0+ with GL::Compat)

	[Important Informations]
	    None
	    
    [Constants defined]
	    GL_LOADCONTROL_CORE
	    
	    GL_E_FATAL
	    GL_E_NOERROR
	    GL_E_NOTICE
	    GL_E_WARNING
	    
	[Classes defined]
	    None

	[Functions defined]
	    0. System
	        0.1 gl_checkDependence
	        0.2 gl_defaultErrorHandler
	        0.3 gl_errorHandler
	        0.4 gl_throw
	    
	    1. Classes & Objects
	        1.1 gl_getObjectClassName
*/

define('GL_LOADCONTROL_CORE', '1.0.0');
define('GL_LOADCONTROL_PHP', phpversion());

define('GL_E_NOERROR', 0);
define('GL_E_FATAL', 0x01);
define('GL_E_WARNING', 0x02);
define('GL_E_NOTICE', 0x08);

if(!function_exists('version_compare'))
	exit('<strong>GL::Core needs function <em>version_compare</em> which is not available, upgrade PHP or include GL::Compat first.</strong>');

//
// 0.1 - Checks that dependencies of others librairies is satisfied.
//
function gl_checkDependence($package, $version, $from)
{
	exit('<strong>Machin is dependent thing, but it requires a newer version of it.</strong>');
}

//
// 0.2 - Default error handler
//
function gl_defaultErrorHandler($error, $level, $function)
{
    $phpLevel = error_reporting();
    $display = false;

    switch($level)
    {
        case GL_E_FATAL:
            $display = (bool) ($phpLevel & GL_E_FATAL);
            break;
        case GL_E_WARNING:
            $display = (bool) ($phpLevel & GL_E_WARNING);
            break;
        case GL_E_NOTICE:
            $display = (bool) ($phpLevel & GL_E_NOTICE);
            break;
    }

    if($display)
    {
		echo '<div class="gl-error-';
		    switch($level)
		    {
		    	case GL_E_FATAL: echo 'fatal'; break;
                case GL_E_WARNING: echo 'warning'; break;
                case GL_E_NOTICE: echo 'notice'; break;
		    }
		echo '"><code>';
            switch($level)
		    {
		        case GL_E_FATAL: echo 'Fatal Error'; break;
                   case GL_E_WARNING: echo 'Warning'; break;
                   case GL_E_NOTICE: echo 'Notice'; break;
		    }
		echo ': <strong>'.htmlspecialchars($function).':</strong> '.htmlspecialchars($error).'</code></div>';
    }

    if($level == GL_E_FATAL)
    {
        echo '<div class="gl-error-die"><code>Script killed due to a fatal error.</code></div>';
    }
}

//
// 0.3 - ErrorHandler manager
//
function gl_errorHandler($newErrorHandler = false)
{
	static $errorHandler = 'gl_defaultErrorHandler';
	$exErrorHandler = $errorHandler;
	
	if($newErrorHandler)
	{
	    if(function_exists((string) $newErrorHandler))
	    {
	        $errorHandler = (string) $newErrorHandler;
	    }
	}
	
	return $exErrorHandler;
}

//
// 0.4 - Generate an error
//
function gl_throw($error, $level, $function)
{
	$errorHandler = gl_errorHandler();
	
	if(!function_exists($errorHandler))
	    $errorHandler = 'gl_defaultErrorHandler';
	    
    call_user_func($errorHandler, $error, $level, $function);
}

//
// 1.1 - Get the classname for a given object, used internally
//
function gl_getObjectClassName($object)
{
	if(!is_object($object))
	    return false;
	    
    $class = get_class($object);

    // In PHP 4, the class name is returned in lowercase. So we check that
	// the class name returned by the function exists.

	if(class_exists($class))
	    return $class;

	// Else, we try to get the correct name of class
	$declaredClasses = get_declared_classes();

	foreach($declaredClasses as $id => $name)
	{
	    $name = strtolower($name);

	    if($class == $name)
	        return $declaredClasses[$id];
	}

	return $class;
}