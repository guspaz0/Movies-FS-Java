const body = document.querySelector("body")

function popUp(message) {
    const popup = document.createElement('span');
    popup.classList.add('popupscreen');

    popup.innerHTML = `
        <div class="popUps" id="popUpDetailLogin">
            <h3>${message}</h3>
            <div class="botonPopup">
                <div class="botonPopup">
                    <a onclick="popUpoOff()">Aceptar</a>
                </div>
            </div>
        </div>
    `;
    body.appendChild(popup);
}

function popUpRedirect(message, second, endpoint) {
    const popup = document.createElement('span');
    popup.classList.add('popupscreen');

    popup.innerHTML = `
        <div class="popUps" id="popUpDetailLogin">
            <h3>${message}</h3>
            <div class="botonPopup">
                <p>Redirigiendote en <b id="counter"><b> segundos ...</p>
            </div>
        </div>
    `;
    body.appendChild(popup);
    startTimerRedirect(second, endpoint)
}
function startTimerRedirect(seconds,endpoint) {
    const TIME_LIMIT = seconds
    let timePassed = 0
    let timeLeft;
    timerInterval = setInterval(() => {

        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;

        document.getElementById("counter").innerHTML = timeLeft;
        if (timePassed == TIME_LIMIT) {
            window.location = `http://${window.location.host}${endpoint}`
        }
    }, 1000);
}

function popUpoOff(){
    const elementosPopup = document.querySelector('.popupscreen');
    body.removeChild(elementosPopup);
}