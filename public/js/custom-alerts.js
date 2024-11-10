/**
 * Displays a custom alert with a specified message and type.
 * @param {string} message - The message to display.
 * @param {string} type - The type of alert ('success' or 'error').
 */
function showCustomAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.classList.add('show');
    }, 10);
    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 300);
    }, 3000);
}
