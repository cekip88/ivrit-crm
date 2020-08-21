import {MainEventBus} from './MainEventBus.lib.js';


class _Modaler {
    constructor(){
        const _ = this;
        MainEventBus.add('Modaler','showConfirm', _.showC.bind(_));
        MainEventBus.add('Modaler','showModal', _.show.bind(_));
        MainEventBus.add('Modaler','closeModal', _.close.bind(_));
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
                    element.setAttribute(param,params[param]); // Написал коммент
                }
            }
        }
        return element;
    }
    //Создает контейнер для модального окна
    createContTpl(){
        const _ = this;
        _.body = document.querySelector('CORE') ? document.querySelector('CORE') : document.querySelector('BODY');
        _.cont = document.createElement('CORE-MODALER');
        _.contBgc = _.createEl('DIV',null,{
            'data-click-action':'Modaler:closeModal',
            'style':'width:100%;height:100vh;position:absolute;top:0;right:0;'
        });
        _.contStyle = document.createElement('STYLE');
        _.innerCont = document.createElement('CORE-MODALER-INNER');
        _.innerContainer = document.createElement('CORE-MODALER-INNER-CONT');
        _.innerContainer.append(_.innerCont);
        _.cont.append(_.contBgc);
        _.cont.append(_.innerContainer);
        _.body.append(_.contStyle);
        _.body.append(_.cont);
    }
    //Создает кнопку закрытия модального окна
    createButtonTpl(modalerData){
        const _ = this;
        _.modalerCloseBtn = _.createEl('CORE-MODALER-CLOSE',null,{'data-click-action':'Modaler:closeModal'});
        _.closeStyle = document.createElement('STYLE');
        _.cont.append(_.closeStyle);
        if((modalerData.closeBtn === undefined) || (modalerData.closeBtn === true)) {
            _.span = document.createElement('SPAN');
            _.span2 = document.createElement('SPAN');
            _.modalerCloseBtn.append(_.span, _.span2);
        } else if (typeof modalerData.closeBtn === "string"){
            if(modalerData.closeBtn[0] !== '.'){
                _.modalerCloseBtn.innerHTML = modalerData.closeBtn;
            } else {
                let clone = document.querySelector(modalerData.closeBtn).cloneNode(true);
                _.modalerCloseBtn.append(clone);
                _.modalerCloseBtnClone = clone;
            }
        } else if (typeof modalerData.closeBtn == "object"){
            let clone = modalerData.closeBtn.cloneNode(true);
            _.modalerCloseBtn.append(clone);
        }
        else return;
        _.innerContainer.append(_.modalerCloseBtn);
        _.modalerCloseBtnParams = _.modalerCloseBtn.getBoundingClientRect();
    }
    //Присваивает стили
    modalerStyles(modalerData){
        const _ = this;

        _.contStyle.textContent = `
            core-modaler {
                width:100%;
                height:100vh;
                overflow:hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                position:fixed;
                z-index:10000;
                background-color:rgba(0,0,0,0.5);
                top:0;
                right:0;
                left:0;
            }
            core-modaler-inner {
                width: auto;
                max-width: 100%;
                max-height: 90vh;
                padding: 30px;
                overflow:auto;
                border-radius: 5px;
                background-color:#fff;
                position:relative;
                z-index:100;
                display:flex;
                flex-direction:column;
                align-items:center;
                color: #000;
            }
            core-modaler-inner-cont {
                position: relative;
            }
        `;
    }
    modalerCloseStyles(modalerData){
        const _ = this;
        if(modalerData.closeBtn !== false) {
            let btnWidth = 25,
                btnHeight = 25;
            if(typeof modalerData.closeBtn == "string"){
                btnWidth = _.modalerCloseBtnClone.offsetWidth;
                btnHeight = _.modalerCloseBtnClone.offsetHeight;
            }
            let btnX = 0 - (btnWidth / 2),
                btnY = 0 - (btnHeight / 2);
            if(_.innerCont.offsetWidth === (screen.availWidth - 20)){
                btnX = screen.availWidth - btnWidth;
            }
            let closeCont = `core-modaler-close {
                    width:${btnWidth}px;
                    height:${btnHeight}px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
                    border-radius: 100%;
                    box-shadow: 0 0 5px rgba(0,0,0,0.3);
                    cursor: pointer;
                    position: absolute; 
                    z-index: 100;
                    top: ${btnY}px; 
                    right: ${btnX}px;
                }
                core-modaler-close:hover{
                    background-color:#373A4A;
                }
                core-modaler-close:hover span{
                    background-color: #fff;
                }
                `,
                closeContSpan = `core-modaler-close span {
                    width:1px;
                    height:15px;
                    display: block;
                    background-color: #000;
                    transform: rotate(45deg);
                    position: absolute;
                }
                core-modaler-close span:last-child {
                    transform: rotate(-45deg)
                }`;
            _.closeStyle.textContent = closeCont;
            if((modalerData.closeBtn === true) || (modalerData.closeBtn === undefined)){
                _.closeStyle.textContent = closeCont + closeContSpan;
            }
        }
    }
    //Запускает анимацию открытия модального окна на основе принятых данных
    modalAnimationStart(modalerData){
        const _ = this;
        _.animType = modalerData.animType;
        if(!modalerData.animType){_.animType = 1}
        if(_.animType === 1){
            _.tweenFromBegin = {scale:.5,opacity:0};
            _.tweenToBegin = {scale:1,opacity:1};
        } else if (_.animType === 2){
            _.tweenFromBegin = {y:-300,opacity:0};
            _.tweenToBegin = {y:0,opacity:1};
        }
        TweenMax.fromTo(_.innerContainer,.35,_.tweenFromBegin,_.tweenToBegin);
        TweenMax.fromTo(_.cont,.35,{opacity:0},{opacity: 1});
    }
    //Запускает анимацию закрытия модального окна на основе принятых данных
    modalAnimationEnd(){
        const _ = this;
        if(_.animType === 1){
            _.tweenFromEnd = {scale:1.3};
            _.tweenToEnd = {scale:0,opacity:0};
        } else if (_.animType === 2){
            _.tweenFromEnd = {y:0,opacity:1};
            _.tweenToEnd = {y:-300,opacity:0};
        }
        let tl = new TimelineMax();
        tl.add(TweenMax.to(_.innerContainer,.15,_.tweenFromEnd)).add(TweenMax.to(_.innerCont,.35,_.tweenToEnd));
        TweenMax.fromTo(_.cont,.5,{opacity:1},{opacity: 0})
    }
    //Принимает параметры для вывода частей модульного окна
    defineContentType(modalerData){
        const _ = this;
        if(!modalerData.content){
            _.innerCont.textContent = modalerData;
            return _.innerCont;
        }
        if((modalerData.contentType === 'layout')){
            _.innerCont.innerHTML = modalerData.content;
        } else if((modalerData.contentType === 'class') || (modalerData.contentType === 'object')) {
            let clone;
            if(modalerData.contentType === 'class'){
                clone = document.querySelector(modalerData.content).cloneNode(true);
                _.cloneCont = document.querySelector(modalerData.content).parentElement;
            }
            if(modalerData.contentType === 'object'){
                clone = modalerData.content;
                _.cloneCont = modalerData.content.parentElement;
            }
            clone.style.display = 'block';
            _.innerCont.append(clone);
        } else {
            _.innerCont.textContent = modalerData.content;
        }

        return _.innerCont;
    }
    showPrompt(modalerData){
        const _ = this;
    }
    showConfirm(modalerData){
        const _ = this;
        let confirm = false;
        let fragment = document.createElement('DIV');

        let tpl = `
            <h2 style="text-align: center;font-size: 20px">${modalerData.content}</h2>
            <div style="width: 140px;display: flex;justify-content: space-between;padding: 1em 0 .5em;">
                <button class="btn modalerConfirmYes">Да</button>
                <button class="btn modalerConfirmNo">Нет</button>
            </div>
        `;

        fragment.innerHTML = tpl;

        modalerData.contentType= 'object';
        modalerData.content = fragment;

        let cont = _.defineContentType(modalerData);
        cont.querySelector('.modalerConfirmYes');
        cont.querySelector('.modalerConfirmYes').onclick = function(){
            const _ = this;
            MainEventBus.trigger(modalerData['component'],modalerData['actionYes'],modalerData['data']);
            MainEventBus.trigger('Modaler','closeModal');
        }
        cont.querySelector('.modalerConfirmNo').onclick = function(){
            const _ = this;
            if(!modalerData['actionNo']) return;
            MainEventBus.trigger(modalerData['component'],modalerData['actionNo'],modalerData['data']);
            MainEventBus.trigger('Modaler','closeModal');
        }
    }
    showModal(modalerData){
        const _ = this;

       _.defineContentType(modalerData);
    }
    //Закрывает модальное окно и применяет анимацию закрытия
    closeModal(){
        const _ = this;
        return new Promise(function (resolve) {
            setTimeout(
                function () {
                    _.cont.remove();
                    _.contStyle.remove();
                    resolve(true);
                }, 500)
        });
    }
    close(){
        const _ = this;
        MainEventBus.trigger('Front','hide');
        _.modalAnimationEnd();
        _.cont.querySelector('core-modaler-inner').firstChild.removeAttribute('style');
        _.cloneCont.append(_.cont.querySelector('core-modaler-inner').firstChild);
        return _.closeModal();
    }
    //Запускает части модального окна
    showC(modalerData){
        const _ = this;
        if(document.querySelector('core-modaler')) return;
        else if(modalerData){
            _.createContTpl();

            _.modalerStyles(modalerData);
            _.createButtonTpl(modalerData);
            _.modalerCloseStyles(modalerData);
            _.modalAnimationStart(modalerData);

            return new Promise(function (resolve) {
                resolve(_.showConfirm(modalerData));
            })


        } else {
            MainEventBus.trigger('Modaler','showModal','modalerData не передан')
        }
    }
    show(modalerData){
        const _ = this;
        return new Promise(function (resolve) {
            if(document.querySelector('core-modaler')) resolve(false);
            else if(modalerData){
                _.createContTpl();
                _.showModal(modalerData);
                _.modalerStyles(modalerData);
                _.createButtonTpl(modalerData);
                _.modalerCloseStyles(modalerData);
                _.modalAnimationStart(modalerData);
                resolve(modalerData);
            } else {
                MainEventBus.trigger('Modaler','showModal','modalerData не передан')
            }
        })

    }
}
export const Modaler = new _Modaler();

