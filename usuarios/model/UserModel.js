const userMock = require('../model/UsersMockup');

//clase que define la estructura del usuario del sistema
class user {
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

}

module.exports = user