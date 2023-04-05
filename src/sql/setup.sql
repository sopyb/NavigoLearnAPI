create table if not exists users
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

create table if not exists roadmaps
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
    data        text         not null,
    constraint roadmaps_users_id_fk
        foreign key (ownerId) references users (id)
);

create index if not exists roadmaps_description_index
    on roadmaps (description);

create index if not exists roadmaps_name_index
    on roadmaps (name);

create index if not exists roadmaps_owner_index
    on roadmaps (ownerId);

create index if not exists roadmaps_tags_index
    on roadmaps (tags(768));

create table if not exists sessions
(
    id      bigint auto_increment
        primary key,
    userId  bigint       not null,
    token   varchar(255) not null,
    expires datetime     not null,
    constraint sessions_users_id_fk
        foreign key (userId) references users (id)
);

create index if not exists sessions_index
    on sessions (userId, token);

create table if not exists userInfo
(
    id                bigint auto_increment
        primary key,
    userId            bigint       not null,
    profilePictureUrl varchar(255) null,
    bio               varchar(255) null,
    quote             varchar(255) null,
    blogUrl           varchar(255) null,
    websiteUrl        varchar(255) null,
    githubUrl         varchar(255) null,
    constraint userInfo_users_id_fk
        foreign key (userId) references users (id)
);

create index if not exists userInfo_index
    on userInfo (userId);

create index if not exists users_index
    on users (email, name);