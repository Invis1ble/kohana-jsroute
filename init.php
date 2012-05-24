<?php defined('SYSPATH') or die('No direct script access.');

Route::set('jsroute', 'jsroute/get')
    ->defaults(array(
        'controller' => 'jsroute',
        'action'     => 'get',
    ));