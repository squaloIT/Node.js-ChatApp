const _ = require("lodash");
// class Person {
//     constructor(id, name, room){
//         // this.id=id;
//         // this.name=name;
//         // this.room=room;
//     }
// }

// var ja = new Person(1,"Nikola", "Soba 1");
// var Andrijana = new Person(2,"Andrijana", "Soba 1");

class Users {
   
    constructor(){
        this.users=[];
    }
    addUser (id,name,room){
        var user = { id, name, room };
        this.users.push(user);
        return user;
    }
    removeUser(id){
        var foundUser = this.getUser(id);
        
        if(foundUser){
            // this.users = _.remove( user => { user.id !== id });
            this.users = this.users.filter( user => user.id !== id );
        }
        return foundUser;
    } 
    getUser(id){
        return this.users.find( user => user.id === id );
    }
    getUserNamesList(room){
        var usersFromTheRoom = this.users.filter( user => user.room===room );
        return usersFromTheRoom.map( user => user.name );
        // return this.users.filter( user => user.room===room );
    }
}

module.exports = {Users};