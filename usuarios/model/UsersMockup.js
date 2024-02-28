import {user, userRol} from './UserModel.js';
import {Rol} from '../../src/Modelo/Syssopgan/RolModel.js';
import {Usuario} from '../../src/Modelo/Syssopgan/UsuarioModel.js';


import ibmdb from "ibm_db"

let connStr = "DATABASE=SYSSOP;HOSTNAME=192.168.1.28;UID=db2inst1;PWD=H0l41324%;PORT=25000;PROTOCOL=TCPIP";

class userPort{
    save(user){}
    findOne(email){}
}

//guarda al usuario para persistencia
async function saveUser(user) {

    const rol = await Rol.findOne(
        {
            where: { nombre : "usuario"} 
        }
    );

    if (!rol) return null;

    let con;
    ibmdb.open(connStr,
        function(err,conn) {
          if (err) return console.log(err);
          conn.query("INSERT INTO TECNICO.USUARIO (ID_US, NOMBRE, APELLIDO, EMAIL, NUM_TEL, PASSWORD, EMPRESA, CARGO, DEPARTAMENTO, TOKEN, ULTIMA_CONEXION, ID_ROLREF) VALUES('"+user.id+"', '"+user.name+"', '"+user.lastName+"', '"+user.email+"', '"+user.cellphone+"', '"+user.password+"', '"+user.empress+"', '"+user.cargo+"', '"+user.departament+"', '"+null+"', '2023-02-02 00:00:00.000000', '"+rol.dataValues.id_rol+"');",
            function (err, rows) {
              if (err) console.log(err);
              else
              { console.log(rows);
               }
               conn.close(function () {
                 console.log('done');
               });
            });
        });
    
    try {
    const user1 = await Usuario.create(
        {nombre: user.name, apellido: user.lastName, email: user.email, password: user.password, id_rolref: rol.dataValues.id_rol,
        empresa: user.empress, cargo: user.cargo, num_tel: user.cellphone, departamento: user.departament, id_us: user.id},
        {fields: ['nombre', 'apellido', 'email', 'password', 'id_rolref', 'empresa', 'cargo', 'num_tel', 'departamento', 'id_us'] } );
        
    const newRol = new userRol(rol.dataValues.id_rol, rol.dataValues.nombre, rol.dataValues.descripcion)  
    
    return newRol;
    } catch (error) {
        console.log(error);
    }
    
    
    //users.users.push(user);
}

//busca en la lista de usuarios un email pasado por parametro
async function findOne(email){
    const user1 = await Usuario.findOne(
        {
            where: { email: email }
        }
    )
    //console.log(user1);
    if (!user1) return null;
    const rol = await Rol.findOne(
        {
            where: { id_rol : user1.dataValues.id_rolref} 
        }
    ) 
    ibmdb.open(connStr,
        function(err,conn) {
          if (err) return console.log(err);
          conn.query("SELECT * FROM TECNICO.USUARIO AS USU JOIN TECNICO.ROL AS ROL ON USU.ID_ROLREF = ROL.ID_ROL WHERE EMAIL = '"+email+"';",
            function (err, data) {
              if (err) console.log(err);
              else
              { console.log(data[0]);
               }
               conn.close(function () {
                 console.log('done');
               });
            });
        });
    

       
    const newuser = new user(user1.dataValues.nombre,user1.dataValues.apellido, user1.dataValues.email, user1.dataValues.password,
        user1.dataValues.num_tel, user1.dataValues.empresa,user1.dataValues.cargo, user1.dataValues.departamento, 
        new userRol(rol.dataValues.id_rol, rol.dataValues.nombre, rol.dataValues.descripcion), user1.dataValues.id_us);
        
    return newuser;
    //return users.users.find((users) => users.email == email);
}

//devuelve un objeto tipi usuario por id
async function findOneById(id){
    
    ibmdb.open(connStr,
        function(err,conn) {
          if (err) return console.log(err);
          conn.query("SELECT * FROM TECNICO.USUARIO AS USU JOIN TECNICO.ROL AS ROL ON USU.ID_ROLREF = ROL.ID_ROL WHERE ID_US = '"+id+"';",
            function (err, data) {
              if (err) console.log(err);
              else
              { console.log(data[0]);
               }
               conn.close(function () {
                 console.log('done');
               });
            });
        });
    
    const user1 = await Usuario.findByPk(id, {
        include: [
            {
                model: Rol,
            }

        ]
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    }); 
    //console.log(user1);
    const newuser = new user(user1.dataValues.nombre,user1.dataValues.apellido, 
        user1.dataValues.email, user1.dataValues.password,
        user1.dataValues.num_tel, user1.dataValues.empresa,user1.dataValues.cargo, 
        user1.dataValues.departamento, 
        new userRol(user1.rol.dataValues.id_rol, user1.rol.dataValues.nombre, user1.rol.dataValues.descripcion), 
        user1.dataValues.id_us);

    return newuser;
    //return users.users.find((users) => users.id == id);
}

//actualiza el rol del usuario cuyo email se paso por el req.body
async function updateRol(rol, email) {
    const rolFound = await Rol.findOne(
        {
            where: { nombre : rol} 
        }
    );

    if (!rolFound) return null;

    const user1 = await Usuario.findOne(
        {
            where: { email: email }
        }
    );

    if (!rolFound) return null;

    user1.id_rolref = rolFound.id_rol;

    user1.save();

    const newuser = new user(user1.dataValues.nombre,user1.dataValues.apellido, 
        user1.dataValues.email, user1.dataValues.password,
        user1.dataValues.num_tel, user1.dataValues.empresa,user1.dataValues.cargo, 
        user1.dataValues.departamento, 
        new userRol(rolFound.dataValues.id_rol, rolFound.dataValues.nombre, rolFound.dataValues.descripcion), 
        user1.dataValues.id_us);

    return newuser;
}



export default class userMockup extends userPort{
    users = [];
    static save(user){
        
        return saveUser(user);
        //console.log(users);
    }

    static findOne(email){
        return findOne(email);
    }

    static findOneById(id){
        return findOneById(id);
    }

    static updateRol(rol, email){
        return updateRol(rol, email);
    }
    
}

let users = new userMockup();

