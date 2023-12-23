// Call the dataTables jQuery plugin
$(document).ready(function() {
    loadusers();
});


async function loadusers() {
    const request = await fetch('api/usuarios', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": localStorage.token
        },
    });
    if (request.ok) {
        const responseBody = await request.text(); // Obtener el cuerpo de la respuesta como texto
        const users = responseBody ? JSON.parse(responseBody) : null; // Intentar analizar el cuerpo de la respuesta como JSON

        if (users !== null) {
            let table = "";
            for (let user of users){
                let html = `<tr>
                  <td><span class="custom-checkbox">
                      <input type="checkbox" id="checkbox1" name="options[]" value="1">
                      <label for="checkbox1"></label>
                      </span>
                   </td>
                    </td>
                         <td>${user.id}</td>
                         <td>${user.name}</td>
                         <td>${user.lastName}</td>
                         <td>${user.dni}</td>
                         <td>${user.telf}</td>
                         <td>
                             <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                             <a href="#" class="delete" onclick="onRequestDeleteUser(${user.id})" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                         </td>
                        </tr>
  `
                table += html;
            }
            document.querySelector("#usuarios tbody").outerHTML = table;
            console.log(users);
        } else {
            alert("Logeate");
            window.location.href = "login.html";
        }
    } else {
        alert("Error al obtener los datos");
        window.location.href = "login.html";
    }


}

function onRequestDeleteUser(id) {
    $('#deleteEmployeeModal').modal('show');
    document.getElementById("btn.delete").onclick = async function(event){
        //event.preventDefault();
        const response = await fetch('api/usuarios/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.token
            },
        });
        $('#deleteEmployeeModal').modal('hide');
    }
}


async function registerUser(){
    let User = {
        username: document.getElementById("add.username").value,
        password: document.getElementById("add.password").value,
        name: document.getElementById("add.name").value,
        lastName: document.getElementById("add.password").value,
        dni: document.getElementById("add.dni").value,
        telf: document.getElementById("add.telf").value
    }
    if (document.getElementById("add.repassword").value === User.password){
        const response = await fetch('api/usuarios/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": localStorage.token
            },
            body: JSON.stringify(User)
        });
        alert("Usuario añadido");
        $('#addEmployeeModal').modal('hide');
        window.location.href = "login.html";


    }else
        alert("Las Contraseñas no coinciden")

}



