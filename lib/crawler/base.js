const EventEmitter = require('events');
const fs = require('fs')
const watch = require('../fs-watch-file')
const watcher = watch({ persistent: true })
const debug = require('debug')('crawler:base')

class base extends EventEmitter {
    /**
     * 
     * @param {*} options 
     * {
     *    type: app|web  爬取对象app或者web 默认web
     *    url: web地址  type=web时不能为空
     *    watchFile: 监听文件路径 type=app时不能为空
     *    asyncNum: 并发数量
     *    
     * 
     * }
     */
    constructor() {
        super()
        this.eventName = {
            WATCHFILE_CHANGE: "WATCHFILE_CHANGE",  //监听文件变化事件
            WATCHFILE_FAIL: "WATCHFILE_FAIL",  //监听文件事件
            GETDATA: "GETDATA",  //获取搜索数据事件
            GETHOT: "GETHOT"  //获取热门数据事件
        }
        let key = "douyin"
        let filepath = '/Users/xiaoleo/Documents/local/api.amemv.com/aweme/v1/search/item/%3fversion_code%3d5.8.0%26pass-region%3d1%26pass-route%3d1%26js_sdk_version%3d1.13.3.0%26app_name%3daweme%26vid%3dE90D4C3F-52CB-4DD3-BFE9-FA76F04DE677%26app_version%3d5.8.0%26device_id%3d37037063005%26channel%3dApp%2520Store%26mcc_mnc%3d46007%26aid%3d1128'
        watcher.add(filepath, key)
    }

    /**
     * 获取视频
     * @param {*} keyword 关键字
     * @param {*} data 源数据
     */
    async getData({ keyword,data }) {
        debug('get video and audio by keyword')
    }

    /**
     * 监听文件变化，用于监听 charles mirror 文件
     * @param {} filePath  
     */
    async watchFile() {
        watcher.on('change', ev => {  //ev = { filepath: filepath,key:key }
            fs.readFile(ev.filepath, 'utf8',(err, data) => {
                this.emit(this.eventName.WATCHFILE_CHANGE, {type:ev.key,data:data})
            })
        })
        watcher.on('error', err => {
            let msg = `fail  watched: ${err.filepath}`
            debug(msg)
            this.emit(this.eventName.WATCHFILE_FAIL, msg)
            watcher.add(err.filepath)
        })
    }

    /**
     * 通过url获取数据
     *  @param {*} url 
     */
    async getDataByURL({ url }) {
        debug('get video and audio by url')
    }

    /**
     * 获取热门视频
     * @param {'*'} top   
     */
    async getHot({ top = 100 }) {
        debug('get hot video and audio')
    }

    setVideoModel({id,author,cover,url,title,create_time}) {
        return {id,author,cover,url,title,create_time}
    }


    /**
     * 保存数据到数据库或者本地文件
     */
    async saveData() {
        debug('saveData to database or local file')
    }


}

module.exports = base;
