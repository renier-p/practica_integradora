const socket = io();
let user;
const chatBox = document.getElementById("chatBox");
const clearChatButton = document.getElementById("clearChat");

Swal.fire({
  title: "Log In",
  input: "text",
  text: "Ingresa tu nombre de usuario",
  inputValidator: (value) => {
    return !value && "Necesitas identificarte para ingresar a la sala";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message}<br>`;
  });
  log.innerHTML = messages;
});

clearChatButton.addEventListener("click", () => {
  messageLogs.innerHTML = "";
  socket.emit("clearChat");
});
