import {MainEventBus} from "./MainEventBus.lib.js";
import {TweenMax} from "./GreenSock.lib.js";

export class View{
    constructor(model){
        const _ = this;
        _.model = model;
        _.actions = [];

      //  _.initLog()
        //
    }
    initLog(){
        const _ = this;
        setTimeout(function () {
            _.log(`${_.componentName} загружен`,'',`color:#fff;padding:10px 10px 5px 35px;border-radius:3px;background:url("http://grammla.kz/gengine/${_.modulePage}.svg") forestgreen 10px center no-repeat;background-size:20px;`);
        })

    }
    /*-------------- Методы обработки событий ---------------------*/
    triggerWithEvent(eventData,currentAction){
        let
            rawAction = eventData['item'].dataset[currentAction].split(':'),
            component = rawAction[0],
            action = rawAction[1];
        MainEventBus.trigger(component,action,eventData);
    }
    /*-------------- Методы обработки событий ---------------------*/

    /*-------------- Методы очистки ---------------------*/
    clearBody(cont){
        const _ = this;
        let
            pageBody  = systemConts['content'].querySelector('.page-body');
        if(cont){
            pageBody = cont;
        }
        if(pageBody) {
            while (pageBody.firstElementChild) {
                pageBody.firstElementChild.remove();
            }
        }
    }
    clearCont(cont){
        if(!cont) return;
        while (cont.firstElementChild) {
            cont.firstElementChild.remove();
        }
    }
    /*-------------- Методы очистки ---------------------*/


    /*-------------- Методы выборки ---------------------*/
    getDataAttr(elem,dataName){
        if(!elem) return;
        return (dataName in elem.dataset) ? elem.dataset['dataName'] : null;
    }
    /*-------------- Методы выборки ---------------------*/


    /*-------------- Методы создания ---------------------*/
    makeid(){
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz"+Math.random();

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    createTpl(tpl,tplName='') {
        const _ = this;
        if (tplName && _[tplName]){
           return  _[tplName];// = elem;
        }
        try{
            let elem = (function cr(tpl){
                if (!tpl['childes']) return tpl['el'];

                let parent = tpl['el'];
                for (let child of tpl['childes']) {
                    parent.append(cr(child));
                }
                return  parent;
            })(tpl);
            if (tplName){
                _[tplName] = elem;
            }
            return elem;
        } catch (e) {
            _.log( `Ошибка создания шаблона в модуле ${_.componentName}--------${e}`,'error');
        }
    }
    log(msg,type='',params){
        const _ = this;
        console.count('Глубина вызовов');
        //console.log(params);
        switch (type) {
            case 'error':{
                console.log(`%c%s`,
                    `font-family:"Helvetica";text-transform:uppercase;background-color:#F79141;color:#222;font-weight:700;padding:5px;margin-bottom:2px;`,
                   msg);
            }break;
            default:{
                let
                    componentNameStyle = `margin-right:5px;color:#fff;padding:10px 10px 5px 35px;border-radius:2px;background:url("http://grammla.kz/gengine/${_.modulePage}.svg") #88a3ff20 10px center no-repeat;background-size:20px;${params}`,
                    nameStyle =  `color:tomato;font-weight:700;padding:3px;margin-bottom:2px;${params}`,
                    propStyle =  `color:#88a3ffe8;font-weight:700;padding:3px;margin-bottom:2px;${params}`,
                    valueStyle =  `color:#a6e22e;font-weight:700;padding:3px;margin-bottom:2px;${params}`;
                if (( msg instanceof  Element)  || ( msg instanceof  Window) || ( msg instanceof  Location) || ( msg instanceof  Document)  || ( msg instanceof  DocumentFragment) ){
                    console.log(msg);
                    return;
                }
                if (typeof msg  == 'object'){
                    for (let prop in msg){
                        let propTypeName = 'Свойство:';

                        if((typeof msg[prop] == 'function')  ){
                            propTypeName = 'Функция:';
                            console.log(`%c:%c${propTypeName}%c${prop}%c||%c${msg[prop]}`,componentNameStyle,nameStyle, propStyle,'',valueStyle);
                        }else if(typeof msg[prop] == 'object'){
                            let propTypeName = 'Объект:';
                            if(msg[prop] instanceof  Array){
                                propTypeName = 'Массив:';
                            }
                            console.log(`%c:%c${propTypeName}%c${prop}%c||%c${msg[prop]}`,componentNameStyle,nameStyle, propStyle,'',valueStyle);
                            let outParams = '';
                            if(params) outParams = params;
                            outParams+= 'margin-left:10px;';
                            console.groupCollapsed(prop);
                            _.log(msg[prop],type='',outParams);
                            console.groupEnd(prop);
                        }else{
                            console.log(`%c:%c${propTypeName}%c${prop}%c||%c${msg[prop]}`,componentNameStyle,nameStyle, propStyle,'',valueStyle);
                        }
                    }

                }else{
                    console.log(`%c%s`,
                        `text-transform:uppercase;color:#a6e22e;font-weight:700;padding:10px;margin-bottom:2px;${params}`,
                        msg)
                }



            }
        }
    }
    createEl(elemName,className,params){
        if(!elemName) return null;
        let element = document.createElement(elemName);
        if(className) element.className = className;
        if(params){
            for(let param in params){
                if(param === 'text'){
                    if(element.tagName === 'INPUT'){
                        element.value = params[param];
                    }else{
                        element.textContent = params[param];
                    }
                }else{
                    element.setAttribute(param,params[param]);
                }
            }
        }
        return element;
    }
    /*-------------- Методы создания ---------------------*/


    /*-------------- Методы обновления ---------------------*/
    setDataAttr(elem,dataName,dataValue=""){
        if(!elem) return;
        elem.setAttribute(dataName,dataValue);
    }
    updateEl(elem,className,params){
        if(!elem) return null;
        if(className) {
            if (elem.className != className) elem.className = className;
        }
        if(params){
            for(let param in params){
                if(param === 'text'){
                    if(elem.tagName === 'INPUT'){
                        elem.value = params[param];
                    }else{
                        elem.textContent = params[param];
                    }
                }else{
                    elem.removeAttribute(param);
                    elem.removeAttribute('data-lang');
                    elem.setAttribute(param,params[param]);
                }
            }
        }

        //console.log(elem,className,params)
        return elem;
    }
    selectCurrentTab(tab){
        let tabParent = tab.parentNode;
        tabParent.querySelectorAll('.active').forEach(el=>{el.classList.remove('active')});
        tab.classList.add('active');
    }
    /*-------------- Методы обновления ---------------------*/


    /*-------------- Методы заполнения контента ---------------------*/
    wf(){
        systemConts['content'].classList.add('wf');
    }

    settingsTpL(){
        return null;
    }tabsTpL(){
        return null;
    }
    tableTpl(){
        const _ =this;
        return null;
    }
    tableRowTpl(){
        const _ =this;
        return null;
    }
    async tableRowsTpl(itemsData= {page:1}){
        const _ = this;
        let rows = itemsData['items'] ? itemsData['items'] : await _.model.getTableItems(itemsData),
            childes = [];
        for (let row of rows){
            let rowTpl = {el:_.tableRowTpl(row)};
            childes.push(rowTpl);
        }
        let
            tableClass = itemsData['tableClass'] ? itemsData['tableClass'] : '.page-table',
            template = itemsData['template'] ? itemsData['template'] : 'tableRowsTpl',
            searchMethod = itemsData['searchMethod'] ? itemsData['searchMethod'] : 'search',
            tableCont = systemConts['content'].querySelector(tableClass),
            tBody = tableCont.tBodies[0];
        _.clearBody(tBody);
        Functions.showLoader(tBody);
        tBody.append(_.createTpl({el:document.createDocumentFragment(),childes:childes}));
        let calcData = {
            type: itemsData['type'],
            query: itemsData['query']
        };
        let itemsCount = await MainEventBus.trigger(_.componentName,'calcItemsCount',calcData);//  _.ctrl.calcItemsCount(itemsData['type']);

        _.loadPagination({
            cnt:itemsCount,
            tableClass: tableClass,
            template: template,
            searchMethod: searchMethod
        });

        Functions.hideLoader(tBody);
        return tBody;
    }


    loadPagination(paginationData){
        const _ = this;
        return new Promise(function (resolve) {
            let content = systemConts['content'],
                tableClass = paginationData['tableClass'],
                paginationClass = paginationData['paginationClass'] ? paginationData['paginationClass'] : '.page-pagination',
                tableContainer = content.querySelector(tableClass),
                paginationContainer = content.querySelector(paginationClass);
            _.pages = Math.ceil(paginationData['cnt'] / parseInt(_.model.perPage));
            paginationData['pages'] = _.pages;
            if(_.pages <= 1){
                if(paginationContainer){
                    paginationContainer.remove();
                }
                return;
            }
        if (isNaN(_.pages)) resolve(true);
            let paginationTpl = _.paginationTpl(paginationData);
            if(tableContainer){
                if (!paginationContainer){
                    tableContainer.parentNode.append(paginationTpl);
                }else{
                    paginationContainer.querySelector('.page-pagination-cnt').textContent = _.pages;
                }
            }
            resolve(systemConts['content']);
        })
    }
    /*-------------- Методы заполнения контента ---------------------*/


    /*-------------- Шаблоны ---------------------*/


    formTpl(){
        const _ =this;
        return null;
    }
    paginationTpl(paginationData= {pages:1}){
        const _ = this;
        let tpl = {
            el:_.createEl('DIV','page-pagination'),
            childes: [{
                el:_.createEl('BUTTON','page-btn',{'data-click-action':`${_.componentName}:prevPage`}),
                childes:[
                    {
                        el:_.createEl('IMG',null,{src:'/workspace/img/prev.svg' })
                    }
                ]},{
                el:_.createEl('STRONG',null,{text:'1'})
            },{
                el:_.createEl('INPUT','pagination-page',{type:'text',pattern:'[0-9]',value:'1',
                    'data-search-method':`${paginationData['searchMethod']}`,
                    'data-template':`${paginationData['template']}`,
                    'data-input-action':`${_.componentName}:goPage`
                })
            },{
                el:_.createEl('STRONG','page-pagination-cnt',{text:`${paginationData['pages']}`})
            },{
                el:_.createEl('BUTTON','page-btn',{'data-click-action':`${_.componentName}:nextPage`}),
                childes:[
                    {
                        el:_.createEl('IMG',null,{src:'/workspace/img/next.svg' })
                    }
                ]}
            ]
        };
        return _.createTpl(tpl);
    }

    /*-------------- Шаблоны ---------------------*/


}