function burgerClick () {
    let nav = document.querySelector('.nav');
    nav.classList.toggle('nav-show')
    let menu = document.querySelectorAll('.nav-item');
    menu.forEach(function (el) {
        if(el.classList.contains('nav-item-show')) el.classList.remove('nav-item-show')
    })
    let burgerButton = document.querySelector('.head-burger');
    burgerButton.classList.toggle('head-burger-clicked')
}
document.querySelector('.head-burger').addEventListener('click',function (e) {
    burgerClick();
});

function leftMenuClick (e) {
    let target = e.target;
    let cont = target.parentElement;
    cont.classList.toggle('nav-item-show')
}
document.querySelectorAll('.nav-item a').forEach(function (el) {
    if(el.nextElementSibling){
        el.addEventListener('click',function (e) {
            e.preventDefault();
            leftMenuClick(e);
        });
    }
});
