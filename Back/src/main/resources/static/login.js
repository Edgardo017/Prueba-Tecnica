

async function loginUser(){
    let User = {
        username: document.getElementById("lo.username").value,
        password: document.getElementById("lo.password").value,
    }
    const response = await fetch('api/usuarios/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(User)
    });
    const token = await response.text();
    if (token !== "error") {
        localStorage.token = token;
        localStorage.username = User.username;
        alert("Bienvenido");
        window.location.href = "login.html";
    }else {
        alert("Usuario o Contraseña Incorrecta");
    }
}

async function registerUser(){
    let User = {
        username: document.getElementById("add.username").value,
        password: document.getElementById("add.password").value,
        firstName: document.getElementById("add.name").value,
        lastName: document.getElementById("add.lastname").value,
        phone: document.getElementById("add.telf").value
    }
    if (document.getElementById("add.repassword").value === User.password){
        const response = await fetch('api/usuarios/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(User)
        });
        const error = await response.text();
        if (error === "") {
            alert("Registro Exitoso");
            window.location.href = "login.html";
        }else {
            alert("Error al Registrarse (Use otro username)");
        }
    }else
        alert("Las Contraseñas no coinciden")

}

