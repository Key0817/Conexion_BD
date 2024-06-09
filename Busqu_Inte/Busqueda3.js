// Obtén referencias a los elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const resetButton = document.getElementById('resetButton');
const clientesFrecuentesList = document.getElementById('clientesFrecuentesList');
const clientesFrecuentesButton = document.getElementById('clientesFrecuentesButton');

const clientesFrecuentes = [];

// Función para obtener clientes desde el backend
async function obtenerClientes() {
    try {
        const response = await fetch('/clientes');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        return [];
    }
}
// Función para mostrar sugerencias de autocompletado
function mostrarSugerencias(sugerencias) {
    searchResults.innerHTML = '';
    sugerencias.forEach(sugerencia => {
        const li = document.createElement('li');
        const spanNombre = document.createElement('span');
        const spanContador = document.createElement('span');
        
        spanNombre.textContent = `${sugerencia['Nombre '] || ''} ${sugerencia['Apellido 1'] || ''} ${sugerencia['Apellido 2'] || ''}`;
        spanContador.style.color = 'gray';

        li.appendChild(spanNombre);
        li.appendChild(spanContador);

        li.addEventListener('click', () => {
            searchInput.value = `${sugerencia['Nombre '] || ''} ${sugerencia['Apellido 1'] || ''} ${sugerencia['Apellido 2'] || ''}`;
            searchResults.innerHTML = '';
            incrementarContador(sugerencia);
        });

        searchResults.appendChild(li);
    });
}

/// Función para filtrar clientes basados en el término de búsqueda
async function filtrarClientes(termino) {
    const clientes = await obtenerClientes();
    const sugerencias = clientes.filter(cliente =>
        `${cliente['Nombre '] || ''} ${cliente['Apellido 1'] || ''} ${cliente['Apellido 2'] || ''}`.toLowerCase().startsWith(termino.toLowerCase())
    );
    mostrarSugerencias(sugerencias);
}

// Evento de entrada para filtrar clientes mientras el usuario escribe
searchInput.addEventListener('input', () => {
    const termino = searchInput.value.trim();
    if (termino.length === 0) {
        searchResults.innerHTML = '';
    } else {
        filtrarClientes(termino);
    }
});

// Evento de clic en el botón para mostrar clientes frecuentes
clientesFrecuentesButton.addEventListener('click', () => {
    mostrarClientesFrecuentes();
});

// Inicialización
mostrarClientesFrecuentes();