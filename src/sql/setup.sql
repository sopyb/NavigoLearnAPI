create table if not exists users
(
    id        bigint auto_increment
        primary key,
    avatar    text                                  null,
    name      varchar(255)                          not null,
    email     varchar(255)                          not null,
    role      int       default 0                   null,
    pwdHash   varchar(255)                          null,
    googleId  varchar(255)                          null,
    githubId  varchar(255)                          null,
    createdAt timestamp default current_timestamp() not null
);

create table if not exists followers
(
    id         bigint auto_increment
        primary key,
    followerId bigint                                not null,
    userId     bigint                                not null,
    createdAt  timestamp default current_timestamp() not null,
    constraint followers_userId_followerId_fk
        foreign key (followerId) references users (id)
            on delete cascade,
    constraint followers_userId_userId_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index if not exists followers_followerId_index
    on followers (followerId);

create index if not exists followers_userId_index
    on followers (userId);

create table if not exists roadmaps
(
    id          bigint auto_increment
        primary key,
    name        varchar(255)                                    not null,
    description varchar(255)                                    not null,
    topic       enum ('programming', 'math', 'design', 'other') not null,
    userId      bigint                                          not null,
    isFeatured  tinyint(1) default 0                            not null,
    isPublic    tinyint(1) default 1                            not null,
    isDraft     tinyint(1) default 0                            not null,
    data        longtext                                        not null,
    createdAt   timestamp  default current_timestamp()          not null,
    updatedAt   timestamp  default current_timestamp()          not null on update current_timestamp(),
    constraint roadmaps_userId_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table if not exists roadmapLikes
(
    id        bigint auto_increment
        primary key,
    roadmapId bigint                                not null,
    userId    bigint                                not null,
    value     int                                   null,
    createdAt timestamp default current_timestamp() null,
    constraint roadmapLikes_roadmapId_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint roadmapLikes_userId_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index if not exists roadmapLikes_roadmapId_index
    on roadmapLikes (roadmapId);

create table if not exists roadmapViews
(
    id        bigint auto_increment
        primary key,
    userId    bigint     default -1                  not null,
    roadmapId bigint                                 not null,
    full      tinyint(1) default 0                   not null,
    createdAt timestamp  default current_timestamp() not null,
    constraint roadmapViews_roadmapsId_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint roadmapViews_userId_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index if not exists roadmapViews_roadmapId_createdAt_index
    on roadmapViews (roadmapId, createdAt);

create index if not exists roadmaps_createdAt_index
    on roadmaps (createdAt desc);

create index if not exists roadmaps_description_index
    on roadmaps (description);

create index if not exists roadmaps_name_index
    on roadmaps (name);

create index if not exists roadmaps_owner_index
    on roadmaps (userId);

create table if not exists sessionTable
(
    id      bigint auto_increment
        primary key,
    userId  bigint       not null,
    token   varchar(255) not null,
    expires timestamp    not null,
    constraint sessions_usersId_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index if not exists sessionTable_expires_index
    on sessionTable (expires);

create index if not exists sessionTable_userId_token_index
    on sessionTable (userId, token);

create table if not exists userInfo
(
    id         bigint auto_increment
        primary key,
    userId     bigint       not null,
    bio        varchar(255) null,
    quote      varchar(255) null,
    websiteUrl varchar(255) null,
    githubUrl  varchar(255) null,
    constraint userInfo_usersId_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index if not exists userInfo_userId_index
    on userInfo (userId);

create index if not exists users_email_name_index
    on users (email, name);

create view if not exists sessions as
select `navigo`.`sessionTable`.`id`      AS `id`,
       `navigo`.`sessionTable`.`userId`  AS `userId`,
       `navigo`.`sessionTable`.`token`   AS `token`,
       `navigo`.`sessionTable`.`expires` AS `expires`
from `navigo`.`sessionTable`
where `navigo`.`sessionTable`.`expires` >= current_timestamp();