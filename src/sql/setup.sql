create table users
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

create table followers
(
    id         bigint auto_increment
        primary key,
    followerId bigint                                not null,
    userId     bigint                                not null,
    createdAt  timestamp default current_timestamp() not null,
    constraint followers_users_id_fk
        foreign key (followerId) references users (id)
            on delete cascade,
    constraint followers_users_id_fk2
        foreign key (userId) references users (id)
            on delete cascade
);

create index followers_followerId_index
    on followers (followerId);

create index followers_userId_index
    on followers (userId);

create table roadmaps
(
    id          bigint auto_increment
        primary key,
    name        varchar(255)                          not null,
    description varchar(255)                          not null,
    userId      bigint                                not null,
    isPublic    tinyint(1)                            not null,
    isDraft     tinyint(1)                            null,
    data        longtext                              not null,
    createdAt   timestamp default current_timestamp() not null,
    updatedAt   timestamp default current_timestamp() not null,
    constraint roadmaps_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table issues
(
    id        bigint auto_increment
        primary key,
    roadmapId bigint                                 not null,
    userId    bigint                                 not null,
    open      tinyint(1) default 1                   not null,
    title     varchar(255)                           not null,
    content   text                                   null,
    createdAt timestamp  default current_timestamp() null,
    updatedAt timestamp  default current_timestamp() not null,
    constraint issues_roadmaps_id_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint issues_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table issueComments
(
    id        bigint auto_increment
        primary key,
    issueId   bigint                                not null,
    userId    bigint                                not null,
    content   text                                  not null,
    createdAt timestamp default current_timestamp() not null,
    updatedAt timestamp default current_timestamp() not null,
    constraint issueComments_issues_id_fk
        foreign key (issueId) references issues (id)
            on delete cascade,
    constraint issueComments_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index issueComments_issueId_createdAt_index
    on issueComments (issueId, createdAt);

create index issueComments_userid_index
    on issueComments (userId);

create index issues_roadmapId_createdAt_index
    on issues (roadmapId asc, createdAt desc);

create index issues_title_index
    on issues (title);

create index issues_userId_index
    on issues (userId);

create table roadmapLikes
(
    id        bigint auto_increment
        primary key,
    roadmapId bigint                                not null,
    userId    bigint                                not null,
    value     int                                   null,
    createdAt timestamp default current_timestamp() null,
    constraint roadmaplikes_roadmaps_id_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint roadmaplikes_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index roadmapLikes_roadmapId_index
    on roadmapLikes (roadmapId);

create table roadmapViews
(
    id        bigint auto_increment
        primary key,
    userId    bigint    default -1                  not null,
    roadmapId bigint                                not null,
    full      tinyint(1)                            not null,
    createdAt timestamp default current_timestamp() not null,
    constraint roadmapViews_roadmaps_id_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint roadmapViews_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index roadmapViews_roadmapId_createdAt_index
    on roadmapViews (roadmapId, createdAt);

create index roadmaps_createdAt_index
    on roadmaps (createdAt desc);

create index roadmaps_description_index
    on roadmaps (description);

create index roadmaps_name_index
    on roadmaps (name);

create index roadmaps_owner_index
    on roadmaps (userId);

create table sessionTable
(
    id      bigint auto_increment
        primary key,
    userId  bigint       not null,
    token   varchar(255) not null,
    expires timestamp    not null,
    constraint sessions_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index sessionTable_expires_index
    on sessionTable (expires);

create index sessions_index
    on sessionTable (userId, token);

create table userInfo
(
    id         bigint auto_increment
        primary key,
    userId     bigint       not null,
    bio        varchar(255) null,
    quote      varchar(255) null,
    websiteUrl varchar(255) null,
    githubUrl  varchar(255) null,
    constraint userInfo_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index userInfo_index
    on userInfo (userId);

create index users_index
    on users (email, name);

create view sessions as
select `navigo`.`sessionTable`.`id`      AS `id`,
       `navigo`.`sessionTable`.`userId`  AS `userId`,
       `navigo`.`sessionTable`.`token`   AS `token`,
       `navigo`.`sessionTable`.`expires` AS `expires`
from `navigo`.`sessionTable`
where `navigo`.`sessionTable`.`expires` >= current_timestamp();