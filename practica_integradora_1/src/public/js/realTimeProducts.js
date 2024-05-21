const socket = io();
let cartId;

function sendDataCreate() {
  const data = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: document.getElementById("price").value,
    status: true,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    cartId: cartId,
  };

  socket.emit("newProduct", data);
}

function sendDataDelete() {
  const data = document.getElementById("delete-id").value;
  socket.emit("deleteProduct", data);
}

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
