const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages")

// Get username and room from URL
const { sender, receiver } = Qs.parse(location.search, {
     ignoreQueryPrefix: true
 });
console.log(sender, receiver);
// Join Sender and Receiver
socket.emit("joinSenRec", {sender, receiver});

// Message submit from client
chatForm.addEventListener("submit", (e)=>{
     e.preventDefault();
     const msg = e.target.elements.msg.value;
     //console.log(msg);

     // Emit Message to Server
     socket.emit("chatMessage", msg);
     // Clear Input and to focus input box
     e.target.elements.msg.value = "";
     e.target.elements.msg.focus();
});

// Message From Server
socket.on("message", message=>{
     // console.log(message);
     outputMessage(message);
     chatMessages.scrollTop = chatMessages.scrollHeight;
})

function outputMessage(message){
     const li = document.createElement("li");
     li.classList.add("clearfix");
     li.innerHTML = `
          <div class="message-data text-right">
               <span class="message-data-time">10:10 AM, Today</span>
               <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
          </div>
          <div class="message other-message float-right">${message}</div>
     `;
     document.querySelector(".chat-messages").appendChild(li);
}