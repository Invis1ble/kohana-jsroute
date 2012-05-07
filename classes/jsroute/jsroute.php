<?php defined('SYSPATH') or die('No direct script access.');

/**
 * JSRoute
 * 
 * @package    JSRoute
 * @subpackage Classes
 * @author     Max Invis1ble
 * @copyright  Copyright (c) <2012> <Max Invis1ble>
 * @version    0.1
 * @since      2012-05-04 14:43:45
 * @license    http://www.opensource.org/licenses/mit-license.php MIT
 * @abstract
 */
abstract class JSRoute_JSRoute extends Route {
    
    /**
     * Route uri getter
     * 
     * @access  public
     * @static
     * @param   Route   $route  route
     * @return  string  uri of the route
     */
    public static function get_uri(Route $route)
    {
        return $route->_uri;
    }
    
    /**
     * Retrieves all named routes.
     * 
     * @access  public
     * @static
     * @return  array routes by name
     */
    public static function all()
    {
        return array_diff_key(parent::all(), array_flip(Kohana::$config->load('jsroute.filter')));
    }
    
} // End JSRoute
