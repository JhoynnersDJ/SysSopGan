import {user , userRol} from '../model/UserModel.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from "jsonwebtoken";
import  {v4 } from "uuid";
const TOKEN_SECRET = process.env.TOKEN_SECRET;



//se registra el usuario y genera su id 
export const register = async (req, res) => {
    const { name,lastName, email, password, cellphone, empress, departament } = req.body;
    
    try {
        //se busaca el correo para saber si ya esta registrado
        const userFound = await user.findOne(email);
        
        //si se encuentra el email se da el siguiente mensaje de error
        if (userFound) return res.status(400).json(["The email alredy exists"]);
        
        //se cifra la contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        
        //se genera el id unico del usuario
        let idUnico = v4();
        
        //se crea un nuevo usuario
        const newuser = new user(name,lastName, email, passwordHash, cellphone, empress, departament, 
            new userRol(1, 'user', 'user of the system'), idUnico,);
        
        //se guarda el usuario
        newuser.save();
        //se genera el token para ser manejado por la cookie
        const token = await createAccessToken({ id: newuser.getUserId(), rol: newuser.getUserRol() });
        
        //se envia de respuesta el token yy los datos ingresados
        res.cookie('token', token);
        res.json({
            id: newuser.getUserId(),
            name: newuser.getUserName(),
            lastName: newuser.getUserLastName(),
            email: newuser.getUserEmail(),
            password: newuser.getUserPassword(), 
            cellphone: newuser.getUserCellphone(), 
            empress: newuser.getUserEmpress(), 
            departament: newuser.getUserDepartament(),
            rol: newuser.getUserRol()
        });
        console.log('Se creo el usuario correctamente');
        //console.log(newuser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


// inicia sesion el usuario
export const login = async (req, res) => {
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
        const token = await createAccessToken({ id: userFound.getUserId(), rol: userFound.getUserRol() });

        //se envia de respuesta el token y los datos ingresados
        res.cookie('token', token);
        res.json({
            id: userFound.getUserId(),
            username: userFound.getUserName(),
            email: userFound.getUserEmail()
        });
        console.log(`El usuario ${userFound.getUserName()} a iniciado sesion`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

//finalizar sesion del usuario
export const logout = (req, res) => {
    //se le agota el tiempo de vida de la cookie
    res.cookie('token', "", {
        expires: new Date(0)
    })
    return res.sendStatus(200);
}

//obtener datos del usuario
export const profile = async (req, res) => {
    //busca al usuario por el email
    const userFound = await user.findOneById(req.user.id)

    //si no encuentra al usurio da el mensaje de error
    if (!userFound) return res.status(400).json({ message: "User not found" });

    //manda una respuesta con los datos del usuario encontrados
    return res.json({
        id: userFound.getUserId(),
        name: userFound.getUserName(),
        lastName: userFound.getUserLastName(),
        email: userFound.getUserEmail(),
        password: userFound.getUserPassword(), 
        cellphone: userFound.getUserCellphone(), 
        empress: userFound.getUserEmpress(), 
        departament: userFound.getUserDepartament(),
        rol: userFound.getUserRol()
    });

}

