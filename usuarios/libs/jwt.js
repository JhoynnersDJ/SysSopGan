const TOKEN_SECRET = process.env.TOKEN_SECRET;
const jwt = require('jsonwebtoken');

//funcion que crea el TOKEN para mantener iniciada la sesion
function createAccessToken(payload){
    console.log(TOKEN_SECRET)
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            TOKEN_SECRET,
            { 
                expiresIn: "1d",
            },
            (err, token) => {
                if (err) reject(err);  
                resolve(token);              
            }            
        );

    })
}
module.exports = { "createAccessToken": createAccessToken} 