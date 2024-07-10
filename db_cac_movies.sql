drop database if exists cac_movies;
create database cac_movies;
use cac_movies;

create table movies(
	id int auto_increment not null,
	title varchar(30) not null,
	image varchar(255) not null,
	background_image varchar(255) not null,
	overview varchar(255) not null,
	release_date datetime default current_timestamp not null,
	primary key(id)
);

create table genres(
	id int auto_increment not null,
	name varchar(30),
	primary key(id)
);

create table movie_genres(
	genre_id int,
	movie_id int,
	foreign key (genre_id) references genres(id),
	foreign key (movie_id) references movies(id)
);


create table users(
	id int auto_increment not null,
	name varchar(30) not null,
	birth_date datetime not null,
	username varchar(30) not null,
	contrasena varchar(255) not null,
	primary key (id)
);



insert into movies(title,image,background_image,overview,release_date) values
(
'Peli de prueba',
'https://res.cloudinary.com/dbowsjk6p/image/upload/v1720063400/channels4_profile_ddj5g3.jpg',
'https://res.cloudinary.com/dbowsjk6p/image/upload/v1720063400/channels4_profile_ddj5g3.jpg',
'Lorem ipsum dolor, sit amet consectetur adipisicing elit.
Cupiditate suscipit reiciendis perspiciatis ab, deleniti 
aliquam incidunt iste et sed libero a, nihil voluptate 
temporibus delectus vitae magni molestiae! Doloremque, hic?',
'2024-01-01'
);

insert into genres(name) values
	('Action'),
	('Animation'),
	('Adventure'),
	('Romance'),
	('Drama'),
	('Comedy'),
	('Thriller'),
	('Science Fiction');

insert into users(name,username,contrasena,birth_date) values (
	'jhon doe',
	'jhon@cac.com',
	'jhon',
	'1996-03-09'
);

insert into movie_genres(movie_id, genre_id) values
('1','1'),
('1','8'),
('1','6');
