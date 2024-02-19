import {user} from './UserModel.js';

import {Usuario} from '../../src/Modelo/Syssopgan/UsuarioModel.js'

class userPort{
    save(user){}
    findOne(email){}
}

//guarda al usuario para persistencia
async function saveUser(user) {
    /*const rol = await Rol.create(
        { nombre: user.rol.nameRol, descripcion:user.rol.descriptionRol },
        { fields: ['nombre', 'descripcion'] }
    )*/
    try {
        await Usuario.create({nombre: user.name, apellido: user.lastName, email: user.email, 
            num_tel:user.cellphone, password: user.password, empresa: user.empress, 
            cargo: user.cargo, departamento: user.departament, id_rolref: '1'},
            {fields: ['nombre', 'apellido', 'email', 'num_tel', 'password', 'empresa', 'cargo', 
            'departamento', 'id_rolref']})
    } catch (error) {
        console.log(error.message);
    }
    
    
    users.users.push(user);
}

//busca en la lista de usuarios un email pasado por parametro
function findOne(email){
    return users.users.find((users) => users.email == email);
}

function findOneById(id){
    return users.users.find((users) => users.id == id);
}

export default class userMockup extends userPort{
    users = [];
    static save(user){
        
        saveUser(user);
        //console.log(users);
    }

    static findOne(email){
        return findOne(email);
    }

    static findOneById(id){
        return findOneById(id);
    }
    
}

let users = new userMockup();

