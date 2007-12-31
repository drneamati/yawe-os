<?php
/*
	Copyright (C) 2007 Babsweb.net <contact@babsweb.net>

	GL::JSON is a part of GenericLibrairies.

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

	GenericLibrairies::JSON (v 1.0)
	
	JSON Encoder & Decoder

	[Dependencies]
	    - PHP, version 4.0.0+
	    - GenericLibrairies::Core, version 1.0.0+
	    - GenericLibrairies::UTF8, version 1.0.0+

	[Important Informations]
	    None
	    
	[Constants defined]
	    GL_LOADCONTROL_JSON
	    
	    GL_JSON_DEC_NOTHING
	    GL_JSON_DEC_UTF8DECODE
	    GL_JSON_DEC_USECLASSNAME
	    GL_JSON_DEC_DEFAULT
	    GL_JSON_DEC_MODE_NORMAL
	    GL_JSON_DEC_MODE_STRING
	    GL_JSON_ENC_NOTHING
	    GL_JSON_ENC_UTF8ENCODE
	    GL_JSON_ENC_ADDCLASSNAME
	    GL_JSON_ENC_DEFAULT

	[Classes defined]
	    glJson::
			encode
			decode

	[Functions defined]
	    gl_json_decode
		gl_json_escape
		gl_json_encode
*/

// Start environement check //
if(!defined('GL_LOADCONTROL_CORE'))
	exit('<strong>GenericLibrairies::Core isn\'t loaded, include GL::Core before GL::JSON.</strong>');
// End environement check //

define('GL_LOADCONTROL_JSON', '1.0.0');

//
// Don't touch below, internal constants !
//

define('GL_JSON_ENC_NOTHING', 0);
define('GL_JSON_ENC_UTF8ENCODE', 1);
define('GL_JSON_ENC_ADDCLASSNAME', 2);  // Compatibility with Zend's encoder
define('GL_JSON_ENC_DEFAULT', GL_JSON_ENC_NOTHING);

define('GL_JSON_DEC_NOTHING', 0);
define('GL_JSON_DEC_UTF8DECODE', 1);
define('GL_JSON_DEC_USECLASSNAME', 2);  // Compatibility with Zend's encoder
define('GL_JSON_DEC_DEFAULT', GL_JSON_DEC_USECLASSNAME);

define('GL_JSON_DEC_MODE_NORMAL', 1);
define('GL_JSON_DEC_MODE_STRING', 2);

//
// Object Interface, for monomaniacs :D
//
class glJson
{
	function encode($var, $params = GL_JSON_ENC_DEFAULT) { return gl_json_encode($var, $params); }
	function decode($var, $params = GL_JSON_DEC_DEFAULT) { return gl_json_decode($var, $params); }
}

//
// Decodes a JSON encoded string
//
function gl_json_decode($json)
{
	$offset = 0;
	$parseMode = GL_JSON_DEC_MODE_NORMAL;

	$spaces = array(' ', "\n", "\r", "\t");

	$escapeSearch = array('\\\\', '\\n', '\\t', '\\r', '\\b', '\\f', '\"', '\b', '\f');
	$escapeReplace  = array('\\', "\n", "\t", "\r", "\b", "\f", '"', chr(0x08), chr(0x0C));

	$result = null;

	$json = trim($json);

	$buffer = '';

	while(1)
	{
		do
		{
		    $token = $json[$offset];

		    if(in_array($token, $spaces) && $parseMode == GL_JSON_DEC_MODE_NORMAL)
		        continue;

			if($parseMode == GL_JSON_DEC_MODE_STRING)
			{
			    if($token == '\\')
			    {
			        $offset++;
	                $token = $token.$json[$offset];

	                if($token == '\\u')
	                {
	                    $unicode = $json[++$offset].$json[++$offset].$json[++$offset].$json[++$offset];
	                    $buffer .= gl_base_code2utf(intval($unicode, 16));
	                }
	                elseif(!in_array($token, $escapeSearch))
	                {
	                    break;
					}

					continue;
			    }
			    elseif($token == '"')
			    {
			        $parseMode = GL_JSON_DEC_MODE_NORMAL;
			        $buffer .= $token;
				}
				else
				{
				    $buffer .= $token;
				}
			}
			else
			{
			    if($token == '"')
			    {
			        $parseMode = GL_JSON_DEC_MODE_STRING;
			        $buffer = '"';
				}

	            $result .= $token;
			}
		}
		while(++$offset < strlen($json));

		if($parseMode == GL_JSON_DEC_MODE_STRING)
			return false;

		return $buffer;
		return $result;
	}

	return false;
}

//
// Encodes a PHP variable in JSON
//
function gl_json_encode($var, $params = GL_JSON_ENC_DEFAULT)
{
	$encoded = false;

	switch(gettype($var))
	{
	    case 'boolean':
	        $encoded = ($var) ? 'true' : 'false';
	        break;

        case 'NULL':
            $encoded = 'null';
	        break;

		case 'integer':
		case 'double':
		    $encoded = (string) $var;
	        break;

		case 'unicode': // PHP 6
		case 'string':
		    $encoded = '"'.gl_json_escape($var).'"';
	        break;

		case 'array':
		   if($var == array_values($var))
		    {
		        $encoded = '[';
		        $putComma = false;

				foreach($var as $element)
		        {
		            if($putComma)
		                $encoded .= ',';
					else
					    $putComma = true;

		            $encoded .= gl_json_encode($element, $params);
		        }

		        $encoded .= ']';

		        break;
		    }

		    // Otherwise, we work with the associative array like with an object
		    // dont break;

		case 'object':
			if(gettype($var) == 'object')
			{
			    $newvar = array();

			    if((bool)($params & GL_JSON_ENC_ADDCLASSNAME))
				{
				    $newvar['__className'] = gl_getObjectClassName($var);
				}

				$newvar = array_merge($newvar, get_object_vars($var));

				$var = $newvar;

				unset($newvar);
			}

		    $encoded = '{';
		    $putComma = false;

			foreach($var as $name => $element)
		    {
		        if($putComma)
		            $encoded .= ',';
		        else
					$putComma = true;

		        $encoded .= gl_json_encode($name, $params).':'.gl_json_encode($element, $params);
		    }

		    $encoded .= '}';

		    break;
	}

	return ((bool)($params & GL_JSON_ENC_UTF8ENCODE)) ? utf8_encode($encoded) : $encoded;
}

//
// Escapes a string for its inclusion in quotes, used internally
//
function gl_json_escape($str, $reverse = false)
{
	$search  = array('\\', "\n", "\t", "\r", "\b", "\f", '"', chr(0x08), chr(0x0C));
    $replace = array('\\\\', '\\n', '\\t', '\\r', '\\b', '\\f', '\"', '\\b', '\\f');

	if($reverse)
    	$str  = str_replace($replace, $search, $str);
	else
    	$str  = str_replace($search, $replace, $str);

	return $str;
}
