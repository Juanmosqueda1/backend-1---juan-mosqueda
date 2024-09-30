// const formulario = document.getElementById("formlogin")

// formulario.addEventListener("submit", () =>{
//     let email = document.getElementById("email").value;
//     let password = document.getElementById("password").value

//     let obj = {
//         email,
//         password
//     }

//     fetch("/login", {
//         method: "POST",
//         body: JSON.stringify(obj),
//         headers: {
//             "Content-Type":"application/json"
//         }
//     })
//     .then(result => result.json())
//     .then(json => {
//         localStorage.setItem("authToken", json.token)
//     })


// })