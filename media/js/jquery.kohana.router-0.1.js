/**
 * jQuery plugin
 * Allows to dynamically generate URI and URL based on server-side defined routes
 * 
 * @package    JSRoute
 * @author     Max Invis1ble
 * @copyright  Copyright (c) <2012> <Max Invis1ble>
 * @version    0.2
 * @since      2012-05-04 14:39:16
 * @license    http://www.opensource.org/licenses/mit-license.php MIT
 */
(function($) {
    function Route(data) {
        var self = this;
        
        self._init = function(data) {
            $.extend(self, data);
        }
        
        self.is_external = function() {
            return $.inArray((self._defaults.host ? self._defaults.host : false), $.kohanaRouter.localhosts) === -1;
        }
        
        self.uri = function(params) {
            var uri = self._uri;
            
            if (!params) params = {};
            if (!/(?:<|\))/.test(self._uri)) {
                if (!self.is_external()) return uri;
                return (/:\/\//.test(self._defaults.host) ? self._defaults.host : $.kohanaRouter.default_protocol + self._defaults.host).replace(/\/+$/g, '') + '/' + uri;
            }
            
            var m,
                r1 = /\([^()]+\)/g,
                r2 = new RegExp($.kohanaRouter.REGEX_KEY);
            
            while (m = uri.match(r1)) {
                var search = m[0],
                    replace = search.substr(1, search.length - 2);

                while (m = replace.match(r2)) {
                    if (params[m[1]] !== undefined)
                        replace = replace.split(m[0]).join(params[m[1]]);
                    else {
                        replace = '';
                        break;
                    }
                }
                
                uri = uri.split(search).join(replace);
            }
            
            while (m = uri.match(r2)) {
                if (params[m[1]] === undefined) {
                    if (self._defaults[m[1]] !== undefined && self._defaults[m[1]] !== null) params[m[1]] = self._defaults[m[1]];
                    else $.kohanaRouter._error('Required route parameter not passed: ' + m[1]);
                }
                uri = uri.split(m[0]).join(params[m[1]]);
            }
            
            uri = uri.replace(/\/+$/g, '').replace(/\/\/+/g, '/');
            
            if (self.is_external()) {
                var host = self._defaults.host;
                if (!/:\/\//.test(host)) host = $.kohanaRouter.default_protocol + host;
                uri = host.replace(/\/+$/g, '') + '/' + uri;
            }
            
            return uri;
        }
        
        /**
         * @todo implement
         */
        self.match = function(uri) {}
        
        self._init(data);
    }
    
    $.kohanaRouter = function(options) {
        var self = this.kohanaRouter,
            loaded = false,
            routes = {};
        
        self._init = function(options) {
            if (!loaded) {
                options = $.extend(true, {
                    ajax: {
                        url: '/jsroute/all',
                        type: 'get',
                        dataType: 'json',
                        success: function(response) {
                            var props = ['base_url', 'index_file', 'default_protocol', 'localhosts', 'REGEX_KEY'], name, i;
                            for (name in response.routes) routes[name] = new Route(response.routes[name]);
                            for (i in props) self[props[i]] = response[props[i]];
                            
                            loaded = true;
                            options.onload(self);
                        }
                    },
                    onload: function() {}
                }, options);

                $.ajax(options.ajax);
            }
        }
        
        self.Error = function(message) {
            this.name = 'KohanaRouterError';
            this.message = message;
        }
        
        self._error = function(message) {
            var error = new self.Error(message);
            error.prototype = new Error();
            throw error;
        }
        
        self._parse_url = function(str) {
            var key = ['source', 'scheme', 'host', 'port', 'path'],
                m = /^(?:([^:\/?#]+):)?(?:\/\/(?:(?:[^:@]*:?[^:@]*)?@)?([^:\/?#]*)(?::(\d*))?)?((?:[^?#\/]*\/)*[^?#]*)/.exec(str),
                uri = {},
                i = 5;

            while (i --) if (m[i]) uri[key[i]] = m[i];
            delete uri.source;
            return uri;
        }
        
        self.get = function(name) {
            if (loaded) {
                if (routes[name]) return routes[name];
                self._error('The requested route does not exist: ' + name);
            }
            self._error('Method "get" could not be called until routes load');
        }
        
        self.url = function(name, params, protocol) {
            if (loaded) {
                var route = self.get(name);

                if (route.is_external())
                    return route.uri(params);
                else {
                    var path = route.uri(params).replace(/(?:^\/+|\/+$)/g, '').replace(/^[-a-z0-9+.]+:\/\/[^\/]+\/?/, ''),
                        base_url = self.base_url,
                        components = self._parse_url(base_url),
                        host = components.host ? components.host : window.location.host;
                    
                    if (/[^\x00-\x7F]/.test(path)) path = path.replace(/[^\/]+/g, function(s) {return encodeURIComponent(s);});
                    if (protocol === true) protocol = window.location.protocol.replace(/:$/, '');
                    if (!protocol) protocol = components.scheme ? components.scheme : null;
                    if (self.index_file) base_url += self.index_file + '/';
                    if (typeof(protocol) == 'string') {
                        if (components.host) base_url = components.path ? components.path : '';
                        base_url = protocol + '://' + host + (components.port ? ':' + components.port : '') + base_url;
                    }
                    
                    return base_url + path;
                }
            }
            self._error('Method "url" could not be called until routes load');
        }
        
        self._init(options);
        return self;
    }
})(jQuery);