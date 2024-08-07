const socket = io();

socket.on("productos", (data) => {
  renderProductos(data);
});

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  productos.forEach((item) => {
    const card = document.createElement("div");
    card.innerHTML = `  <p> ${item.title} </p>
                            <p> ${item.description} </p>
                            <p> $${item.price} </p>
                            <button> Eliminar </button>`;
    contenedorProductos.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(item.id);
    });
  });
};

const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

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
    console.log("Enviado al socket");

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("code").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
  } else {
    console.log("Todos los campos son obligatorios.");
  }
});
