/**
 * Created by Fabio on 03/06/2017.
 */
const u = require('url');
const rp = require('request-promise');

/**
 * Get song title from icecast v2.4
 * @param url
 * @param mount
 * @returns {PromiseLike<T> | Promise<T>}
 */
function getFromIcecast(url, mount) {

    if(typeof url === 'undefined')
        throw new Error('required url');

    if(typeof mount === 'undefined')
        throw new Error('required mount');

    url = url + '/status-json.xsl';

    return rp(url).then(function (body) {
        let data = JSON.parse(body);
        let title = '';
        for(let i in data['icestats']['source']){
            if(data['icestats']['source'].hasOwnProperty(i)){
                let urlObj = u.parse(data['icestats']['source'][i]['listenurl']);
                if(urlObj.pathname.replace('/','') === mount && data['icestats']['source'][i]['title'] ){
                    title = data['icestats']['source'][i]['title'];
                    break;
                }
            }
        }
        return title;
    });

}

/**
 * Get song title from shoutcast v2
 * @param url
 * @param sid
 * @returns {PromiseLike<T> | Promise<T>}
 */
function getFromShoutcast2(url, sid) {

    if(typeof url === 'undefined')
        throw new Error('required url');

    if(typeof sid === 'undefined')
        throw new Error('required sid');

    url = url + '/stats?sid=' + sid + '&json=1';

    return rp(url).then(function (body) {
        let data = JSON.parse(body);
        return data['songtitle']
    });

}

/**
 * Get song title from shoutcast v1
 * @param url
 * @returns {PromiseLike<T> | Promise<T>}
 */
function getFromShoutcast(url) {

    if(typeof url === 'undefined')
        throw new Error('required url');

    url = url + '/7.html';

    return rp({
        uri: url,
        headers: {
            'User-Agent': 'StreamTitle for Mozilla'
        }
    }).then(function (body) {
        let match = (/<body>\d*,\d*,\d*,\d*,\d*,\d*,([\s\S]*?)<\/body>/).exec(body);
        return match && match[1].length > 0 ? match[1] : '';
    });
}

/**
 * Retrieve song info
 * @param args
 * @returns {*}
 */
function streamTitle(args) {

    if(typeof args.type === 'undefined')
        throw new Error('required type');

    switch (args.type) {
        case 'shoutcast2':
            return getFromShoutcast2(args.url, args.sid);

        case 'icecast':
            return getFromIcecast(args.url, args.mount);

        case 'shoutcast':
            return getFromShoutcast(args.url);
    }

}

/**
 * Public method
 * @type {streamTitle}
 */
module.exports = streamTitle;