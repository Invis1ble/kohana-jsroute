<?php defined('SYSPATH') or die('No direct script access.');

Route::set('jsroute', 'jsroute(/<action>)', array(
        'action' => '(?:all)'
    ))
    ->defaults(array(
        'controller' => 'jsroute',
        'action'     => 'all',
    ));