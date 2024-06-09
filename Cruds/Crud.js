// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('create-pedido-form');
//     const resultContainer = document.getElementById('results');

//     form.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const estado = form.estado.value;
//         const fecha = form.fecha.value;

//         const response = await fetch('/insertarPedido', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ estado, fecha }),
//         });

//         const result = await response.json();
//         resultContainer.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
//     });
// });

// // Función para actualizar un pedido
// async function actualizarPedido() {
//     const pedidoID = document.getElementById('pedidoID').value;
//     const estado = document.getElementById('estado').value;
//     const fecha = document.getElementById('fecha').value;

//     const response = await fetch(`/actualizarPedido/${pedidoID}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ estado, fecha })
//     });

//     if (response.ok) {
//         alert('Pedido actualizado exitosamente');
//     } else {
//         alert('Error al actualizar el pedido');
//     }
// }

// // Función para eliminar un pedido
// async function eliminarPedido() {
//     const pedidoID = document.getElementById('pedidoID').value;

//     const response = await fetch(`/eliminarPedido/${pedidoID}`, {
//         method: 'DELETE'
//     });

//     if (response.ok) {
//         alert('Pedido eliminado exitosamente');
//     } else {
//         alert('Error al eliminar el pedido');
//     }
// }

// // Agregar eventos a los botones de actualizar y eliminar
// document.getElementById('actualizarPedidoButton').addEventListener('click', actualizarPedido);
// document.getElementById('eliminarPedidoButton').addEventListener('click', eliminarPedido);
