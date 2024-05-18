// const socket = io();

// function sendDataCreate() {
//   const data = {
//     title: document.getElementById("title").value,
//     description: document.getElementById("description").value,
//     code: document.getElementById("code").value,
//     price: document.getElementById("price").value,
//     status: true,
//     stock: document.getElementById("stock").value,
//     category: document.getElementById("category").value,
//   };

//   socket.emit("newProduct", data);
// }

// function sendDataDelete() {
//   const data = document.getElementById("delete-id").value;

//   socket.emit("deleteProduct", data);
// }

//----------------
// const socket = io();

// function sendDataCreate() {
//   const data = {
//     title: document.getElementById("title").value,
//     description: document.getElementById("description").value,
//     code: document.getElementById("code").value,
//     price: document.getElementById("price").value,
//     status: true,
//     stock: document.getElementById("stock").value,
//     category: document.getElementById("category").value,
//     cartId: document.getElementById("cart-id").value, // Añadido el ID del carrito
//   };

//   socket.emit("newProduct", data);
// }

// function sendDataDelete() {
//   const data = document.getElementById("delete-id").value;

//   socket.emit("deleteProduct", data);
// }

//------------

// const socket = io();

// function sendDataCreate() {
//   const cartId = "ID_DEL_CARRITO";  // Reemplaza esto con el ID del carrito correspondiente

//   const data = {
//     title: document.getElementById("title").value,
//     description: document.getElementById("description").value,
//     code: document.getElementById("code").value,
//     price: document.getElementById("price").value,
//     status: true,
//     stock: document.getElementById("stock").value,
//     category: document.getElementById("category").value,
//     cartId: cartId  // Incluye el ID del carrito
//   };

//   socket.emit("newProduct", data);
// }

// function sendDataDelete() {
//   const data = document.getElementById("delete-id").value;
//   socket.emit("deleteProduct", data);
// }

//---

const socket = io();
let cartId; // Variable para almacenar el ID del carrito

function sendDataCreate() {
  const data = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: document.getElementById("price").value,
    status: true,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    cartId: cartId, // Usar el ID del carrito almacenado
  };

  socket.emit("newProduct", data);
}

function sendDataDelete() {
  const data = document.getElementById("delete-id").value;
  socket.emit("deleteProduct", data);
}

// Obtener o crear un carrito al conectar
socket.on("connect", () => {
  socket.emit("getOrCreateCart", {}, (response) => {
    cartId = response.cartId;
  });
});

socket.on("productAdded", (newProduct) => {
  console.log("Producto añadido:", newProduct);
});

socket.on("productDeleted", (productId) => {
  console.log("Producto eliminado:", productId);
});
