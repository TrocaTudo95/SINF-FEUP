DROP  DATABASE IF EXISTS salesforcefeup;

CREATE DATABASE salesforcefeup CHARACTER SET utf8;

USE salesforcefeup;
SET foreign_key_checks = 1;


CREATE TABLE Role(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(15) NOT NULL,
    description VARCHAR(64)

);

CREATE TABLE User (
    
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    salesmanCode VARCHAR(16) UNIQUE,
    password VARCHAR(128),
    fullname VARCHAR(64) NOT NULL,
    role_id INT DEFAULT 1, -- NO DEFAULT
    FOREIGN KEY(role_id)
        REFERENCES Role(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) DEFAULT CHARSET=latin1;


CREATE TABLE Task (

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    user_id INT,
    completed BOOLEAN DEFAULT FALSE,
    date INT NOT NULL,
    details VARCHAR(256),
    FOREIGN KEY (user_id) REFERENCES User(id)

);


CREATE TABLE Session(

    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    session_token VARCHAR(256) NOT NULL UNIQUE,
    
    INDEX(session_token),

    FOREIGN KEY(user_id)
        REFERENCES User(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

);
