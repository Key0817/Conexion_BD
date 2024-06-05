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
        const response = await fetch('/api/clientes');
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
        spanContador.textContent = ` (${sugerencia.contador || 0} veces buscado)`;
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

// Función para incrementar el contador de búsqueda del cliente seleccionado
function incrementarContador(cliente) {
    cliente.contador = (cliente.contador || 0) + 1;
    console.log(`Se ha buscado a ${cliente['Nombre '] || ''} ${cliente['Apellido 1'] || ''} ${cliente['Apellido 2'] || ''} ${cliente.contador} veces.`);

    if (cliente.contador >= 5 && !clientesFrecuentes.includes(cliente)) {
        agregarClienteFrecuente(cliente);
    }
}

// Función para agregar cliente a clientes frecuentes
function agregarClienteFrecuente(cliente) {
    if (!clientesFrecuentes.includes(cliente)) {
        clientesFrecuentes.push(cliente);
        mostrarClientesFrecuentes();
    }
}

// Función para quitar cliente de clientes frecuentes
function quitarClienteFrecuente(cliente) {
    const index = clientesFrecuentes.indexOf(cliente);
    if (index !== -1) {
        clientesFrecuentes.splice(index, 1);
        mostrarClientesFrecuentes();
    }
}

// Función para resetear contador de cliente
function resetearContador(cliente) {
    cliente.contador = 0;
    quitarClienteFrecuente(cliente);
}

// Función para mostrar clientes frecuentes
function mostrarClientesFrecuentes() {
    clientesFrecuentesList.innerHTML = '';

    if (clientesFrecuentes.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'Aún no se han registrado clientes frecuentes';
        clientesFrecuentesList.appendChild(mensaje);
    } else {
        clientesFrecuentes.forEach(cliente => {
            const li = document.createElement('li');
            const spanNombre = document.createElement('span');
            const resetButton = document.createElement('button');

            spanNombre.textContent = `${cliente['Nombre '] || ''} ${cliente['Apellido 1'] || ''}`;
            resetButton.textContent = 'Eliminar';
            resetButton.addEventListener('click', () => resetearContador(cliente));

            li.appendChild(spanNombre);
            li.appendChild(resetButton);

            clientesFrecuentesList.appendChild(li);
        });
    }
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

// Evento de presionar Enter en la barra de búsqueda
searchInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const termino = searchInput.value.trim();
        const clientes = await obtenerClientes();
        const clienteSeleccionado = clientes.find(cliente => `${cliente['Nombre '] || ''} ${cliente['Apellido 1'] || ''} ${cliente['Apellido 2'] || ''}`.toLowerCase() === termino.toLowerCase());
        if (clienteSeleccionado) {
            incrementarContador(clienteSeleccionado);
        }
    }
});

// Evento de clic en el botón de reset
resetButton.addEventListener('click', () => {
    clientes.forEach(cliente => cliente.contador = 0);
    console.log('Se han reiniciado los contadores de todos los clientes.');
    clientesFrecuentes.length = 0;
    mostrarClientesFrecuentes();
});

// Evento de clic en el botón para mostrar clientes frecuentes
clientesFrecuentesButton.addEventListener('click', () => {
    mostrarClientesFrecuentes();
});

// Inicialización
mostrarClientesFrecuentes();
