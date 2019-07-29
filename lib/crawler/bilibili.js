const base = require('./base')
const debug = require('debug')('crawler:bilibili')
const request = require('request')
const cheerio = require('cheerio')
const async = require('async')
const util = require('../util')

class bilibili extends base {
    constructor() {
        super()
    }

    async getData({ keyword }) {
        let body = await this.getSearchList({ keyword })
        if (typeof body != 'object') body = JSON.parse(body)
        if (body && body.data && body.data.result) {
            this.emit(this.eventName.GETDATA, {type:"bilibili",data:__parset(body.data.result,this)})
            if (body.data.numPages > body.data.page) {  //模拟分页获取所有数据
                for (let i = body.data.page + 1; i <= body.data.numPages; i++) {
                    let temp = await this.getSearchList({ keyword, page: i })
                    if (temp) {
                        temp = JSON.parse(temp)
                        if (temp.data && temp.data.result) {
                            this.emit(this.eventName.GETDATA,{type:"bilibili",data:__parset(temp.data.result,this)})
                        }
                    }
                }
            }
        }
        function __parset(list,that){
            return list.map(info =>{
                return that.setVideoModel({
                    id : info.aid,
                    author : info.author,
                    cover : 'https:' + info.pic,
                    url : info.arcurl,
                    title : info.title,
                    desc : info.description,
                    create_time:info.pubdate
                })
            })
        }
    }

    async getDataByURL({ url }) {

    }

    async getHot({ top = 100 }) {
        let url = `https://www.bilibili.com/ranking?spm_id_from=333.334.b_62616e6e65725f6c696e6b.3`
        let body = await this.crawler({ url })
        let splitStr = 'window.__INITIAL_STATE__=', endSplitStr = ';(function()'
        let tempStr = body && body.substring(body.indexOf(splitStr) + splitStr.length, body.length)
        tempStr = tempStr && tempStr.substring(0, tempStr.indexOf(endSplitStr))
        tempStr = util.jsonParse(tempStr)
        let rankList = tempStr && tempStr.rankList
        if (rankList) {
            let temp1 = rankList.map(info => {
                return this.setVideoModel({
                    id: info.aid,
                    author: info.author,
                    cover: info.pic,
                    url: `https://www.bilibili.com/video/av${info.aid}`,
                    title: info.title,
                    create_time:info.pubdate
                })
            })
            this.emit(this.eventName.GETHOT, {type:"bilibili",data:temp1})
        }
    }

    /**
     * 获取查询列表
     * @param {*} param0 
     */
    async getSearchList({ keyword, page = 1, search_type = 'video' }) {
        let url = `https://api.bilibili.com/x/web-interface/search/type?search_type=${search_type}&highlight=1&keyword=${encodeURIComponent(keyword)}&page=${page}&jsonp=jsonp&callback=`
        const option = {
            headers: {
                Referer: `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`,
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
            }
        }
        return new Promise(function (resove, reject) {
            request.get(url, option, function (error, response, body) {
                if (error) {
                    reject(error)
                }
                debug(`getSearchList:${body}`)
                resove(body)
            })
        })
    }

    /**
     * 获取视频/音频下载地址
     * @param {*} url 
     */
    async getDownloadUri({ url }) {
        let body = await this.crawler({ url })
        const $ = cheerio.load(body)
        // console.log("script:",$("script")[0]);
        let playinfo = null
        for (let key of Object.keys($('script'))) {
            let temp = $('script')[key]
            if (temp && temp.children && temp.children[0] && temp.children[0].data && temp.children[0].data.indexOf('__playinfo__') > -1) {
                let obj = temp.children[0].data.replace('window.__playinfo__=', '')
                playinfo = JSON.parse(obj)
            }
        }
        let video = null, audio = null
        if (playinfo && playinfo.data) {
            video = playinfo.data.durl && Array.isArray(playinfo.data.durl) && playinfo.data.durl[playinfo.data.durl.length - 1].url
            if (!video) {
                video = playinfo.data.dash && playinfo.data.dash.video && Array.isArray(playinfo.data.dash.video) && playinfo.data.dash.video[playinfo.data.dash.video.length - 1].baseUrl
                audio = playinfo.data.dash && playinfo.data.dash.audio && Array.isArray(playinfo.data.dash.audio) && playinfo.data.dash.audio[playinfo.data.dash.audio.length - 1].baseUrl
            }
        }
        return { video, audio }
    }

    async crawler({ url }) {
        return new Promise(function (resove, reject) {
            request.get({
                url: url,
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
                },
                gzip: true
            }, function (error, response, body) {
                if (error) reject(error)
                else {
                    debug(`crawler:${body}`)
                    resove(body)
                }
            })
        })
    }

}
module.exports = bilibili