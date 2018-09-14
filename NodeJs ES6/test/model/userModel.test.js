import chai from 'chai'
import sinon from 'sinon'
import authController from '../../controller/auth'
import userModel from '../../model/user'
import authService from '../../services/auth'
import dbConnection from '../../services/mysql'

const expect = chai.expect;
chai.use(require('chai-http'));

describe('#userModel' , () => {
    it('Should return a user object from database for email', (done) => {
        dbConnection.getConnection(false,(err,connection) => {
            if(err) 
                done(err);
            else {
                userModel.findByEmail(connection,'vishnuit18@gmail.com')
                .then(res => {
                    connection.release();
                    expect(res).to.have.all.keys('email','name','password','user_id');
                    done()
                })
            }
        })
    })

    it('Should return false for user not found for email', (done) => {
        dbConnection.getConnection(false,(err,connection) => {
            if(err) 
                done(err);
            else {
                userModel.findByEmail(connection,'vishnuit1@gmail.com')
                .then(res => {
                    connection.release();
                    expect(res).to.be.false;
                    done()
                })
            }
        })
    })

    it('Should return a user object from database for user_id' , (done) => {
        dbConnection.getConnection(false,(err,connection) => {
            if(err)
                done(err);
            else {
                userModel.findById(connection,3)
                .then(res => {
                    connection.release();
                    expect(res).to.have.all.keys('email','name','user_id');
                    done()
                })
            }
        })
    })
})