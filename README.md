# JSRoute module

## Wherefore?

The module allows to generate URIs and URLs based on server-side defined routes.

## Setup

Place module in `/modules/` and include the call in your bootstrap.
Also, you need to include jquery plugin, like this:

```html
<script type="text/javascript" src="/media/js/jquery.kohana.router-0.3.js"></script>
```

## Usage Examples

### Generate URIs and URLs

Add your stuff to `onload` callback and pass it to constructor:

```javascript
var onload = function () {
    this.get('media').uri({file: 'img/logo.png'});   // media/img/logo.png
    this.url('media', {file: 'img/logo.png'});       // /media/img/logo.png
    this.url('media', {file: 'img/logo.png'}, true); // http://domain.com/media/img/logo.png
};

var router = $.kohanaRouter({
    onload: onload
});
```

or add as property:

```javascript
router.onload = onload;
```

It is assumed that on the server the route is set

```php
Route::set('media', 'media(/<file>)', array(
        'file' => '.+',
    ))
    ->defaults(array(
        'controller' => 'foo',
        'action'     => 'bar',
        'file'       => null,
    ));
```

By defaults router requests all routes (except filtrated, see bellow) from the server. You may specify array of routes that you really need:

```javascript
var list = ['foo', 'bar'];
```

and pass it to constructor:

```javascript
var router = $.kohanaRouter({
    // ...
    list: list
    // ...
});
```

or define it as defaults:

```javascript
$.kohanaRouter.defaults.list = list;
```

### Security and filter

For security reasons (or for decrease overhead) you may add to the filter some routes, that should not be passed to client.
For example, if you have `admin` route

```php
Route::set('admin', 'admin/<action>')
    ->defaults(array(
        'controller' => 'baz',
        'action'     => 'bat',
    ));
```

add to blacklist it in [config](https://github.com/Invis1ble/kohana-jsroute/blob/master/config/jsroute.php) of the module

```php
'filter' => array(
    // ...
    'admin', // crackers no need to know this :)
    // ...
),
```

### Customization

#### Callbacks

You may want to handle AJAX `error` event and you have this ability. Simply you need to specify `onerror` callback like this:

```javascript
var onerror = function (jqXHR, textStatus, errorThrown) {
    // some sode
};
```

and pass this function to constructor:

```javascript
var router = $.kohanaRouter({
    // ...
    onerror: onerror
    // ...
});
```

or add as property:

```javascript
router.onerror = onerror;
```

#### Controller url

By defaults url of source is `/jsroute/get` and it correspond to backend, but you can redefine this setting if need:

```javascript
$.kohanaRouter.defaults.source = '/foo/bar';
```

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)