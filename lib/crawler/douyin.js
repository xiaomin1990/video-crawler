const base = require('./base')
const util = require('../util')
const debug = require('debug')('crawler:douyin')



class douyin extends base {
    constructor(options) {
        super(options)
    }

    async getData({data}) {
        if(!data) return null
        data = util.jsonParse(data)
        if(data.status_code != "0" || !data.aweme_list) return null
        let aweme_list = data.aweme_list.map(info => {
            return this.setVideoModel({
                id: info.aweme_id,
                author: info.author && info.author.nickname,
                cover: info.video && info.video.origin_cover && info.video.origin_cover.url_list &&  info.video.origin_cover.url_list[0],
                url: info.video && info.video.play_addr_265 && info.video.play_addr_265.url_list && info.video.play_addr_265.url_list[0],
                title: "",
                desc: info.desc,
                create_time: info.create_time
            })
        })
        debug(`emit GETDATA,data:${JSON.stringify({type:"douyin",data:aweme_list})}`)
        this.emit(this.eventName.GETDATA,{type:"douyin",data:aweme_list})
    }


}

module.exports = douyin