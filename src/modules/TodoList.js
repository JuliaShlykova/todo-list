const todoList=(title,items=[])=>{
    const getTitle=()=>title;
    const getItems=()=>items;
    const addItem=(item)=>{
        items.push(item);
    }
    const deleteItem=(name)=>{
        const index = findIndexByTitle(name);
        items.splice(index,1);
    }
    const findIndexByTitle=(name)=>{
        return items.findIndex(item=>item.getTitle().toLowerCase()==name.toLowerCase());
    }
    const changeFinishedItem = (name)=>{
        let index = findIndexByTitle(name);
        items[index].toggleFinished();
    }
    return {title,items,getTitle,getItems,addItem,deleteItem,changeFinishedItem};
};
const todoItem=(title,finished=false)=>{
    const getTitle=()=>obj.title;
    const toggleFinished=()=>obj.finished=!obj.finished;
    const obj ={title,finished,getTitle,toggleFinished};
    return obj;
}


// const todo1 = TodoList('default');
// todo1.addItem(TodoItem('apple'));
// todo1.items.forEach(x=>console.log(x.getTitle()));
// todo1.items[0].changeTitle('orange');
// console.log(todo1.items[0].getTitle());
export {todoList, todoItem};