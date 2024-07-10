if (sessionStorage.userData) {
    const userData = JSON.parse(sessionStorage.userData)
    const userbar = `<div class="userData">
        <img src="" alt="${userData.name.slice(0,2)}"/>
        <b>Hola ${userData.name}</b>
        <button class="btn" onClick="handleLogout(event)">Cerrar sesion</button>
    </div>`
    const navbar = document.querySelector("div.row.align")
    navbar.insertAdjacentHTML('afterend',userbar)
}


function handleLogout(e){
    e = e || window.event
    e.preventDefault()
    sessionStorage.removeItem("userData")
    document.querySelector("div.userData").remove()
}