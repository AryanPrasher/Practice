function addtodo() {
    const list = document.getElementById("todo").value;

    if (list.trim() === "") {
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <span>${list}</span>
        <button onclick = "updatetodo(this)">Update</button>
        <button onclick = "deletetodo(this)">Delete</button>
    `;

    document.getElementById("todolist").appendChild(li);

    document.getElementById("todo").value = "";
}

function deletetodo(btn){
    btn.parentElement.remove()
}

function updatetodo(btn){
    const newlist = prompt ("New value")
    btn.parentElement.querySelector("span").innerHTML=newlist
}