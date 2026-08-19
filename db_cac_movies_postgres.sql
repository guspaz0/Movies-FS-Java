-- Migration: MySQL -> PostgreSQL for cac_movies
-- Run as a user with CREATEDB privileges:
--   psql -U <user> -f db_cac_movies_postgres.sql

drop database if exists cac_movies;
create database cac_movies;
\c cac_movies

create table movies(
    id serial not null,
    title varchar(30) not null,
    short_overview varchar(30) default null,
    image varchar(255) not null,
    background_image varchar(255) not null,
    overview varchar(255) not null,
    release_date timestamp default current_timestamp not null,
    primary key(id)
);

create table genres(
    id serial not null,
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
    id serial not null,
    name varchar(20) not null,
    lastname varchar(20) not null,
    country_code varchar(3) not null,
    birth_date timestamp not null,
    gender varchar(10) default 'unknown' check (gender in ('male', 'female', 'unknown')),
    username varchar(30) not null,
    contrasena varchar(255) not null,
    primary key (id)
);

create table user_favorites(
    user_id int,
    movie_id int,
    foreign key(user_id) references users(id) on delete cascade,
    foreign key(movie_id) references movies(id) on delete cascade
);

create table ratings(
    id smallint,
    primary key(id)
);

create table movie_ratings(
    movie_id int,
    user_id int,
    stars smallint,
    foreign key (movie_id) references movies(id) on delete cascade,
    foreign key (user_id) references users(id) on delete cascade,
    foreign key (stars) references ratings(id)
);

insert into movies(title, short_overview, image, background_image, overview, release_date) values
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

insert into users(name, lastname, username, contrasena, birth_date, gender, country_code) values (
    'jhon',
    'doe',
    'jhon@cac.com',
    '5a76a55038449aadd49e8ff0045ff64284191c39bffa6f597d4418f24edcc34cff114af57e93272d42041c6f6a749909e8e414285619f448fa605df79606d212',
    '1996-03-09',
    'male',
    'AR'
);

insert into movie_genres(movie_id, genre_id) values
(1,1),
(1,8),
(1,6),
(2,2),
(2,5),
(3,4),
(3,7);

insert into user_favorites values (1,1);

insert into ratings values (1),(2),(3),(4),(5);

insert into movie_ratings values (1,1,4),
(2,1,5),
(3,1,1);
