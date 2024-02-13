import userMock from'./UsersMockup.js';

//clase que define la estructura del usuario del sistema
export class user {
    constructor(name,lastName, email, password, cellphone, empress, departament, rol, id) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.cellphone = cellphone;
        this.empress = empress;
        this.departament = departament;
        this.rol = rol;
        this.id = id;
    }

    //gets de los atributos de user
    getUserName() { return this.name; }
    getUserLastName() { return this.lastName; }
    getUserEmail() { return this.email; }
    getUserPassword() { return this.password; }
    getUserId() { return this.id; }
    getUserCellphone() { return this.cellphone; }
    getUserEmpress() { return this.empress; }
    getUserDepartament() { return this.departament; }
    getUserRol() { return this.rol.getUseRol(); }

    //sets de los atributos de user
    setname(name) { this.name = name;}
    setUserEmail(email) { this.email = email;}
    setUserPassword(password) { this.password = password;}
    setUserId(id) { this.id = id;}


    save(){
        userMock.save(this);
    }

    static findOne(email){
        return userMock.findOne(email);
    }

    static findOneById(id){
        return userMock.findOneById(id);
    }

}

export class userRol{
    constructor(id, nameRol, descriptionRol){
        this.id = id,
        this.nameRol = nameRol,
        this.descriptionRol = descriptionRol
    }
    getUseRol() {return this.nameRol;}
}

