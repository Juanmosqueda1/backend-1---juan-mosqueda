const socket = io();

// Escuchar el evento "productos" y llamar a renderProductos
socket.on("productos", (data) => {
  console.log("Productos recibidos:", data); // Depuración
  renderProductos(data);
});

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  productos.forEach((item) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <p> ${item.title} </p>
      <p> ${item.description} </p>
      <p> $${item.price} </p>
      <button> Eliminar </button>`;

    contenedorProductos.appendChild(card);

    // Agregar evento de eliminación de producto
    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(item.id);
    });
  });
};

// Emitir el evento para eliminar un producto
const eliminarProducto = (id) => {
  console.log("Eliminar producto con id:", id); // Depuración
  socket.emit("eliminarProducto", id);
};

// Manejar el envío del formulario
const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const code = document.getElementById("code").value.trim();
  const price = document.getElementById("price").value.trim();
  const stock = document.getElementById("stock").value.trim();

  if (title && description && code && price && stock) {
    socket.emit("productForm", {
      title,
      description,
      code,
      price,
      stock,
    });

    console.log("Datos enviados:", {
      title,
      description,
      code,
      price,
      stock,
    });

    // Resetea el formulario
    formulario.reset();
  } else {
    console.log("Todos los campos son obligatorios.");
  }
});
