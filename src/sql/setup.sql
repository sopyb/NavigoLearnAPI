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

create table if not exists followers
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

create index if not exists followers_followerId_index
    on followers (followerId);

create index if not exists followers_userId_index
    on followers (userId);

create table if not exists roadmaps
(
    id          bigint auto_increment
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null,
    ownerId     bigint       not null,
    createdAt   timestamp    not null,
    updatedAt   timestamp    not null,
    isPublic    tinyint(1)   not null,
    data        longtext     not null,
    constraint roadmaps_users_id_fk
        foreign key (ownerId) references users (id)
            on delete cascade
);

create table if not exists issues
(
    id        bigint auto_increment
        primary key,
    roadmapId bigint                                 not null,
    userId    bigint                                 not null,
    open      tinyint(1) default 1                   not null,
    title     varchar(255)                           not null,
    content   text                                   null,
    createdAt timestamp  default current_timestamp() null,
    updatedAt timestamp                              null,
    constraint issues_roadmaps_id_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint issues_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table if not exists issueComments
(
    id        bigint auto_increment
        primary key,
    issueId   bigint                                not null,
    userId    bigint                                not null,
    content   text                                  not null,
    createdAt timestamp default current_timestamp() not null,
    updatedAt timestamp                             null,
    constraint issueComments_issues_id_fk
        foreign key (issueId) references issues (id)
            on delete cascade,
    constraint issueComments_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index if not exists issueComments_issueId_createdAt_index
    on issueComments (issueId, createdAt);

create index if not exists issueComments_userid_index
    on issueComments (userId);

create index if not exists issues_roadmapId_createdAt_index
    on issues (roadmapId asc, createdAt desc);

create index if not exists issues_title_index
    on issues (title);

create index if not exists issues_userId_index
    on issues (userId);

create table if not exists roadmapLikes
(
    id        bigint auto_increment
        primary key,
    roadmapId bigint                                not null,
    userId    bigint                                not null,
    createdAt timestamp default current_timestamp() null,
    constraint roadmaplikes_roadmaps_id_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint roadmaplikes_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create index if not exists roadmapLikes_roadmapId_index
    on roadmapLikes (roadmapId);

create table if not exists roadmapTags
(
    id        bigint auto_increment
        primary key,
    roadmapId bigint       not null,
    tagName   varchar(255) not null,
    constraint roadmapTags_roadmaps_id_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade
);

create index if not exists roadmapTags_roadmapId_index
    on roadmapTags (roadmapId);

create index if not exists roadmapTags_tagName_index
    on roadmapTags (tagName);

create table if not exists roadmapViews
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

create index if not exists roadmapViews_roadmapId_createdAt_index
    on roadmapViews (roadmapId, createdAt);

create index if not exists roadmaps_createdAt_index
    on roadmaps (createdAt desc);

create index if not exists roadmaps_description_index
    on roadmaps (description);

create index if not exists roadmaps_name_index
    on roadmaps (name);

create index if not exists roadmaps_owner_index
    on roadmaps (ownerId);

create table if not exists sessionTable
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

create index if not exists sessionTable_expires_index
    on sessionTable (expires);

create index if not exists sessions_index
    on sessionTable (userId, token);

create table if not exists tabsInfo
(
    id        bigint auto_increment
        primary key,
    roadmapId bigint       not null,
    userId    bigint       not null,
    content   text         null,
    stringId  varchar(255) not null,
    constraint tabInfo_roadmaps_id_fk
        foreign key (roadmapId) references roadmaps (id)
            on delete cascade,
    constraint tabInfo_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

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
            on delete cascade
);

create index if not exists userInfo_index
    on userInfo (userId);

create index if not exists users_index
    on users (email, name);