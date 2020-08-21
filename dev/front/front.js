import { MainEventBus } from "./MainEventBus.lib.js";
import { TweenMax,TimelineMax } from "./GreenSock.lib.js";
import { Model } from "./Model.js";
import { View } from "./View.js";
import { Ctrl } from "./Ctrl.js";


class Front{
	constructor(){
		const _ = this;
		_.model = new Model();
		_.view = new View(_.model);
		_.ctrl = new Ctrl(_.model, _.view, {
			container: document.querySelector('body')
		});
		_.libs = new Map();
		_.components = new Map();


		_.formShowed = null;
		//
		MainEventBus.add('Front','showForm',_.showForm.bind(_));
		MainEventBus.add('Front','hideForm',_.hideForm.bind(_));

		MainEventBus.add('Front','saveDinner',_.saveDinner.bind(_));
		MainEventBus.add('Front','saveCompany',_.saveCompany.bind(_));

		MainEventBus.add('Front','hide',_.hide.bind(_));
		_.fillDinnersTable();
		_.fillCompaniesTable();
		// ========================
	}
	toggleChat(clickData){
		const _ = this;
		let chatCont = document.querySelector('core-modaler-inner').querySelector('.chat');
		if (chatCont.classList.contains('chat-list-show')){
			chatCont.classList.remove('chat-list-show');
			return;
		}
		chatCont.classList.add('chat-list-show')
	}

	showMenu(){
		const _ = this;
		if(!_.menuShowed){
			TweenMax.fromTo('.popup-body',.4,{x:'-100%',scale:0.5},{x:'0%',scale:1});
			TweenMax.staggerFromTo('.popup-menu-item',.25,{x:'-100%',opacity:0,yoyo:true},{x:'0%',opacity:1},.1);
			_.menuShowed = true;
		}else{
			//TweenMax.fromTo('.popup-body',.4,{x:'-100%',scale:0.5},{x:'-100%',scale:1});
			TweenMax.to('.popup-body',.4,{x:'100%',scale:0.5});
			_.menuShowed = false;
		}
	}
	hide(){
		this.formShowed = false;
	}
	hideForm(){
		const  _ = this;
		return new Promise( async function (resolve) {
			_.formShowed = false;
			let hided = await MainEventBus.trigger('Modaler','closeModal');
			resolve(hided)
		})
	}
	сhatListItemTpl(chatId,chatTitle){
		const _ = this;
		let tpl = {
			el: _.view.createEl('LI','chat-unit'),
			childes:[
				{
					el: _.view.createEl('BUTTON','chat-unit-title',{
						'data-chat-id': chatId,
						'data-click-action':'Front:showChat;'}),
					childes:[
						{
							el: _.view.createEl('span',null,{text: chatTitle})
						},
						{
							el: _.view.createEl('span','button-hover')
						}
					]
				}]
		};
		return _.view.createTpl(tpl);
	}


	async showForm(clickData){
		const _ = this;
		let btn = clickData['item'],
				formName = btn.dataset.formName;

		await _.getLib("Modaler");



		let form = document.querySelector(`[data-form="${formName}"]`);
		if (_.formShowed){
			let hided = await _.hideForm();
		}

		//_.formShowed = true;
		let test = await MainEventBus.trigger('Modaler','showModal',{
			contentType: "object",
			content: form,
			closeBtn:false
		});
		_.formShowed = true;
	}
	async changeLang(changeData){
		const _ = this;
		let lang = await _.getModule('languager',{'container':document.querySelector('body')});
		changeData['cont'] = document.querySelector('body');
		lang.changeLang(changeData);
	}
	windowScroll(){
		const _ = this;
		window.addEventListener('scroll',async function () {
			let scroll = window.pageYOffset;
			if(scroll > 0) document.querySelector('header').classList.add('head-scrolled');
			else {document.querySelector('header').classList.remove('head-scrolled')}

			if (_.servicesPos){
				if (scroll > _.servicesPos){
					if (!_.servicesLoaded){
						await _.getServices();
						_.servicesLoaded = true;
					}
				}
				let rawSlider =  await _.getLib("Slider");
				if(document.querySelector('.porfolio-list')){
					let Slider = new rawSlider({
						container: '.porfolio-list',
						next: '.nextSlide,.nextSlide2',
						prev: '.prevSlide,.prevSlide2',
						nav: '.portfolio-pagination',
						showDots: false,
						arrows:false,
						wrapImg:false
					});
				}
			}



		});
	}



	formDataCapture(form){
		let
				outData = {},
				formElements = form.elements;
		for(let element of formElements){
			if(element.type == 'radio'){
				if (element.checked){
					outData[element.name] = element.value;
				}
			}else if (element.name){
				outData[element.name] = element.value;
			}
		}
		return outData;
	}
	loaderTpl(){
		const _ = this;
		let tpl = {
			el: _.view.createEl('DIV','loader'),
			childes:[
				{
					el: _.view.createEl('OBJECT',null,{data:'/img/loader.svg',type:"image/svg+xml"})
				}
			]
		};
		return _.view.createTpl(tpl);
	}
	showLoader(cont){
		const _ = this;
		if(!cont) return;
		_.loaderCont = cont;
		cont.append(_.loaderTpl());
	}
	hideLoader(){
		const _ = this;
		if(!_.loaderCont) return;
		if(_.loaderCont.querySelector('.loader'))
			_.loaderCont.querySelector('.loader').remove();
	}

	//
	doDisabled(btn){
		if (!btn) return;
		btn.setAttribute('disabled','disabled')
	}
	doEnabled(btn){
		if (!btn) return;
		btn.removeAttribute('disabled')}
	async  saveDinner(submitData){
		const _ = this;
		let form = submitData['item'];
		let 	formData = _.formDataCapture(form);
		let newDinner =  await _.model.xhr.fetch('JSON',{
			path: '/core/functions/addDinner.php',
			data: formData
		});
		console.log(newDinner)
		_.fillDinnersTable();
	}
	async  saveCompany(submitData){
		const _ = this;
		let form = submitData['item'];
		let 	formData = _.formDataCapture(form);
		let newDinner =  await _.model.xhr.fetch('JSON',{
			path: '/core/functions/addCompany.php',
			data: formData
		});
		_.fillCompaniesTable();
	}
	//
	dinnerTpl(dinnerData){
		const _ = this;
		let status = 'Not in process';
		if (dinnerData['status']){
			status  = 'In process';
		}
		let tpl = {
			el: _.view.createEl('TR'),
			childes:[
				{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['id']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['name']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['dishes_list']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:status}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['add_date']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['edit_date']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['image']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('BUTTON','table-button',{text:'Edit'}),
						}
					]
				}
			]
		};
		return _.view.createTpl(tpl);
	}
	async fillDinnersTable(){
		const _ = this;
		let dinners = await _.getDinners(),
				table  = document.querySelector('.table-dinners tbody');
		if (!table) return ;
		_.view.clearCont(table);
		dinners.forEach(function (el) {
			table.append(_.dinnerTpl(el));
		})
	}
	companyTpl(dinnerData){
		const _ = this;
		console.log(dinnerData)
		let status = 'Not in process';
		if (dinnerData['status']){
			status  = 'In process';
		}
		let tpl = {
			el: _.view.createEl('TR'),
			childes:[
				{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['id']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['name']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['desc']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:status}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('DIV','td-div',{text:dinnerData['add_date']}),
						}
					]
				},	{
					el: _.view.createEl('TD'),
					childes:[
						{
							el: _.view.createEl('BUTTON','table-button',{text:'Edit'}),
						}
					]
				}
			]
		};
		return _.view.createTpl(tpl);
	}
	async fillCompaniesTable(){
		const _ = this;
		let dinners = await _.getCompanies(),
				table  = document.querySelector('.table-companies tbody');
		if (!table) return ;
		_.view.clearCont(table);
		dinners.forEach(function (el) {
			table.append(_.companyTpl(el));
		})
	}
	//
	async getModule(name,params,page=null){
		const _ = this;
		name = name.toLowerCase();
		if (_.components.has(name)) return _.components.get(name);
		let
				moduleStr = name.charAt(0).toUpperCase() + name.substr(1);
		const module = await import(`/js/${name}/${moduleStr}.js`);
		const modulName = new module[moduleStr](page, params);
		_.components.set(name, modulName);
		return Promise.resolve(modulName);
	}
	async getLib(name,params={}){
		const _ = this;
		name = name.toLowerCase();
		if (_.libs.has(name)) return _.libs.get(name);
		let
				moduleStr = name.charAt(0).toUpperCase() + name.substr(1);
		const module = await import(`/front/${moduleStr}.lib.js`);
		const modulName = module[moduleStr];
		_.libs.set(name, modulName);
		return Promise.resolve(modulName);
	}
	async getDinners(){
		const _ = this;
		let dinners =  await _.model.xhr.fetch('GET',{
			path: '/core/functions/getDinners.php',
		});
		return dinners;
	}
	async getCompanies(){
		const _ = this;
		let dinners =  await _.model.xhr.fetch('GET',{
			path: '/core/functions/getCompanies.php',
		});
		return dinners;
	}
	async init() {
		//await this.getEvents();
	}
}
new Front();
