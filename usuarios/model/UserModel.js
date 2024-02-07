import userMock from'./UsersMockup.js';

//clase que define la estructura del usuario del sistema
export default class user {
    constructor(userName, email, password, id) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.id = id;
    }

    //gets de los atributos de user
    getUserName() { return this.userName; }
    getUserEmail() { return this.email; }
    getUserPassword() { return this.password; }
    getUserId() { return this.id; }

    //sets de los atributos de user
    setUserName(userName) { this.userName = userName;}
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

class userRol{
    constructor(id, nameRol, descriptionRol){
        this.id = id,
        this.nameRol = nameRol,
        this.descriptionRol = descriptionRol
    }
}

