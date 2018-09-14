import createError from 'http-errors'
import express from 'express'
import path from 'path' 
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import utility from './services/utility'
import fs from 'fs'
import passport from 'passport'
import expressValidator from 'express-validator'
import middlewareFile from './middleware/middlewares'
import errors from './middleware/errors'

export default function createApp() {

const app = express();

//Middlewares
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//logger
app.use(logger('dev'));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//validator
app.use(expressValidator());

//passport initialization
app.use(passport.initialize());
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

/**
 * loads all the middlewares from middleware.js array to the server
 */
function loadPreRequestMiddlewares() {
    middlewareFile.middlewares.forEach((middleware) => {
        app.use(middleware.run);
    });
}

/**
 * loads all the HTTP route files to the server
 */
function loadRoutes() {
    let routesDirectory = path.join(__dirname, 'routes');
    fs.readdirSync(routesDirectory).forEach((moduleName) => {
        loadDirectoryModules(path.join(routesDirectory , moduleName)).forEach((route) => {
            app.use('/', require(route));
        });
    });
    // 404 handler
    var catchAll = function(req, res, next) {
        res.$end(new errors.ResourceNotFoundError());
    };
    //handles resource not found type for all method types
    app.get('*', catchAll);
    app.put('*', catchAll);
    app.post('*', catchAll);
    app.delete('*', catchAll);

    // error handler middleware
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).end(err.message || 'Uh-oh. Something went wrong.');
    });
};

/**
 * loads all the routes in a directory into an array
 * @param dir {String} path to directory to read
 * @returns {Array}
 */
function loadDirectoryModules(dir) {
    var modules = [];
    fs.readdirSync(dir).forEach((module) => {
        modules.push(path.join(dir , module));
    });
    return modules;
}

loadPreRequestMiddlewares();
loadRoutes();

var catchAll = function(req, res, next) {
    res.$end(new errors.ResourceNotFoundError());
};
//handles resource not found type for all method types
app.get('*', catchAll);
app.put('*', catchAll);
app.post('*', catchAll);
app.delete('*', catchAll);

// error handler middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).end(err.message || 'Uh-oh. Something went wrong.');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(() => console.log("server is up at port 3000"));

return app;

}
