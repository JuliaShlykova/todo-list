import {todoList, todoItem} from "./TodoList";

const initialLists = (()=>{
    let defaultList = todoList('Default List');
    let item1 = todoItem('Brush Teeth');
    let item2 = todoItem('Wash Face');
    defaultList.addItem(item1);
    defaultList.addItem(item2);
    let lists = [];
    lists.push(defaultList);

    return {lists};
})();
const todo = (()=>{
    function saveListsToStorage(lists){
        localStorage.setItem('lists',JSON.stringify(lists));
    }
    // 
    const getLists = ()=>{
        let storageData = localStorage.getItem("lists");
        let lists = [];
        if (storageData&&(storageData!=='[]')){
            JSON.parse(storageData).forEach(list => {
                let listJS = todoList(list.title);
                list.items.forEach(item=>{
                    let itemJS = todoItem(item.title,item.finished);
                    listJS.addItem(itemJS);
                })
                lists.push(listJS);
            });
        }
        else{
            lists = initialLists.lists;
        }
        return lists;
    }
    const addList = (list)=>{
        let lists = getLists();
        lists.push(list);
        saveListsToStorage(lists);
    }
    const findIndexByname=(name,lists)=>{
        let index = lists.findIndex(list=>list.getTitle().toLowerCase()==name.toLowerCase());
        return index
    }
    const removeList = (name)=>{
        let lists = getLists();
        let index = findIndexByname(name,lists);
        lists.splice(index,1);
        saveListsToStorage(lists);
    }
    const removeItem = (listTitle,itemTitle)=>{
        let lists = getLists();
        let index = findIndexByname(listTitle,lists);
        lists[index].deleteItem(itemTitle);
        saveListsToStorage(lists);
    }
    const addItem =(listTitle,itemTitle)=>{
        let newItem = todoItem(itemTitle);
        let lists = getLists();
        let index = findIndexByname(listTitle,lists);
        lists[index].addItem(newItem);
        saveListsToStorage(lists);
    }
    const changeFinishedItem = (listTitle,itemTitle)=>{
        let lists = getLists();
        let index = findIndexByname(listTitle,lists);
        lists[index].changeFinishedItem(itemTitle);
        saveListsToStorage(lists);
    }
    const changeListTitle=(oldTitle,newTitle)=>{
        let lists = getLists();
        let index = lists.findIndex(list=>list.getTitle().toLowerCase().replaceAll(/(\s|-)/ig,"")==oldTitle.toLowerCase().replaceAll('-',''));
        lists[index].title = newTitle;
        saveListsToStorage(lists);
    }
    return {getLists,addList,removeList,removeItem,addItem,changeFinishedItem,changeListTitle};
})();

export default todo;