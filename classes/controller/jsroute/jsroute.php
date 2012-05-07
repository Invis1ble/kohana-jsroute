<?php defined('SYSPATH') or die('No direct script access.');

/**
 * JSRoute Controller
 * 
 * @package     JSRoute
 * @subpackage  Classes/Controller
 * @author      Max Invis1ble
 * @copyright   Copyright (c) <2012> <Max Invis1ble>
 * @version     0.2
 * @since       2012-05-04 14:40:27
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 * @abstract
 */
abstract class Controller_JSRoute_JSRoute extends Controller {
    
    /**
     * Response body
     *
     * @access public
     * @var    array 
     */
    public $json = array();
    
    /**
     * Configuration of the module
     * 
     * @access  protected
     * @var     object     Kohana_Config_Group
     */
    protected $_config;
    
    public function before()
    {
        $this->_config = Kohana::$config->load('jsroute');
    }
    
    /**
     * All routes
     * 
     * @return void 
     */
    public function action_all()
    {
        $this->json = array(
            'base_url'         => Kohana::$base_url,
            'index_file'       => Kohana::$index_file,
            'default_protocol' => JSRoute::$default_protocol,
            'localhosts'       => JSRoute::$localhosts,
            'routes'           => array(),
            
            /** @todo more complex prepare regex for javascript (e.g. implement lookbehind assertions) */
            'REGEX_KEY'        => preg_replace('#(?<!\\\)(\?|\*|\+|\{\d+,\s*?\d+\})\+#', '$1', JSRoute::REGEX_KEY), // replace "possessive" quantifiers
        );
        
        $routes = JSRoute::all();
        
        foreach ($routes as $name => $route)
        {
            if (!in_array($name, $this->_config['filter']))
            {
                $this->json['routes'][$name] = array(
                    '_uri'      => JSRoute::get_uri($route),
                    '_defaults' => $route->defaults(),
                );
            }
        }
    }
    
    /**
     * Sets response headers and body
     *
     * @return mixed 
     */
    public function after()
    {
        $this->response->headers('Content-Type', 'application/json');
        $this->response->body(json_encode($this->json));

        return parent::after();
    }
    
} // End JSRoute Controller
