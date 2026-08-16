//Copyright (c) 2025 J.S.Jasrotia. License: MIT. See LICENSE file for details.
const form = document.getElementById("contactForm")

form.addEventListener("submit", async (e)=>{

e.preventDefault()

const data = {
name:document.getElementById("name").value,
email:document.getElementById("email").value,
message:document.getElementById("message").value
}

const response = await fetch("/api/contact.php",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
})

const result = await response.json()

if(result.status === "success"){
alert("Message sent!")
form.reset()
}else{
alert(result.message)
}

}) 
