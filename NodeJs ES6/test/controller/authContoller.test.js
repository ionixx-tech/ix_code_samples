import chai from 'chai'
import sinon from 'sinon'
import authController from '../../controller/auth'
import userModel from '../../model/user'
import authService from '../../services/auth'

const expect = chai.expect;
chai.use(require('chai-http'));

describe('#authController' , () => {
    it('Should return user object for successfull login' ,() => {
        let findByEmailStub = sinon.stub(userModel,'findByEmail');
        findByEmailStub.resolves({user_id:1,name:'vishnu',email:'vishnuit18@gmail.com',password:'abcd'});
        return authController.login('vishnuit18@gmail.com','abcd')
        .then(function(res){
            expect(res).to.have.all.keys('email','name','password','user_id');
            findByEmailStub.restore()
        })
    })

    it('Should return invalid credentials for wrong password' , () => {
        let findByEmailStub = sinon.stub(userModel,'findByEmail');
        findByEmailStub.resolves({user_id:1,name:'vishnu',email:'vishnuit18@gmail.com',password:'abcd'});
        return authController.login('vishnuit18@gmail.com','abd')
        .catch(function(res){
            expect(res).to.have.all.keys('code','status','message');
            expect(res.code).to.equal(1003);
            expect(res.message).to.equal('Invalid credentials');
            findByEmailStub.restore()
        })
    })

    it('Should return invalid credentials for user not found' , () => {
        let findByEmailStub = sinon.stub(userModel,'findByEmail');
        findByEmailStub.resolves({});
        return authController.login('vishnuit18@gmail.com','abd')
        .catch(function(res){
            expect(res).to.have.all.keys('code','status','message');
            expect(res.code).to.equal(1003);
            expect(res.message).to.equal('Invalid credentials');
            findByEmailStub.restore()
        })
    })

    it('Should return access token',() => {
        let generateTokenStub = sinon.stub(authService,'generateAccessToken');
        generateTokenStub.resolves('K64Ju6cWuhsTgTMREsc0IUb6JgAs0QoR001z1I4PJE1')
        return authController.setUserTokenController({user_id:1,name:'vishnu',email:'vishnuit1@gmail.com',password:'abcd'})
        .then(function(res){
            expect(res).to.be.string;
            expect(res).to.have.lengthOf(43);
            generateTokenStub.restore();
        })
    })
})