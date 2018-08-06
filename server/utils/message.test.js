var expect = require('expect');
var {generateMessage} = require("./message");

describe("generateMessage", ()=>{
    it("Trebalo bi da generise normalnu poruku", ()=>{
        var from = 'Jen';
        var text = 'Zezanje';

        var message = generateMessage(from,text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, text });        
    });
});