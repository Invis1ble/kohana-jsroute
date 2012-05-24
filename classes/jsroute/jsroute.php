<?php defined('SYSPATH') or die('No direct script access.');

/**
 * JSRoute
 * 
 * @package     JSRoute
 * @subpackage  Classes
 * @author      Max Invis1ble
 * @copyright   Copyright (c) <2012> <Max Invis1ble>
 * @version     0.2
 * @since       2012-05-04 14:43:45
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
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
     * Retrieves all named routes, except filtrated.
     * 
     * @access  public
     * @static
     * @return  array  routes by name
     */
    public static function all()
    {
        return JSRoute::_filter(parent::all());
    }
    
    /**
     * Retrieves specified named routes, except filtrated.
     * 
     * @access  public
     * @static
     * @param   array  $list  Specified routes
     * @return  array  routes by name
     */
    public static function specified(array $list)
    {
        return array_intersect_key(JSRoute::all(), array_flip($list));
    }
    
    /**
     * Filters routes by configuration setting
     * 
     * @access  protected
     * @static
     * @param   array  $routes  Routes that will be filtered
     * @return  array  filtrated routes
     */
    protected static function _filter(array $routes)
    {
        return array_diff_key($routes, array_flip(Kohana::$config->load('jsroute.filter')));
    }
    
} // End JSRoute
