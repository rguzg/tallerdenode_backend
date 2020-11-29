-- Database definitions for Taller de Node S.A. de C.V. Backend

CREATE DATABASE node;

USE node;

CREATE TABLE empleados(nombre VARCHAR(50) NOT NULL, apellidos VARCHAR(100) NOT NULL,
telefono VARCHAR(10), correo VARCHAR(100), direccion VARCHAR(100));

CREATE TABLE usuarios(username VARCHAR(20) NOT NULL, password CHAR(60) NOT NULL,
nombre VARCHAR(50) NOT NULL, apellidos VARCHAR(100) NOT NULL);