const TOKEN_SECRET = process.env.TOKEN_SECRET;
import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
    //obtiene el usuario del request
    const {token} = req.cookies;
    //console.log(token)
    //si no hay usuario lanza un error
    if (!token) return res.status(401).json({message: "No Token, authorization denied"});
    
    //se verifica el token
    jwt.verify(token,TOKEN_SECRET, (err, user) => {
        console.log(token)
        if (err) return res.status(403).json({message: "Invalid Token"});

        req.user = user

        next()
    })
   
}
