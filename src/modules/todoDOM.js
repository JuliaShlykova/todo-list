import {todoList, todoItem} from "./TodoList";
import todo from "./todo";

const DOM = (()=>{
    const main = ()=> document.querySelector('main');
    const formNewList = ()=>document.querySelector('#form-new-list');
    return {main,formNewList};
})()

const createIcons = (function(){
    const checkMark = ()=>{
        let icon = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        icon.setAttribute('viewBox','0 0 30 30');
        icon.setAttribute('name','svg-check-mark');
        let ref = document.createElementNS("http://www.w3.org/2000/svg",'use');
        ref.setAttribute('href','#check-mark');
        icon.appendChild(ref);
        return icon;
    }
    const bin = ()=>{
        let icon = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        icon.setAttribute('viewBox','0 0 50 50');
        icon.setAttribute('name','svg-bin');
        let ref = document.createElementNS("http://www.w3.org/2000/svg",'use');
        ref.setAttribute('href','#bin');
        icon.appendChild(ref);
        return icon;
    }
    const edit = ()=>{
        let icon = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        icon.setAttribute('viewBox','0 0 16 16');
        icon.setAttribute('name','svg-edit');
        let ref = document.createElementNS("http://www.w3.org/2000/svg",'use');
        ref.setAttribute('href','#edit');
        icon.appendChild(ref);
        return icon;
    }
    return {checkMark,bin,edit};
})();

const todoDOM = (function(){
    const createDOMList=(list)=>{
        let listContainer = document.createElement('div');
        listContainer.classList.add('list-container');
        let listTitle = document.createElement('div');
        listTitle.classList.add('list-title');
        let inputTitle = document.createElement('input');
        inputTitle.setAttribute('type','text');
        inputTitle.setAttribute('value',list.getTitle());
        inputTitle.setAttribute('id',list.getTitle().toLowerCase().replaceAll(' ','-'));
        inputTitle.setAttribute('disabled','');

        inputTitle.addEventListener('blur',function(){
            this.setAttribute('disabled','');
            let oldTitle = this.getAttribute('id');
            let newTitle = this.value;
            todo.changeListTitle(oldTitle,newTitle);
            this.setAttribute('id',newTitle.toLowerCase().replaceAll(' ','-'));
        });
        listTitle.appendChild(inputTitle);
        // icons to list
        let editIcon = createIcons.edit();
        editIcon.addEventListener('click',edit);
        listTitle.appendChild(editIcon);
        let binIcon = createIcons.bin();
        binIcon.addEventListener('click',removeList);
        listTitle.appendChild(binIcon);

        let listUl = document.createElement('ul');
        listUl.classList.add('list');
        if(list.getItems()){
            list.getItems().forEach(item=>{
            let listLi = createDOMItem(item);
            listUl.appendChild(listLi);
            });
        }
        listTitle.addEventListener('click',function(){
            if(this.firstChild.getAttribute('disabled')!==null){
                this.parentNode.lastChild.classList.toggle('invisible');
            }
        })
        // form input item
        let formNewItem = document.createElement('form');
        let inputItem = document.createElement('input');
        inputItem.setAttribute('type','text');
        inputItem.setAttribute('placeholder','New item...');
        inputItem.classList.add('new-list-item');
        formNewItem.appendChild(inputItem);
        formNewItem.addEventListener('submit',formItemSubmitAction);
        let li = document.createElement('li');
        li.appendChild(formNewItem);
        listUl.appendChild(li);

        listContainer.appendChild(listTitle);
        listContainer.appendChild(listUl);

        DOM.main().appendChild(listContainer);
    };
    const createDOMItem=(item)=>{
        let listLi = document.createElement('li');
        let itemTitle = document.createElement('span');
        itemTitle.classList.add('list-item-title');
        itemTitle.textContent = item.getTitle();
        // icons to item
        let checkMark = createIcons.checkMark();
        checkMark.addEventListener('click',finishItem);
        listLi.appendChild(checkMark);
        listLi.appendChild(itemTitle);
        let binIcon = createIcons.bin();
        binIcon.addEventListener('click',removeItem);
        listLi.appendChild(binIcon);
        if(item.finished){
            listLi.classList.add('finished');
        }
        return listLi;
    };
    const showLists = ()=>{
        let lists = todo.getLists();
        lists.forEach(list=>createDOMList(list));
    }
    //form list submit
    const formListSubmitAction = ()=>{
        let form = DOM.formNewList();
        form.addEventListener('submit',function(Event){
            let newListTitle = form.firstChild.value;
            let newList = todoList(newListTitle);
            todo.addList(newList);
            createDOMList(newList);
            // Event.preventDefault();
        });
    }
    // form item submit
    const formItemSubmitAction = function(Event){
        let liInput = this.parentNode;
        let itemTitle = liInput.firstChild.firstChild.value;
        let newItem = todoItem(itemTitle);
        let list = this.parentNode.parentNode;
        let listTitle = list.parentNode.firstChild.firstChild.value;
        todo.addItem(listTitle,itemTitle);
        list.insertBefore(createDOMItem(newItem),liInput);
        // Event.preventDefault();
    }
    // functions for events
    const edit = function(){
        this.previousSibling.removeAttribute('disabled');
        this.previousSibling.focus();
    }
    const removeList = function(){
        let name = this.parentNode.firstChild.value;
        todo.removeList(name);
        let elementToRemove = this.parentNode.parentNode;
        DOM.main().removeChild(elementToRemove);
    }
    const removeItem = function(){
        let itemToRemove = this.parentNode;
        let itemTitle = this.previousSibling.textContent;
        let listTtile = this.parentNode.parentNode.parentNode.firstChild.firstChild.value;
        todo.removeItem(listTtile,itemTitle);
        this.parentNode.parentNode.removeChild(itemToRemove);
    }
    const finishItem = function(){
        let DOMItem = this.parentNode;
        DOMItem.classList.toggle('finished');
        let itemTitle = this.nextSibling.textContent;
        let listTitle = this.parentNode.parentNode.parentNode.firstChild.firstChild.value;
        todo.changeFinishedItem(listTitle,itemTitle);
    }

    const initialRender = ()=>{
        showLists();
        formListSubmitAction();
    }
    return {initialRender,showLists};
})();

export default todoDOM;