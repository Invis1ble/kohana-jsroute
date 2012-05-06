# JSRoute module

## Wherefore?

The module allows to generate URL based on server-side defined routes.

## Setup

Place module in /modules/ and include the call in your bootstrap.

## Usage Example

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
            'controller' => 'catalog',
            'action'     => 'media',
            'file'       => null,
        ));