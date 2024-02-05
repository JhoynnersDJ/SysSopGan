import user from './UserModel.js';

class userPort{
    save(user){}
    findOne(email){}
}

//guarda al usuario para persistencia
function saveUser(user) {
    users.users.push(user);
}

//busca en la lista de usuarios un email pasado por parametro
function findOne(email){
    return users.users.find((users) => users.email == email);
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
    
}

let users = new userMockup();
