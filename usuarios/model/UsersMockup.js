import { user, userRol } from "./UserModel.js";
import { Rol } from "../../src/Modelo/Syssopgan/RolModel.js";
import { Usuario } from "../../src/Modelo/Syssopgan/UsuarioModel.js";
import "dotenv/config";
import nodemailer from "nodemailer";
import twilio from "twilio";

import ibmdb from "ibm_db";

const dbSelect = process.env.SELECT_DB;
var emailTemp;
let connStr =
  "DATABASE=" +
  process.env.DATABASE +
  ";HOSTNAME=" +
  process.env.HOSTNAME +
  ";UID=" +
  process.env.UID +
  ";PWD=" +
  process.env.PWD +
  ";PORT=" +
  process.env.PORT_DB2 +
  ";PROTOCOL=" +
  process.env.PROTOCOL;

//guarda al usuario para persistencia
async function saveUser(user) {
  try {
    if (dbSelect == "MYSQL") {
      const rol = await Rol.findOne({
        where: { nombre: "usuario" },
      });

      if (!rol) return null;

      const user1 = await Usuario.create(
        {
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          password: user.password,
          id_rolref: rol.dataValues.id_rol,
          empresa: user.empresa,
          cargo: user.cargo,
          num_tel: user.num_tel,
          departamento: user.departamento,
          id_us: user.id_us,
        },
        {
          fields: [
            "nombre",
            "apellido",
            "email",
            "password",
            "id_rolref",
            "empresa",
            "cargo",
            "num_tel",
            "departamento",
            "id_us",
          ],
        }
      );

      return new userRol(
        rol.dataValues.id_rol,
        rol.dataValues.nombre,
        rol.dataValues.descripcion
      );
    }

    //DB2

    if (dbSelect == "DB2") {
      var rol2 = await new Promise((resolve, reject) => {
        ibmdb.open(connStr, async (err, conn) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            try {
              const data = await conn.query(
                "SELECT * FROM TECNICO.ROL WHERE NOMBRE = ?;",
                ["usuario"]
              );
              await conn.query(
                "INSERT INTO TECNICO.USUARIO (ID_US, NOMBRE, APELLIDO, EMAIL, NUM_TEL, PASSWORD, EMPRESA, CARGO, DEPARTAMENTO, TOKEN, ULTIMA_CONEXION, ID_ROLREF) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  user.id_us,
                  user.nombre,
                  user.apellido,
                  user.email,
                  user.num_tel,
                  user.password,
                  user.empresa,
                  user.cargo,
                  user.departamento,
                  null,
                  null,
                  data[0].ID_ROL,
                ]
              );
              conn.close(() => {
                // console.log('done');
              });
              console.log(data[0]);
              resolve(data[0]);
            } catch (err) {
              console.log(err);
              reject(err);
            }
          }
        });
      });

      return new userRol(rol2.ID_ROL, rol2.NOMBRE_ROL, rol2.DESCRIPCION);
    }
    return null;
  } catch (error) {
    console.log(error);
  }

  //users.users.push(user);
}

//busca en la lista de usuarios un email pasado por parametro
async function findOne(email) {
  if (dbSelect == "MYSQL") {
    const user1 = await Usuario.findOne({
      where: { email: email },
    });
    //console.log(user1);
    if (!user1) return null;
    const rol = await Rol.findOne({
      where: { id_rol: user1.dataValues.id_rolref },
    });
    return new user(
      user1.dataValues.nombre,
      user1.dataValues.apellido,
      user1.dataValues.email,
      user1.dataValues.password,
      user1.dataValues.num_tel,
      user1.dataValues.empresa,
      user1.dataValues.cargo,
      user1.dataValues.departamento,
      new userRol(
        rol.dataValues.id_rol,
        rol.dataValues.nombre,
        rol.dataValues.descripcion
      ),
      user1.dataValues.id_us,
      user1.dataValues.verificado
    );
  }

  //DB2

  if (dbSelect == "DB2") {
    var user2 = await new Promise((resolve, reject) => {
      ibmdb.open(connStr, async (err, conn) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          try {
            const data = await conn.query(
              "SELECT ROL.NOMBRE AS NOMBRE_ROL,USU.NOMBRE AS NOMBRE_USU,* FROM TECNICO.USUARIO AS USU JOIN TECNICO.ROL AS ROL ON USU.ID_ROLREF = ROL.ID_ROL WHERE EMAIL = ?;",
              [email]
            );
            conn.close(() => {
              // console.log('done');
            });
            resolve(data[0]);
          } catch (err) {
            console.log(err);
            reject(err);
          }
        }
      });
    });
    if (!user2) return null;
    return new user(
      user2.NOMBRE_USU,
      user2.APELLIDO,
      user2.EMAIL,
      user2.PASSWORD,
      user2.NUM_TEL,
      user2.EMPRESA,
      user2.CARGO,
      user2.DEPARTAMENTO,
      new userRol(user2.ID_ROL, user2.NOMBRE_ROL, user2.DESCRIPCION),
      user2.ID_US
    );
  }

  return null;
  //return users.users.find((users) => users.email == email);
}

//devuelve un objeto tipi usuario por id
async function findOneById(id) {
  if (dbSelect == "MYSQL") {
    const user1 = await Usuario.findByPk(id, {
      include: [
        {
          model: Rol,
        },
      ],
    }).catch((error) => {
      console.error("Failed to retrieve data : ", error);
    });
    if (!user1) return null;
    return new user(
      user1.dataValues.nombre,
      user1.dataValues.apellido,
      user1.dataValues.email,
      user1.dataValues.password,
      user1.dataValues.num_tel,
      user1.dataValues.empresa,
      user1.dataValues.cargo,
      user1.dataValues.departamento,
      new userRol(
        user1.rol.dataValues.id_rol,
        user1.rol.dataValues.nombre,
        user1.rol.dataValues.descripcion
      ),
      user1.dataValues.id_us,
      user1.dataValues.verificado
    );
  }
  //DB2
  if (dbSelect == "DB2") {
    var user2 = await new Promise((resolve, reject) => {
      ibmdb.open(connStr, async (err, conn) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          try {
            const data = await conn.query(
              "SELECT ROL.NOMBRE AS NOMBRE_ROL,USU.NOMBRE AS NOMBRE_USU,* FROM TECNICO.USUARIO AS USU JOIN TECNICO.ROL AS ROL ON USU.ID_ROLREF = ROL.ID_ROL WHERE USU.ID_US = ?;",
              [id]
            );
            conn.close(() => {
              // console.log('done');
            });
            resolve(data[0]);
          } catch (err) {
            console.log(err);
            reject(err);
          }
        }
      });
    });

    if (!user2) return null;
    return new user(
      user2.NOMBRE_USU,
      user2.APELLIDO,
      user2.EMAIL,
      user2.PASSWORD,
      user2.NUM_TEL,
      user2.EMPRESA,
      user2.CARGO,
      user2.DEPARTAMENTO,
      new userRol(user2.ID_ROL, user2.NOMBRE_ROL, user2.DESCRIPCION),
      user2.ID_US
    );
  }

  return null;
  //return users.users.find((users) => users.id == id);
}

//actualiza el rol del usuario cuyo email se paso por el req.body
async function updateRol(rol, email) {
  if (dbSelect == "MYSQL") {
    const rolFound = await Rol.findOne({
      where: { nombre: rol },
    });

    if (!rolFound) return null;

    const user1 = await Usuario.findOne({
      where: { email: email },
    });

    if (!user1) return null;

    user1.id_rolref = rolFound.id_rol;

    user1.save();

    return new user(
      user1.dataValues.nombre,
      user1.dataValues.apellido,
      user1.dataValues.email,
      user1.dataValues.password,
      user1.dataValues.num_tel,
      user1.dataValues.empresa,
      user1.dataValues.cargo,
      user1.dataValues.departamento,
      new userRol(
        rolFound.dataValues.id_rol,
        rolFound.dataValues.nombre,
        rolFound.dataValues.descripcion
      ),
      user1.dataValues.id_us,
      user1.dataValues.verificado
    );
  }

  //DB2
  if (dbSelect == "DB2") {
    var user2 = await new Promise((resolve, reject) => {
      ibmdb.open(connStr, async (err, conn) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          try {
            const data = await conn.query(
              "SELECT * FROM TECNICO.ROL WHERE NOMBRE = ?;",
              [rol]
            );
            if (!data[0]) return null;
            await conn.query(
              "UPDATE TECNICO.USUARIO AS USU SET USU.ID_ROLREF = ? WHERE USU.EMAIL = ?;",
              [data[0].ID_ROL, email]
            );
            const user1 = await conn.query(
              "SELECT ROL.NOMBRE AS NOMBRE_ROL,USU.NOMBRE AS NOMBRE_USU,* FROM TECNICO.USUARIO AS USU JOIN TECNICO.ROL AS ROL ON USU.ID_ROLREF = ROL.ID_ROL WHERE EMAIL = ?;",
              [email]
            );
            conn.close(() => {
              // console.log('done');
            });
            resolve(user1[0]);
          } catch (err) {
            console.log(err);
            reject(err);
          }
        }
      });
    });

    return new user(
      user2.NOMBRE_USU,
      user2.APELLIDO,
      user2.EMAIL,
      user2.PASSWORD,
      user2.NUM_TEL,
      user2.EMPRESA,
      user2.CARGO,
      user2.DEPARTAMENTO,
      new userRol(user2.ID_ROL, user2.NOMBRE_ROL, user2.DESCRIPCION),
      user2.ID_US
    );
  }

  return null;
}

async function updateToken(token, id) {
  if (dbSelect == "MYSQL") {
    const userFound = await Usuario.findByPk(id);

    if (!userFound) return null;
    sendSMSToken(token,userFound.num_tel,userFound.nombre);
    userFound.token = token;

    return userFound.save();
  }
}

async function sendEmailToken(token, email, nombre) {
  emailTemp = email;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWD,
    },
  });
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Título de la Página</title>
          <style>
              body {
                  margin: 0;
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
              }
      
              header {
                  background-color: #333;
                  padding-left: 4vh;
                  padding-right: 10vh;
                  padding-top: 2%;
                  padding-bottom: 2%;
              }
      
              h1 {
                  color: white;
                  font-size: 5vh;
              }
      
              h2 {
                  font-weight: bold;
                  margin-left: 5%;
                  margin-top: 10px;
                  font-size: 24px;
                  margin-right: 5%;
              }
      
              p {
                  margin-left: 5%;
                  font-size: 16px;
                  line-height: 1.5;
                  margin-right: 5%;
                  margin-top: 20px;
                  font-size: 18px;
                  color: #333;
                  line-height: 1.5;
                  text-align: justify;
              }
      
              .token-container {
                  background-color: #666;
                  color: #fff;
                  padding: 10px;
                  border-radius: 5px;
                  font-size: 18px;
                  margin-top: 10px;
                  text-align: center;
              }
      
              .token {
                  font-size: 24px;
                  font-weight: bold;
                  color: orange;
              }
      
              .container {
                    max-width: 900px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px #f2f2f2;
                  }
              .span1 {
                  color: orange
              }
          </style>
      </head>
      <body style="padding: 20px;">
          <div class="container">
              <header>
                  <h1>SYSSOPGAN<span class="span1">400</span>
              </header>
              <h2>Bienvenido a SYSSOPGAN</h2>
              <p>Hola <span class="span1">${nombre}</span>!</p>
             
              <p>
                  El siguiente correo es para la actualización de su cuenta de correo electrónico.
                  Ingrese el siguiente Código de Verificación, en la aplicación para validar el cambio.                  
              </p>
              <div class="token-container">
                  <span class="token">${token}</span>
              </div>
              <hr>  
          </div>
      </body>
      </html>    
      `;
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Actualización de Correo Electronico",
    html: htmlContent,
  };
  
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function updateEmail(id) {
  if (dbSelect == "MYSQL") {
    const userFound = await Usuario.findByPk(id);

    if (!userFound) return null;

    if (!emailTemp) return null;

    userFound.email = emailTemp;

    emailTemp = null;

    return userFound.save();
  }
}

async function updateVerificar(ver, id) {
  if (dbSelect == "MYSQL") {
    const userFound = await Usuario.findByPk(id);

    if (!userFound) return null;

    userFound.verificado = ver;

    return userFound.save();
  }
}

async function sendSMSToken(token,num_tel, nombre) {
  const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  return client.messages.create({body: 'Hola que tal, si necesitas algo me avisas', from: process.env.PHONE_NUMBER, to:'+584128027107'})
  .then(
    message => {
      console.log(message, "message send")
    }
  ).catch(
    err => {
      console.log(err, "zmessage not send")
    }
  )
}

export default class userMockup {
  users = [];
  static save(user) {
    return saveUser(user);
    //console.log(users);
  }

  static findOne(email) {
    return findOne(email);
  }

  static findOneById(id) {
    return findOneById(id);
  }

  static updateRol(rol, email) {
    return updateRol(rol, email);
  }

  static updateToken(token, id) {
    return updateToken(token, id);
  }

  static sendEmailToken(token, email, nombre) {
    return sendEmailToken(token, email, nombre);
  }

  static updateEmail(id) {
    return updateEmail(id);
  }

  static updateVerificar(ver, id) {
    return updateVerificar(ver, id);
  }
}

let users = new userMockup();
