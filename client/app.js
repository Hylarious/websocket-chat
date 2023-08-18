const socket = io();

const loginForm = document.querySelector('#welcome-form');
const messageSection = document.querySelector('#messages-section');
const messageList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

let userName = ''

socket.on('message', ({ author, content }) => addMessage(author, content))


function login(event) {
    event.preventDefault();
    if (userNameInput.value === '') {
        alert('Introduce yourself!')
    } else {
        userName = userNameInput.value
        loginForm.classList.remove('show')
        messageSection.classList.add('show')
        socket.emit('login', userName)
    }
};

function sendMessage(event) {
    event.preventDefault();
    if (messageContentInput.value === '') {
        alert('Your message is empty!')
    } else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { author: userName, content: messageContentInput.value })
        messageContentInput.value = ''
    }
};

function addMessage(name, message) {

    const listItem = document.createElement('li');
    listItem.className = 'message message--received';
    name == userName && listItem.classList.add('message--self');
    
    const heading = document.createElement('h3');
    heading.className = 'message__author';
    name == userName ? heading.textContent = 'You' :  heading.textContent = name;

    const content = document.createElement('div');
    content.className = 'message__content';
    content.textContent = message;

    listItem.appendChild(heading);
    listItem.appendChild(content);


    messageList.appendChild(listItem)
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage)
