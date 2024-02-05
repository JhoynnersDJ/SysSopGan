const user = require('../model/UserModel.js');
const bcrypt = require('bcryptjs');
const createAccessToken = require('../libs/jwt.js');
const jwt = require ('jsonwebtoken');
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const uuidv4 = require('uuid');


//se registra el usuario y genera su id 
const register = async (req, res) => {
    const { email, password, username } = req.body;
    
    try {
        //se busaca el correo para saber si ya esta registrado
        const userFound = await user.findOne(email);
        
        //si se encuentra el email se da el siguiente mensaje de error
        if (userFound) return res.status(400).json(["The email alredy exists"]);
        
        //se cifra la contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        
        //se genera el id unico del usuario
        let idUnico = uuidv4.v4();

        //se crea un nuevo usuario
        const newuser = new user(username, email, passwordHash, idUnico);
        
        //se guarda el usuario
        newuser.save();

        //se genera el token para ser manejado por la cookie
        const token = await createAccessToken.createAccessToken({ id: newuser.getUserId() });

        //se envia de respuesta el token yy los datos ingresados
        res.cookie('token', token);
        res.json({
            id: newuser.getUserId(),
            username: newuser.getUserName(),
            email: newuser.getUserEmail(),
        });
        console.log('Se creo el usuario correctamente');
        console.log(newuser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


// inicia sesion el usuario
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //busca al usuario por el email
        const userFound = await user.findOne( email )

        //si no se encuentra el email se da el siguiente mensaje de error
        if (!userFound) return res.status(400).json({ message: "user not Found" });

        //se decifra la contrase;a y se compara
        const isMatch = await bcrypt.compare(password, userFound.password);

        //si no son iguales da el mensaje de error
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        //se genera un token para ser manejado como una cookie
        const token = await createAccessToken.createAccessToken({ id: userFound.getUserId() });

        //se envia de respuesta el token yy los datos ingresados
        res.cookie('token', token);
        res.json({
            id: userFound.getUserId(),
            username: userFound.getUserName(),
            email: userFound.getUserEmail()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

//finalizar sesion del usuario
const logout = (req, res) => {
    //se le agota el tiempo de vida de la cookie
    res.cookie('token', "", {
        expires: new Date(0)
    })
    return res.sendStatus(200);
}

//obtener datos del usuario
const profile = async (req, res) => {
    //busca al usuario por el email
    const userFound = await user.findById(req.user.id)

    //si no encuentra al usurio da el mensaje de error
    if (!userFound) return res.status(400).json({ message: "User not found" });

    //manda una respuesta con los datos del usuario encontrados
    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updateAt: userFound.updatedAt
    });

}

module.exports = { "register": register, "login": login, "logout":logout, "profile":profile}