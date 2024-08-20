"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)();
const clientsTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const chatForm = document.getElementById("message-form");
const nameInput = document.getElementById("name-input");
const chatInput = document.getElementById("message-input");
/*
if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage();
    });
}
*/
socket.on("client-total", (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`;
});
chatForm === null || chatForm === void 0 ? void 0 : chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});
const sendMessage = () => {
    if (!chatInput || chatInput.value === "" || !nameInput)
        return; // Add null check for nameInput
    const data = {
        name: nameInput.value,
        message: chatInput.value,
        dateTime: new Date(),
    };
    // Emit the event to the server
    socket.emit("message", data);
    addMessage(true, data);
    chatInput.value = "";
};
// handle the event emitted for the connected users size
socket.on("client-total", (data) => {
    console.log("conected");
    clientsTotal.innerText = `Total de clientes: ${data}`;
});
socket.on("chat", (data) => {
    addMessage(false, data);
});
const addMessage = (isOwnMessage, data) => {
    if (!messageContainer)
        return; // Add null check here
    clearFeedback();
    const element = `<li class="${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message">
            ${data.message}
            
            <span>${data.name} ● ${
    // @ts-ignore
    moment(data.dateTime).fromNow()}</span>
        </p>
    </li>`;
    messageContainer.innerHTML += element;
    scrollDown();
};
const scrollDown = () => {
    if (messageContainer) {
        messageContainer.scrollTo(0, messageContainer.scrollHeight);
    }
};
// if a user focus on the input field
chatInput.addEventListener("focus", (e) => {
    socket.emit("feedback", {
        feedback: `✍️ ${nameInput.value} is typing a message...`,
    });
});
// if user presses a key
chatInput.addEventListener("keypress", (e) => {
    socket.emit("feedback", {
        feedback: `✍️ ${nameInput.value} is typing a message...`,
    });
});
// when the input field blurs out and not in focus
chatInput.addEventListener("blur", (e) => {
    socket.emit("feedback", {
        feedback: ``,
    });
});
socket.on("user-typing", (data) => {
    if (messageContainer) {
        clearFeedback();
        const element = `<li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`;
        messageContainer.innerHTML += element;
    }
});
const clearFeedback = () => {
    document.querySelectorAll("li.message-feedback").forEach((element) => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
};
