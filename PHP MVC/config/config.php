<?php

const DATABASE_HOST = 'localhost';
const DATABASE_USER_NAME = 'root';
const DATABASE_USER_PASSWORD = 'root';
define ( 'DATABASE_INSTANCE_NAME', "xehar" );
const HASH_ALGORITHM = "SHA1";
const USE_CACHE_AUTHORIZATION = true;

const XEHAR_SERVER_BASE_PATH = "/var/www/html/xehar-api/";

const ENVIROMENT_TYPE = "TESTING";  // TESTING / PRODUCTION
const SKIP_API_VALIDATION = true;

const ENCRYPT_DECRYPT_POST_DATA_MANDATORY = false;
const SECRET_KEY_FOR_ENCRYPT_DECRYPT = "ad2cf9d6736d1dcf7379ee95deeea443"; // should be 32 digits




// S3 Configuration
const AWS_S3_VERSION = "latest";
const AWS_S3_REGION = "ap-southeast-1";
const AWS_S3_CREDENTIALS_KEY = "";
const AWS_S3_CREDENTIALS_SECRET = "";
const AWS_S3_BUCKET = "";
const AWS_S3_BASEURL = "https://s3.amazonaws.com/";

const AWS_S3_PRESIGNED_URL_UPLOAD_EXPIRY = "60"; // in minutes
const AWS_S3_PRESIGNED_URL_GET_OBJECT_EXPIRY = "60"; // in minutes

