const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const resetButton = document.getElementById('resetButton');

// Simulación de datos de clientes (puedes reemplazar esto con solicitudes AJAX a tu servidor)
const clientes = [
    { id: 1, nombre: 'Keylor Palacios Gómez', contador: 0 },
    { id: 2, nombre: 'Fabier Méndez Quesada', contador: 0 },
    { id: 3, nombre: 'Diego Castro Carazo', contador: 0 },
    { id: 4, nombre: 'Farlen Méndez Cespedes', contador: 0 },
    { id: 5, nombre: 'Osquitar Rodríguez Carvajal', contador: 0 },
    { id: 6, nombre: 'Omar Hernandez Jiménez', contador: 0 },
    { id: 7, nombre: 'David Solis Carvallo', contador: 0 },
    { id: 8, nombre: 'Fabricio Rojas Rodríguez', contador: 0 },
    { id: 9, nombre: 'Karla Gómez Quintero', contador: 0 }
];

const clientesFrecuentes = [];

// Función para mostrar sugerencias de autocompletado
function mostrarSugerencias(sugerencias) {
    searchResults.innerHTML = '';
    sugerencias.forEach(sugerencia => {
        const li = document.createElement('li');
        const spanNombre = document.createElement('span');
        const spanContador = document.createElement('span');
        
        spanNombre.textContent = sugerencia.nombre;
        spanContador.textContent = ` (${sugerencia.contador} veces buscado)`;
        spanContador.style.color = 'gray'; // Color opcional para el contador

        li.appendChild(spanNombre);
        li.appendChild(spanContador);

        li.addEventListener('click', () => {
            searchInput.value = sugerencia.nombre;
            searchResults.innerHTML = '';
        });

        searchResults.appendChild(li);
    });
}

// Función para filtrar clientes basados en el término de búsqueda
function filtrarClientes(termino) {
    const sugerencias = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().startsWith(termino.toLowerCase())
    );
    mostrarSugerencias(sugerencias);
}

// Función para incrementar el contador de búsqueda del cliente seleccionado
function incrementarContador(cliente) {
    cliente.contador++;
    console.log(`Se ha buscado a ${cliente.nombre} ${cliente.contador} veces.`);
   

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

// Función para actualizar clientes frecuentes
function actualizarClientesFrecuentes() {
    clientes.forEach(cliente => {
        if (cliente.contador >= 5) {
            agregarClienteFrecuente(cliente);
        }
    });
}

// Función para mostrar clientes frecuentes
function mostrarClientesFrecuentes() {
    const clientesFrecuentesList = document.getElementById('clientesFrecuentesList');
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

            spanNombre.textContent = cliente.nombre;
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
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const termino = searchInput.value.trim();
        const clienteSeleccionado = clientes.find(cliente => cliente.nombre.toLowerCase() === termino.toLowerCase());
        if (clienteSeleccionado) {
            incrementarContador(clienteSeleccionado);
        }
    }
});

// Evento de clic en el botón de reset
resetButton.addEventListener('click', () => {
    clientes.forEach(cliente => cliente.contador = 0);
    console.log('Contadores de búsqueda reseteados.');
});

// Evento de clic en el botón de "Clientes Frecuentes"
document.getElementById('clientesFrecuentesButton').addEventListener('click', () => {
    const clientesFrecuentesList = document.getElementById('clientesFrecuentesList');
    clientesFrecuentesList.style.display = (clientesFrecuentesList.style.display === 'none') ? 'block' : 'none';
});

// Inicializar la lista de clientes frecuentes
actualizarClientesFrecuentes();
