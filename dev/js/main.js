function burgerClick () {
    let nav = document.querySelector('.nav');
    nav.classList.toggle('nav-show');
    let menu = document.querySelectorAll('.nav-item');
    menu.forEach(function (el) {
        if(el.classList.contains('nav-item-show')) el.classList.remove('nav-item-show')
    });
    let head = document.querySelector('.head');
    head.classList.toggle('head-show');
}
document.querySelector('.head-burger').addEventListener('click',function (e) {
    burgerClick();
});

function leftMenuClick (e) {
    let target = e.target;
    let cont = target.parentElement;
    cont.classList.toggle('nav-item-show')
}
document.querySelectorAll('.nav-item>a').forEach(function (el) {
    if(el.nextElementSibling){
        el.addEventListener('click',function (e) {
            e.preventDefault();
            leftMenuClick(e);
        });
    }
});

document.querySelectorAll('.form-select').forEach(function (el) {
    el.addEventListener('click',function (e) {
        let target = e.target;
        while(!target.classList.contains('form-select')){
            target = target.parentElement;
        }
        formSelectClose();
        target.classList.add('form-select-show')
    });
});

function formSelectClose(){
    document.querySelectorAll('.form-select').forEach(function (el) {
        if(el.classList.contains('form-select-show')) {
            el.classList.remove('form-select-show');
        }
    })
}

document.querySelectorAll('.form-select-option').forEach(function (el) {
   el.addEventListener('click',function (e) {
       e.stopPropagation();
       let target = e.target,
           cont = target;
       while(!cont.classList.contains('form-select')){
           cont = cont.parentElement;
       }
       cont.querySelector('.form-select-input').value = target.textContent;
       formSelectClose();
   })
});

function navMenuPage() {
    let page = document.location.href;
    let pageArr = page.split('/');
    page = pageArr[pageArr.length - 1];
    let menu = document.querySelectorAll('.nav-item');
    menu.forEach(function (el) {
        let href = el.querySelector('a').href;
        href = href.split('/');
        href = href[href.length - 1];
        if(href == page) {
            el.classList.add('nav-item-active')
        }
    })
}
navMenuPage();