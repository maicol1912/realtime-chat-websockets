const username = localStorage.getItem('name');
if(!username){
    window.location.replace('/')
    throw new Error('Username is required')
}


const lbStatusOnline = document.querySelector('#status-online')
const lbStatusOffline = document.querySelector('#status-offline')

const usersUlElement = document.querySelector('ul')

const form = document.querySelector('form')
const input = document.querySelector('input')
const chatElement = document.querySelector('#chat')
const renderUsers = ( users ) =>{
    usersUlElement.innerHTML = ''
    users.forEach((user)=>{
        const liElement = document.createElement('li')
        liElement.innerText = user.name
        usersUlElement.appendChild(liElement)
    })
}

const renderMessage = ( payload )=>{
    const {userId,message,name} = payload;

    const divElement = document.createElement('div')
    divElement.classList.add('message');

    if(userId !== socket.id){
        divElement.classList.add('incoming')
    }
    divElement.innerHTML = `
    <small>${name}</small>
    <p>${message}</p>
    `;
    chatElement.appendChild( divElement )

    chatElement.scrollTop = chatElement.scrollHeight
}
form.addEventListener('submit',(event)=>{
    event.preventDefault();

    const message = input.value;
    input.value = '';

    socket.emit('send-message',message)
})
const socket = io({
    auth:{
        token : 'ABC-123',
        name:username
    }
})
socket.on('connect',()=>{
    lbStatusOnline.classList.remove('hidden')
    lbStatusOffline.classList.add('hidden')
    console.log('Conectado')
});

socket.on('disconnect',()=>{
    lbStatusOnline.classList.add('hidden')
    lbStatusOffline.classList.remove('hidden')
    console.log('Desconectado')
})

socket.on('welcome-message',(data)=>{
    console.log(data)
})

socket.on('on-clients-changed', renderUsers)

socket.on('on-message',renderMessage)