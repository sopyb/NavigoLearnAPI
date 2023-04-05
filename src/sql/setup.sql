create or replace table roadmaps
(
    id          bigint auto_increment
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null,
    tags        text         not null,
    ownerId     bigint       not null,
    created     datetime     not null,
    updated     datetime     not null,
    deleted     datetime     null,
    isDeleted   tinyint(1)   not null,
    isPublic    tinyint(1)   not null,
    data        text         not null
);

create or replace index roadmaps_description_index
    on roadmaps (description);

create or replace index roadmaps_name_index
    on roadmaps (name);

create or replace index roadmaps_owner_index
    on roadmaps (ownerId);

create or replace index roadmaps_tags_index
    on roadmaps (tags(768));

create or replace table sessions
(
    id      bigint auto_increment
        primary key,
    userId  bigint       not null,
    token   varchar(255) not null,
    expires datetime     not null
);

create or replace index sessions_index
    on sessions (userId, token);

create or replace table userInfo
(
    id                bigint auto_increment
        primary key,
    userId            bigint       not null,
    profilePictureUrl varchar(255) null,
    bio               varchar(255) null,
    quote             varchar(255) null,
    blogUrl           varchar(255) null,
    websiteUrl        varchar(255) null,
    githubUrl         varchar(255) null
);

create or replace index userInfo_index
    on userInfo (userId);

create or replace table users
(
    id       bigint auto_increment
        primary key,
    name     varchar(255)            not null,
    email    varchar(255)            not null,
    role     int          default 0  not null,
    pwdHash  varchar(255) default '' not null,
    googleId varchar(255)            null,
    githubId varchar(255)            null
);

alter table roadmaps
    add constraint roadmaps_users_id_fk
        foreign key (ownerId) references users (id);

alter table sessions
    add constraint sessions_users_id_fk
        foreign key (userId) references users (id);

alter table userInfo
    add constraint userInfo_users_id_fk
        foreign key (userId) references users (id);

create or replace index users_index
    on users (email, name);