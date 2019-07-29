
const Crawler =  require('./lib/crawler/douyin')

let _Crawler =  new Crawler()
_Crawler.watchFile()
_Crawler.on(_Crawler.eventName.WATCHFILE_CHANGE,(data) =>{
   if(data.type == "douyin"){
      _Crawler.getData({data:data.data})
   }
})
_Crawler.on(_Crawler.eventName.GETDATA,data =>{
   console.log("data:",data)
})
