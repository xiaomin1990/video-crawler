
class util {
    constructor(){

    }
    jsonParse(str){
        if(!str) return {}
        try{
            return JSON.parse(str)
        }catch(ex){
            return {}
        }
    }
}

module.exports = new util();