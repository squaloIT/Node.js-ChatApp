const expect = require("expect");

const {Users} = require("./users");

describe('Users', ()=>{
    var users;
    beforeEach(()=>{
        users = new Users();

        users.users = [
            {
                id: 1,
                name:'Dzoni',
                room:'kulise'
            },{
                id: 2,
                name:'Andrijana',
                room:'kulise'
            },{
                id: 3,
                name:'Milica',
                room:'NBGD zezanje'
            }
        ];
    });

    it("Trebalo bi da doda novog usera u niz usera.", ()=>{
        var users = new Users();
        var user = {
            id: 123,
            name:'Dzoni',
            room:'kulise'
        };
        var newUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([newUser]);

    });

    it("Trebalo bi da vrati sva imena iz neke odredjene sobe *kulise*  ", ()=>{
        expect(users.getUserNamesList('kulise')).toEqual(['Dzoni','Andrijana']);
    });
    it("Trebalo bi da vrati user-a sa id: 2 ", ()=>{
        expect(users.getUser(2)).toEqual(users.users[1]);
        expect(users.getUser(2).id).toBe(2);
    });
    it("Trebalo bi da izbrise user-a.",()=>{
        var userID = 1;
        var user = users.removeUser(userID);

        expect(user.id).toBe(userID);
        expect(users.users.length).toBe(2);
    });
});

