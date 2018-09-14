import mysql from 'mysql';
import mysqlUtilities from 'mysql-utilities';
import logger from '../../log'

let request_name = "";
let connectionObject = {};
  
const connectionPool      =    mysql.createPool({
  connectionLimit : 100, //important
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
  debug    :  false
});

connectionPool.on('connection', (connection) => {
    mysqlUtilities.upgrade(connection);
    mysqlUtilities.introspection(connection);
}); 

connectionPool.on('acquire', (connection) => {
    connectionObject[connection.threadId] = request_name;
    logger.info('Connection %d acquired : Total : %d, Free : %d',connection.threadId, connectionPool._allConnections.length,
        connectionPool._freeConnections.length,connectionObject);
    });

connectionPool.on('release', (connection) => {
    connectionObject[connection.threadId] = "";
    logger.info('Connection %d released : Total : %d, Free : %d',connection.threadId, connectionPool._allConnections.length,
        connectionPool._freeConnections.length,connectionObject);
});

export default class mysqlService {

     /**
     * Function to get sql connection object
     * @param transaction {Boolean}
     * @returns {connection}
     */
    getConnection(transaction,callback) {
        if(typeof transaction == 'function'){
            callback = transaction;
            transaction = false;
        }
        request_name = ((new Error().stack).split("at ")[2]).trim();
        connectionPool.getConnection((err,connection) => {
          if (err) {
            if(connection) {
                connection.release();
            }
            return callback(err,connection);
          } else {
              connection.connect();
              if(transaction) {
                  connection.beginTransaction((err) => {
                      if (err) {
                          return callback(err, connection);
                      } else {
                          callback(null,connection);
                      }
                  });
                } else {
                  callback(null,connection);
                }
            }
        });
    }   
}



