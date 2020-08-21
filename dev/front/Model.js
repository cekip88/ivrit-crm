import { _Fetch } from './Fetch.lib.js';
import {MainEventBus} from "./MainEventBus.lib.js";
export class Model{
    constructor(){
        const _ = this;
        _.xhr = new _Fetch();
        _.dirPath = '/workspace/front/components/';
        _.settings = new Map();


        _.currentType = 'main';

        _.searchParam = 'searchQuery';
        _.requestData = {
            searchQuery: '',
            filterProps: null,
            sort: null
        };

        _.editedFields = {};
    }
    getCurrentType(){
        const _ = this;
        if( _.requestData[_.searchParam]  || _.requestData['filterProps'] || _.requestData['sort'] ){
            _.currentType = 'search';
            return 'search';
        }else{
            _.currentType = 'main';
            return 'main';
        }
    }
    set searchMethod(value){
        const _ = this;
        if (!value) return;
        _.requestData['searchMethod'] = value;
    }
    get searchMethod(){
        return this.requestData['searchMethod'];
    }
    set searchQuery(value){
        const _ = this;
        if (!_.searchParam){
            _.requestData['searchQuery'] = value;
        }
        _.requestData[_.searchParam]= value;
        _.pageType = 'search';
    }
    get searchQuery(){
        const _ = this;
        if (!_.searchParam){
            return _.requestData['searchQuery'];
        }
        return _.requestData[_.searchParam];
    }

    async acceptSettings(settings=[{name:'Items per page',prop:'perPage'}]){
        const _ = this;
        for (let setting of settings){
            let current = await MainEventBus.trigger('Settings','getSetting',{
                name: setting['name']
            });
            if ( !('name' in current) ){
                await MainEventBus.trigger('Settings','setSetting',
                    setting
                );
            }
            if(current['value'] instanceof  Array){
                let element = current['value'].filter( (elem) => elem['active'] );
                current['value'] = element[0]['value'];
            }
            _.settings.set(setting['name'],setting['prop']);

            _[setting['prop']] = current['value'];
        }
    }
    changeSetting(setting){
        const _ = this;
        if(_.settings.has(setting['name'])){
            let prop = _.settings.get(setting['name']);
            _[prop] = setting['value'];
        }
    }
    async search(page= 1){
        const _ = this;
        _.requestData['page'] = page;
        _.requestData['perPage'] = _.perPage;
        let response = await _.handler({
                method: _.requestData['searchMethod'] ? _.requestData['searchMethod'] : 'search',//'searchWord',
                data: _.requestData
            },'JSON'
        );
        _['items'] = response;
        return  response;
    }
    getInnerItem(fields,fieldName,fieldValue){
        const _ = this;
        let currentItem = fields.filter(  (item) => item[fieldName] === fieldValue );
        if(currentItem.length){
            return currentItem[0];
        }
        return null;
    }

    async handle(data,method = 'GET'){
        const _ = this;
       
        if(!data['componentName']) data['componentName'] = _.componentName;
        if(!data['type']) data['type'] = 'class';
        return await _.xhr.fetch(method,{
            path: `${ _.dirPath }handle.php`,
            data: data
        });
    }
    async handler(data,method = 'GET'){
        const _ = this;
        if(!data) return {status: 'fail'};
        if(!data['componentName']) data['componentName'] = _.componentName;
        return await _.xhr.fetch(method,{
            path: `${ _.dirPath }handler.php`,
            data: data
        });
    }
    async fileUpload(path,fileName,file){
        const _ = this;
        return await _.xhr.fileUpload(path,fileName,file);
    }
    // Выборка количества слов
    async getItemsCnt(cntData){
        const _ = this;
        let type = cntData['type'] ? cntData['type'] : 'main';

        let
            method = {
                'main' : {
                    method : 'getItemsCnt',
                    data : cntData
                },
                'search' : {
                    method : 'getSearchedCnt',
                    data : {
                        query: _.searchQuery
                    }
                }
            };
        let response = await _.handler(
            method[type],
            'JSON'
        );
        if(response['status'] === 'success'){
            return response['data']['cnt']
        }
        return 0;
    }

}