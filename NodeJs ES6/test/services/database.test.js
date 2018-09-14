import chai from 'chai'
import sinon from 'sinon'
import mysql from 'mysql'
import app from '../../index' 
import dbConnection from '../../services/mysql'

const expect = chai.expect;
chai.use(require('chai-http'));

describe('Database connection',() => {
    it('Should return a sql connection object with default config',(done) => {
      dbConnection.getConnection(false,(err,connection) => {
        if(err) {
          done(err);
          return ;
        } else {
          expect(connection).to.be.an('object');
          done()
        }
    })
  })
})