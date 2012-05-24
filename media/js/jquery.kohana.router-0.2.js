/**
 * kohanaRouter
 * Allows to dynamically generate URI and URL based on server-side defined routes
 * 
 * @package    JSRoute
 * @author     Max Invis1ble
 * @copyright  Copyright (c) <2012> <Max Invis1ble>
 * @version    0.3
 * @since      2012-05-04 14:39:16
 * @license    http://www.opensource.org/licenses/mit-license.php MIT
 */
;!function ($, window, undefined) {
    
    "use strict";
    
    var sanitize = function (str) {
            return str.replace(/\/+$/g, '');
        },
        
        compile = function (protocol, host, uri) {
            return sanitize(/:\/\//.test(host) ? host : protocol + host) + '/' + uri;
        },
        
        parseUrl = function (str) {
            var key = ['source', 'scheme', 'host', 'port', 'path'],
                matches = /^(?:([^:\/?#]+):)?(?:\/\/(?:(?:[^:@]*:?[^:@]*)?@)?([^:\/?#]*)(?::(\d*))?)?((?:[^?#\/]*\/)*[^?#]*)/.exec(str),
                uri = {},
                i = 5;

            while (i --) {
                if (matches[i]) {
                    uri[key[i]] = matches[i];
                }
            }
            
            delete uri.source;
            return uri;
        },
        
        KohanaRouterError = function (message) {
            this.message = message;
            this.stack = (new Error).stack;
        };
    
    KohanaRouterError.prototype = function () {
        var F = function (){};
        F.prototype = Error.prototype;
        return new F;
    }();
    
    KohanaRouterError.prototype.name = 'KohanaRouterError';
    
    var Route = function (data, router) {
        this.defaults = data.defaults;
        delete data.defaults;
        this.data = data;
        this.router = router;
        this.isExternal = $.inArray((this.defaults.host ? this.defaults.host : false), router.localhosts) == -1;
        this.staticUri = /(?:<|\))/.test(data.uri)
            ? false
            : this.isExternal ? compile(router.protocol, this.defaults.host, data.uri) : data.uri;
    };
    
    Route.prototype = {
        
        constructor: Route,
        
        uri: function (params) {
            if (this.staticUri) {
                return this.staticUri;
            }
            
            var uri = this.data.uri,
                params = params || {},
                optional = /\([^()]+\)/,
                segment = new RegExp(this.router.key),
                match,
                search,
                replace;
            
            while (match = uri.match(optional)) {
                search = match[0];
                replace = search.substr(1, search.length - 2);
                
                while (match = replace.match(segment)) {
                    if (params[match[1]] !== undefined) {
                        replace = replace.replace(match[0], params[match[1]]);
                    }
                    else {
                        replace = '';
                        break;
                    }
                }
                
                uri = uri.replace(search, replace);
            }
            
            while (match = uri.match(segment)) {
                if (params[match[1]] === undefined) {
                    if (this.defaults[match[1]] !== undefined && this.defaults[match[1]] !== null) {
                        params[match[1]] = this.defaults[match[1]];
                    }
                    else {
                        throw new KohanaRouterError('Required route parameter not passed: ' + match[1]);
                    }
                }
                
                uri = uri.replace(match[0], params[match[1]]);
            }
            
            uri = sanitize(uri).replace(/\/\/+/g, '/');
            
            if (this.isExternal) {
                uri = compile(this.router.protocol, this.defaults.host, uri);
            }
            
            return uri;
        },
        
        /**
         * @todo implement
         */
        match: function (uri) {}
        
    };
    
    var Router = function (options) {
        var self = this,
            ajaxOptions,
            props = ['base', 'index', 'protocol', 'localhosts', 'key'],
            i = 5,
            name;
        
        this.options = $.extend({}, $.kohanaRouter.defaults, options);
        this.routes = {};
        this.loaded = false;
        
        this.onload = this.options.onload || this.onload;
        this.onerror = this.options.onerror || this.onerror;
        
        ajaxOptions = {
            dataType: 'json',
            success: function (response) {
                while (i --) {
                    self[props[i]] = response[props[i]];
                }
                for (name in response.routes) {
                    self.routes[name] = new Route(response.routes[name], self);
                }
                
                self.components = parseUrl(self.base);
                if (!self.components.host) {
                    self.components.host = window.location.host;
                }
                if (self.index) {
                    self.base += self.index + '/';
                }
                
                self.loaded = true;
                self.onload();
            },
            error: $.proxy(this.onerror, this)
        };
        
        if (this.options.list.length) {
            ajaxOptions.type = 'POST';
            ajaxOptions.data = {list: this.options.list};
        }
        else {
            ajaxOptions.type = 'GET';
        }
        
        $.ajax(this.options.source, ajaxOptions);
    };
    
    Router.prototype = {
        
        constructor: Router,
        
        onload: function () {},
        
        onerror: function () {},
        
        get: function (name) {
            if (this.loaded) {
                if (this.routes[name]) {
                    return this.routes[name];
                }
                throw new KohanaRouterError('The requested route is unknown: ' + name);
            }
            throw new KohanaRouterError('Method "get" could not be called until routes load');
        },
        
        url: function (name, params, protocol) {
            var route,
                uri,
                path,
                base = this.base;
            
            if (this.loaded) {
                route = this.get(name);
                uri = route.uri(params);
                
                if (route.isExternal) {
                    return uri;
                }
                
                path = uri.replace(/(?:^\/+|\/+$)/g, '').replace(/^[-a-z0-9+.]+:\/\/[^\/]+\/?/, '');
                
                if (/[^\x00-\x7F]/.test(path)) {
                    path.replace(/[^\/]+/g, function (segment) {
                        return encodeURIComponent(segment);
                    });
                }
                if (protocol === true) {
                    protocol = window.location.protocol.substr(0, window.location.protocol.length - 1);
                }
                if (!protocol) {
                    protocol = this.components.scheme ? this.components.scheme : null;
                }
                if (typeof(protocol) == 'string') {
                    if (this.components.host) {
                        base = this.components.path ? this.components.path : '';
                    }
                    
                    base = protocol + '://' + this.components.host + (this.components.port ? ':' + this.components.port : '') + base;
                }
                
                return base + path;
            }
            throw new KohanaRouterError('Method "url" could not be called until routes load');
        }
        
    };
    
    $.kohanaRouter = function (option) {
        var options = typeof option == 'object' && option;
        return new Router(options);
    };
    
    $.kohanaRouter.defaults = {
        list: [],
        source: '/jsroute/get'
    };
    
    $.kohanaRouter.constructor = Router;
    
}(jQuery, window);