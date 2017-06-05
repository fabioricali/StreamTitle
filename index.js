/**
 * Created by Fabio on 03/06/2017.
 */
const u = require('url');
const rp = require('request-promise');

/**
 * Get song title from icecast v2.4
 * @param url
 * @param mount
 * @returns {Promise.<TResult>}
 */
function getByIcecast(url, mount) {

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
 * @returns {Promise.<TResult>}
 */
function getByShoutcast2(url, sid) {

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
 * @returns {Promise.<TResult>}
 */
function getByShoutcast(url) {

    if(typeof url === 'undefined')
        throw new Error('required url');

    url = url + '/7.html';

    return rp({
        uri: url,
        headers: {
            'User-Agent': 'StreamTitle for Mozilla'
        }
    }).then(function (body) {
        let match = (/<body>\d*,\d*,\d*,\d*,\d*,\d*,(.*)<\/body>/mi).exec(body);
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
            return getByShoutcast2(args.url, args.sid);
            break;

        case 'icecast':
            return getByIcecast(args.url, args.mount);
            break;

        case 'shoutcast':
            return getByShoutcast(args.url);
            break;
    }

}

/**
 * Public method
 * @type {streamTitle}
 */
module.exports = streamTitle;