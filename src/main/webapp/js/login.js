const Form = document.querySelector('form');
let errors = {}

function validateForm(input) {
    const {username, password} = Form
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (errors[input]) {
        delete errors[input]
        if (document.querySelector(`small#error${input}`)) document.querySelector(`small#error${input}`).remove()
    }
    switch(input) {
        case 'username':
            if (username.value.length < 2) errors.username = "el nombre de usuario debe tener mas de 3 digitos"
            else if(!regex.test(username.value)) errors.username = "debe ser un email valido"
            break
        case 'password':
            if (password.value.length == 0) errors.password = "el campo no puede estar vacio"
            break
        default:
            break
    }
    if (errors[input]) {
        let errorTag = `<small id="error${input}" class="error">${errors[input]}</small>`
        document.querySelector(`input[name='${input}']`).insertAdjacentHTML('afterend', errorTag)
    }
}

window.onload = () => {
    Array.from(Form).forEach(input => {
        input.oninput = (e) => {
            validateForm(input.name)
        }
    });
    Form.onsubmit = (e) => {
        e.preventDefault()
        Array.from(Form).forEach(input => validateForm(input.name));
        if (Object.keys(errors).length > 0) alert('corregir los errores del formulario')
        else {
            const userData= {
                username: Form.username.value,
                password: Form.password.value
            }
            fetch("http://localhost:8080/users/login", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(userData)
            }).then(res => {
                if(res.status !== 200) {
                    throw new error(res.message)
                } else {
                    return res.json()
                }
            })
            .then(data => {
                sessionStorage.setItem('userData', JSON.stringify(data))
                window.location = "/"
            })
        }
    }
};