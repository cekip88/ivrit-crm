import {MainEventBus} from "./MainEventBus.lib.js";
let trigger = function(item,currentAction){
    let
        rawActions = item.dataset[currentAction].split(';');
    for (let rAction of rawActions){
        let rawAction = rAction.split(':'),
            component = rawAction[0],
            action = rawAction[1];
        MainEventBus.trigger(component,action,item);
    }
}
let triggerWithEvent = function(data,currentAction){
    let
        rawActions = data['item'].dataset[currentAction].split(';');
    for (let rAction of rawActions){
        let rawAction = rAction.split(':'),
            component = rawAction[0],
            action = rawAction[1];
        MainEventBus.trigger(component,action,data);
    }
}
export class Ctrl{
    constructor(model,view,params={}){
        const _ = this;
        _.container = params.container ?  params.container : null;
        _.fill(model, 'model');
        _.fill(view, 'view');
        _.actions = [];
        _.handle();

        //console.log(_)
        //console.log(MainEventBus)
    }

    clearLoop(){
        const _ = this;
        clearInterval(_[`${_.componentName}notifies`]);
    }
    fill(elem,elemVal){
        const _ = this;
        if (typeof elem ==  'object'){
            if((elem instanceof Array) || (elem instanceof Map)){
                _[elemVal] = new Map();
                elem.forEach(function (p) {
                    _[elemVal].set(p['name'],p['value'])
                })
            }else{
                _[elemVal] = elem;
            }
        }
    }



    triggerWithEvent(data,currentAction){
        let
            rawAction = data['item'].dataset[currentAction].split(':'),
            component = rawAction[0],
            action = rawAction[1];
        MainEventBus.trigger(component,action,data);
    }
    clickHandler(e){
        const _ = this;
        //e.preventDefault();
        let item = e.target;
        if(!item) return;
        while(item != _) {
            if( ('clickAction' in item.dataset) ){
                triggerWithEvent({'item':item,'event':e},'clickAction');
                return;
            }
            item = item.parentNode;
        }
    }
    contextHandler(e){
        const _ = this;
        e.preventDefault();
        let item = e.target;
        if(!item) return;
        if(e.which == 3){
            while(item != _) {
                if( ('contextAction' in item.dataset) ){
                    triggerWithEvent({'item':item,'event':e},'contextAction');
                    return;
                }
                item = item.parentNode;
            }
        }
    }
    focusOutHandler(e){
        const _ = this;
        let item = e.target;
        if( ('outfocusAction' in item.dataset) ){
            trigger(item,'outfocusAction');
            return;
        }
    }
    changeHandler(e){
        const _ = this;
        let item = e.target;
        if( ('changeAction' in item.dataset) ){
            triggerWithEvent({'item':item,'event':e},'changeAction');
            return;
        }
    }
    inputHandler(e){
        const _ = this;
        let item = e.target;
        if( ('inputAction' in item.dataset) ){
            triggerWithEvent({'item':item,'event':e},'inputAction');
            return;
        }
    }
    keyUpHandler(e){
        let item = e.target;
        if( ('keyupAction' in item.dataset) ){
            triggerWithEvent({'item':item,'event':e},'keyupAction');
            return;
        }
    }
    submitHandler(e){
        e.preventDefault();
        let item = e.target;
        if( ('submitAction' in item.dataset) ){
            triggerWithEvent({'item':item,'event':e},'submitAction');
            return;
        }
    }
    scrollHandler(e){
        let item = e.target;
        if( ('scrollAction' in item.dataset) ){
            triggerWithEvent({'item':item,'event':e},'scrollAction');
            return;
        }
    }
    overHandler(e){
        let item = e.target;
        if( ('overAction' in item.dataset) ){
            triggerWithEvent({'item':item,'event':e},'overAction');
            return;
        }
    }

    outHandler(e){
        let item = e.target;
        if( ('outAction' in item.dataset) ){
            triggerWithEvent({'item':item,'event':e},'outAction');
            return;
        }
    }

    handle(){
        const _  = this;
        if(_.focusOutHandler) _.container.addEventListener('focusout',_.focusOutHandler);
        if(_.submitHandler) _.container.addEventListener('submit',_.submitHandler);
        if(_.clickHandler)  _.container.addEventListener('click', _.clickHandler);
        if(_.contextHandler)  _.container.addEventListener('contextmenu', _.contextHandler);
        if(_.changeHandler) _.container.addEventListener('change',_.changeHandler);
        if(_.inputHandler) _.container.addEventListener('input',_.inputHandler);
        if(_.keyUpHandler) _.container.addEventListener('keyup',_.keyUpHandler);
        if(_.overHandler) _.container.addEventListener('mouseover',_.overHandler);
        if(_.outHandler) _.container.addEventListener('mouseout',_.outHandler);
        if(_.container.querySelector('core-content')){
            if(_.scrollHandler) _.container.querySelector('.page-body').addEventListener('scroll',_.scrollHandler);
        }else{
            if(_.scrollHandler) _.container.addEventListener('scroll',_.scrollHandler);
        }
    }

    /**/
    createFullFormData(form){
        let formElements = form.elements,
            data = {};
        for(let element of formElements){
            if(!element.name) continue;
            let propObj =  {};
            propObj['elem']  = element;
            propObj['name']  = element.name;
            propObj['required']  = element.required;
            if(element['list']){
                if(element['list'].options[0]) propObj['value']  = element['list'].options[0].textContent;
            } else if(element.name){
                data[element.name] = element.value;
                propObj['value'] = element.value
            }
            data[element.name] = propObj;

        }
        return data;
    }
    createFormData(form){
        let formElements = form.elements,
            data = {};
        for(let element of formElements){
            if(!element.name) continue;
            if(element['list']){
                if(element['list'].options[0]) data[element.name] = element['list'].options[0].textContent;
            } else if(element.name){
                data[element.name] = element.value;
            }
        }
        return data;
    }
    // Работа с поиском
    async inputSearchQuery(inputData){
        const _ = this;
        let input = inputData['item'];
        _.model.searchQuery = input.value;
    }
    async btnSearch(clickData){
        const _ = this;
        let item = clickData['item'];
        _.searchPrepare(item);
    }
    async keyUpSearch(keyUpData){
        const _ = this;
        let item = keyUpData['item'], event = keyUpData['event'];
        if ( (event['key'] === 'Enter') || (event['key'] === 'Backspace')) {
            _.searchPrepare(item);
            return;
        }
        if((event['key'] === 'Escape')){
            item.value = '';
            _.view[template]({page:1});
        }
    }
    async searchPrepare(item){
        const _ = this;
        let searchMethod = item.dataset.searchMethod ? item.dataset.searchMethod : 'search',
            template = item.dataset.template ? item.dataset.template : 'tableRowsTpl';
        _.model.searchMethod = searchMethod;
        _.search(searchMethod,template);
    }
    async search(searchMethod,template,page= 1){
        const _ = this;
        let searched = await _.model.search(page);
        let tBody = await _.view[template]({
            items: searched,
            type: 'search',
            query:  _.model.searchQuery
        });
        MainEventBus.trigger('Languager','loadTranslate',tBody);
    }


    // Работа с пагинацией
    async calcItemsCount(calcData = {type:'main'}){
        const _ = this;
        return new Promise( async function (resolve) {
            calcData['type'] = calcData['type'] ? calcData['type'] : 'main';
            let cnt = 0;
            cnt = await _.model.getItemsCnt(calcData);
            resolve(parseInt(cnt));
        })
    }
    async nextPage(){
        const _ = this;
        let currentPageInpt = systemConts['content'].querySelector('.pagination-page'),
            template = currentPageInpt.dataset.template,
            searchMethod = currentPageInpt.dataset.searchMethod,
            currentPageValue = parseInt(currentPageInpt.value);
        if(currentPageValue < _.view.pages) currentPageInpt.value = ++currentPageValue;
        await _.loadPageItems(currentPageValue,template,searchMethod);

    }
    async prevPage(){
        const _ = this;
        let currentPageInpt = systemConts['content'].querySelector('.pagination-page'),
            template = currentPageInpt.dataset.template,
            searchMethod = currentPageInpt.dataset.searchMethod,
            currentPageValue = parseInt(currentPageInpt.value);
        if(currentPageValue >  1) currentPageInpt.value = --currentPageValue;
        await _.loadPageItems(currentPageValue,template,searchMethod);
    }
    async goPage(inputData){
        const _ = this;
        let
            input = inputData['item'],
            currentPageInpt = systemConts['content'].querySelector('.pagination-page'),
            currentPageValue = input.value * 1,
            template = currentPageInpt.dataset.template,
            searchMethod = currentPageInpt.dataset.searchMethod;
        if(_.currentPageValue){
            if(_.currentPageValue === currentPageValue) return;
        }else{
            _.currentPageValue = 1;
        }
        if(!isNaN(currentPageValue) && (currentPageValue) ){
            if(currentPageValue <  1) {
                input.value = 1;
                currentPageValue = 1;
            }
            if(currentPageValue >  _.view.pages){
                input.value = _.view.pages;
                currentPageValue = _.view.pages;
            }
            _.currentPageValue = currentPageValue;
        }else{
            currentPageValue = _.currentPageValue;
            input.value =  _.currentPageValue;
        }
        await _.loadPageItems(currentPageValue,template,searchMethod);
    }
    async loadPageItems(page=1,template,searchMethod){
        const _ = this;
        let type = _.model.getCurrentType(),
            tBody = '';
        if(type == 'main'){
            tBody = await _.view[template](
                {
                    page:page,
                    type: type
                }
            );
            MainEventBus.trigger('Languager','loadTranslate',tBody);
        }else{
            tBody = _.search(searchMethod,template,page);
        }

    }
}