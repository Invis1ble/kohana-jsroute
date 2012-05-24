<?php defined('SYSPATH') or die('No direct script access.');

/**
 * JSRoute Controller
 * 
 * @package     JSRoute
 * @subpackage  Classes/Controller
 * @author      Max Invis1ble
 * @copyright   Copyright (c) <2012> <Max Invis1ble>
 * @version     0.4
 * @since       2012-05-04 14:40:27
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 * @abstract
 */
abstract class Controller_JSRoute_JSRoute extends Controller {
    
    /**
     * Response body
     *
     * @access  public
     * @var     array 
     */
    public $json = array();
    
    /**
     * Retrieves routes
     * 
     * @return  void 
     */
    public function action_get()
    {
        $this->json = array(
            'base'       => Kohana::$base_url,
            'index'      => Kohana::$index_file,
            'protocol'   => JSRoute::$default_protocol,
            'localhosts' => JSRoute::$localhosts,
            'routes'     => array(),
            
            /** @todo more complex prepare regex for javascript (e.g. implement lookbehind assertions) */
            'key'        => preg_replace('#(?<!\\\)(\?|\*|\+|\{\d+,\s*?\d+\})\+#', '$1', JSRoute::REGEX_KEY), // replace "possessive" quantifiers
        );
        
        if ($this->request->method() === Request::POST)
        {
            $routes = JSRoute::specified(Arr::get($this->request->post(), 'list', array()));
        }
        else
        {
            $routes = JSRoute::all();
        }
        
        foreach ($routes as $name => $route)
        {
            $this->json['routes'][$name] = array(
                'uri'      => JSRoute::get_uri($route),
                'defaults' => $route->defaults(),
            );
        }
    }
    
    /**
     * Sets response headers and body
     *
     * @return  mixed 
     */
    public function after()
    {
        $this->response->headers('Content-Type', 'application/json');
        $this->response->body(json_encode($this->json));

        return parent::after();
    }
    
} // End JSRoute Controller
