// ===== Selección de elementos =====
const albergueForm = document.getElementById('albergueForm');
const notification = document.getElementById('notification');

// ===== Función para mostrar notificaciones =====
function showToast(message, type = 'success') {
    // Crear toast
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    // Añadir al body
    document.body.appendChild(toast);

    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Ocultar y eliminar después de 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// ===== Función de validación simple =====
function validateForm(form) {
    let valid = true;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = '#ff5252';
            setTimeout(() => input.style.borderColor = '#ccc', 2000);
        }
    });
    return valid;
}

// ===== Evento submit del formulario =====
albergueForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm(albergueForm)) {
        showToast('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    // Simulación de envío (aquí se puede integrar API/Backend)
    const nombre = document.getElementById('albergueNombre').value;
    showToast(`Solicitud enviada correctamente para "${nombre}"`, 'success');

    // Limpiar formulario
    albergueForm.reset();
});
