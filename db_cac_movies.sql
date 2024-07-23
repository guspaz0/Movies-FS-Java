drop database if exists cac_movies;
create database cac_movies;
use cac_movies;

create table movies(
	id int auto_increment not null,
	title varchar(30) not null,
	short_overview varchar(30) default null,
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

create table user_favorites(
	user_id int,
	movie_id int,
	foreign key(user_id) references users(id),
	foreign key(movie_id) references movies(id)
);

create table ratings(
	id tinyint,
	primary key(id)
);

create table movie_ratings(
	movie_id int,
	user_id int,
	stars tinyint,
	foreign key (movie_id) references movies(id),
	foreign key (user_id) references users(id),
	foreign key (stars) references ratings(id)
);




insert into movies(title,short_overview,image,background_image,overview,release_date) values
(
'Peli de prueba',
'lorem ipsum dolor sit amet',
'https://res.cloudinary.com/dbowsjk6p/image/upload/v1720063400/channels4_profile_ddj5g3.jpg',
'https://res.cloudinary.com/dbowsjk6p/image/upload/v1720063400/channels4_profile_ddj5g3.jpg',
'Lorem ipsum dolor, sit amet consectetur adipisicing elit.
Cupiditate suscipit reiciendis perspiciatis ab, deleniti
aliquam incidunt iste et sed libero a, nihil voluptate
temporibus delectus vitae magni molestiae! Doloremque, hic?',
'2024-01-01'
),
(
'Peli de prueba 2',
'lorem ipsum dolor sit amet',
'https://random.imagecdn.app/248/372',
'https://random.imagecdn.app/600/300',
'Lorem ipsum dolor, sit amet consectetur adipisicing elit.
Cupiditate suscipit reiciendis perspiciatis ab, deleniti
aliquam incidunt iste et sed libero a, nihil voluptate
temporibus delectus vitae magni molestiae! Doloremque, hic?',
'2004-01-01'
),
(
'Peli de prueba 3',
'lorem ipsum dolor sit amet',
'https://random.imagecdn.app/250/372',
'https://random.imagecdn.app/602/300',
'Lorem ipsum dolor, sit amet consectetur adipisicing elit.
Cupiditate suscipit reiciendis perspiciatis ab, deleniti
aliquam incidunt iste et sed libero a, nihil voluptate
temporibus delectus vitae magni molestiae! Doloremque, hic?',
'1994-01-01'
)

;

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
('1','6'),
('2','2'),
('2','5'),
('3','4'),
('3','7');

insert into user_favorites values ('1','1');

insert into ratings values ('1'),('2'),('3'),('4'),('5');

insert into movie_ratings values ('1','1','4'),
('2','1','5'),
('3','1','1');