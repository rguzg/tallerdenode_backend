-- Definición de la base de datos para el backend de Taller de Node S.A. de C.V.

CREATE DATABASE node;

USE node;

CREATE TABLE empleados(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
nombre VARCHAR(50) NOT NULL, apellidos VARCHAR(100) NOT NULL,
telefono VARCHAR(10), correo VARCHAR(100), direccion VARCHAR(100));

CREATE TABLE usuarios(id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(20) UNIQUE NOT NULL, password CHAR(60) NOT NULL,
nombre VARCHAR(50), apellidos VARCHAR(100));