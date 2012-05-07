# JSRoute module

## Wherefore?

The module allows to generate URIs and URLs based on server-side defined routes.

## Setup

Place module in /modules/ and include the call in your bootstrap.
Also, you need to include jquery plugin, like this:

    <script type="text/javascript" src="/media/js/jquery.kohana.router-0.2.js"></script>

## Usage Examples

### Generate URIs and URLs

    $.kohanaRouter({onload: function(router) {
        console.log(
            router.get('media').uri({file: 'img/logo.png'}),  // media/img/logo.png
            router.url('media', {file: 'img/logo.png'}),      // /media/img/logo.png
            router.url('media', {file: 'img/logo.png'}, true) // http://domain.com/media/img/logo.png
        );
    }});

It is assumed that on the server the route is set

    Route::set('media', 'media(/<file>)', array(
            'file' => '.+',
        ))
        ->defaults(array(
            'controller' => 'foo',
            'action'     => 'bar',
            'file'       => null,
        ));

### Security and filter

For security reasons (or for decrease overhead) you may add to the filter some routes, that should not be passed to client.
For example, if you have `admin` route

    Route::set('admin', 'admin/<action>')
        ->defaults(array(
            'controller' => 'baz',
            'action'     => 'bat',
        ));

add to blacklist it in config of the module (see `config/jsroute.php`)

	'filter' => array(
        // ...
        'admin', // crackers no need to know this :)
        // ...
    ),

### License

[MIT](http://www.opensource.org/licenses/mit-license.php)