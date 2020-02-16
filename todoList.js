const btn = document.querySelector("#addBtn");
const todoText = document.querySelector("#todo");
const todoList = document.querySelector("#todoList");
const TODOS_LS = 'toDos';
const MEMOS_LS = 'memos';
var maxId = 0;
let todos = [];
let memos = [];



/*
*
    click Handler, to handle when user click add button.
*
*/
function clickHandler()
{
    if(todoText.value === "")
    {
        alert("You must write something!");
        todoText.focus();
        return;
    }

    ++maxId;
    paintTodo(maxId, todoText.value);
    paintMemo(maxId, "");
    saveTodo();
    saveMemo();
    todoText.value="";
}

function paintTodo(id, text)
{
    var todoObj = {
        id: id,
        text: text
    };

    var li = document.createElement("li");
    var btn = document.createElement("button");
    var div = document.createElement("div");

    li.id = "li_"+id;
    li.addEventListener("dblclick", editTodoTitle);

    btn.addEventListener("click", delTodo);
    btn.innerText = "del";

    div.addEventListener("click", showTxtArea);
    div.innerText = text;
    div.id = "div_"+id;
    div.appendChild(btn);
    

    //span.addEventListener("dblclick", delTodo);
    li.appendChild(div);
    todoList.appendChild(li);

    todos.push(todoObj);
}

function editTodoTitle(event)
{
    const div = event.target;
    const form = document.createElement("form");
    const textBox = document.createElement("input");

    form.addEventListener("submit", editTodo);
    textBox.type = "text";
    textBox.value = div.innerText;
    
    form.appendChild(textBox);
    div.innerText = "";
    div.appendChild(form);
}

function editTodo(event)
{
    event.preventDefault();
    const div = event.target.parentNode;
    const id = getNumberFromID(div.id);
    const edtiedText = event.target.firstChild.value;

    div.innerText = edtiedText;
    //span.removeChild(event.target.parentNode);

    todos.forEach(function(todo){
        if(parseInt(todo.id) === parseInt(id))
        {
            todo.text = edtiedText;
            return;
        }
    });
    saveTodo();
}

function paintMemo(id, text)
{
    var memoObj = {
        id: id,
        text: text
    };
    const textarea = document.createElement("textarea");
    const ul = document.querySelector("#todoList");
    const li = ul.querySelector("#li_"+id);
    //const textarea = todoList.querySelector("#txtarea_"+id);
    textarea.classList += "txtarea_none";
    textarea.placeholder = "Write a memo for this todo";
    textarea.id = "txtarea_" + id;
    textarea.addEventListener("keyup", editMemo);
    
    textarea.value = text;

    li.appendChild(textarea);
    memos.push(memoObj);
}

function editMemo(event)
{
    const li = event.target.parentNode;
    const id = getNumberFromID(li.id);
    const textarea = li.childNodes[1];

    memos.forEach(function(memo){
        if(parseInt(memo.id) === parseInt(id))
        {
            memo.text = textarea.value;
            return;
        }
    });
    saveMemo();
}
function showTxtArea(event)
{
    const li = event.target.parentNode;
    const textarea = li.childNodes[1];

    
    if(textarea.className === "txtarea_none")
    {
        textarea.className = "txtarea_block";
    }
    else
    {
        textarea.className = "txtarea_none";
    }
}




function delTodo(event)
{
    const li = event.target.parentNode.parentNode;
    console.log(li);
    todoList.removeChild(li);

    for(var i=0; i<todos.length; ++i)
    {
        if(todos[i].id === parseInt(getNumberFromID(event.target.parentNode.id)))
        {
            todos.splice(i, 1);
            memos.splice(i, 1);
            console.log(i);
            break;
        }
    }
    saveTodo();
    saveMemo();
}








/////////////////////////////////////////////////////////////

function init()
{
    loadToDos();
    btn.addEventListener("click", clickHandler);
}

function loadToDos()
{
    const loadedToDos = localStorage.getItem(TODOS_LS)
    
    if(loadedToDos !== null)
    {
        const parsedTodos = JSON.parse(loadedToDos);
        if(parsedTodos.length > 0)
        {
            parsedTodos.forEach(function(todo){
                paintTodo(todo.id, todo.text);
            });
            
            maxId = parsedTodos[parsedTodos.length-1].id;
            saveTodo();
    
            loadMemos();
        }
    }
}

function loadMemos()
{
    const loadedMemos = localStorage.getItem(MEMOS_LS)
    if(loadedMemos !== null)
    {
        const parsedMemos = JSON.parse(loadedMemos);
        parsedMemos.forEach(function(memo){
            paintMemo(memo.id, memo.text);
        });
        
        saveMemo();
    }
}

function saveTodo()
{
    localStorage.setItem(TODOS_LS, JSON.stringify(todos));
}
function saveMemo()
{
    localStorage.setItem(MEMOS_LS, JSON.stringify(memos));
}

function getNumberFromID(textID)
{
    return textID.substring(textID.indexOf("_") + 1, textID.length);
}

init();