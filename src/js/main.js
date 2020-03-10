import $ from 'jquery';
import {SendAjaxRequest} from './components/send-ajax-request.js';
import {Accordion} from './components/accordion.js';

// Класс для создания экземпляра состояния приложения
class State {
	constructor(state) {
		this._state = state || null;
	}
	get state() {
		return this._state;
	}
	set state(newState) {
		this._state = newState;
	}
}

/**
 * Инициализация состояния
 * @param {Object} state - объект с комплектациями
 */
async function initGlobalStage() {
	let data = await SendAjaxRequest("GET", "/src/db.json");
	// установка начальных значений комплекта
	let checkedState = JSON.parse(data).map( group => {
		group.config[0].selected = true;
		return group;
	});

	window.Storage = new State(checkedState);
	document.dispatchEvent( new CustomEvent("stateMounted", {bubbles: true}));
	console.info('%cState Mounted', 'color: blue');
}

// Рендеринг DOM на основе состояния
function initConfigurator() {
	let container = $('.configurator .option-list');
	const printConfig = function(object) {
		let AConfig = object.config,
			groupName = object.code,
			list = $(`
				<section class="option-group">
					<div class="option-group__head">
						<div class="title">${object.title}</div>
						<div class="toggle-btn"></div>
					</div>
					<div class="option-group__body"></div>
				</section>`);
		AConfig.forEach( function(option){
			let disabled = option.bundle ? (option.add ? "" : "disabled") : "",
				checked = (parseInt(option.id) === 0) ? "checked" : "",
				description = option.extend ? option.extend : "";

			let configItem =
				`<div class="config-item">
					<div class="form-group">
						<input type="radio" name="${groupName}" id="${groupName}-${option.id}" value="${option.id}" ${disabled} ${checked}>
						<label for="${groupName}-${option.id}">
							<span>${option.text}</span>
						</label>
					</div>
					<span class="config-item__descr">${description}</span>
				</div>`;
			list.find('.option-group__body').append(configItem);
		});
		container.append(list);
	};

	// build option-list DOM
	Storage.state.forEach( object => printConfig(object));

	Accordion.init();

	// генерация события как только список будет построен
	document.dispatchEvent( new CustomEvent("render", {bubbles: true}));
}

// Изменение значений в состоянии на основе выбранных опций
function editGlobalStage(groupCode, optionId) {
	let newState = [... Storage.state];
	newState.find( g => g.code === groupCode ).config.find( o => o.selected === true).selected = false;
	newState.find( g => g.code === groupCode ).config.find( o => o.id === optionId ).selected = true;

	Storage.state = newState;

	document.dispatchEvent( new CustomEvent("updateState", {bubbles: true}));
	// альтернатива: обновить целиком весь массив ( Storage.state = newState )
}

// Рендеринг DOM результата
function renderComplect(){
	let selectedOptions = Storage.state.map( g => g.config.find(o => o.selected === true));

	let masterComplect = selectedOptions.filter( o => o.bundle === undefined);
	let	slaveComplect = selectedOptions.filter( o => o.bundle === true);

	let mastertList = masterComplect.reduce( (acc, o) => {
		acc.push(o.text);
		return acc;
	}, []).join(', ');
	let slaveList = slaveComplect.reduce( (acc, o) => {
		acc.push(o.text);
		return acc;
	}, []).join(', ');

	$('.result-list__main').empty().append(mastertList);
	$('.result-list__slave').empty().append('В комплекте: ' + slaveList);
}

document.addEventListener('DOMContentLoaded', initGlobalStage);

document.addEventListener('stateMounted', initConfigurator);

document.addEventListener('render', function () {
	console.info('%cHTML is rendered','color: green');
	renderComplect();

	// генерируем событие "optionChecked" с параметрами при клике на опцию
	$('.config-group input[type="radio"]').on('click', function(event) {
		// создаем событие с параметрами
		document.dispatchEvent( new CustomEvent("optionChecked", {
			bubbles: true,
			detail: {
				optionGroup: this.name,
				optionId: this.value
			}
		}));
	});
});

document.addEventListener('optionChecked', function (event) {
	let params = event.detail;
	console.info(event.detail);
	editGlobalStage(params.optionGroup, params.optionId);
});

document.addEventListener('updateState', function () {
	console.info('%cState Updated', 'color: blue');
	renderComplect();
});