select
#   select date today
    current_date as dateToday,

#   get users
    (select
         count(*)
    from users) as users,

#   get users created in the last 7 days
    (select
         count(*)
    from users
    where createdAt >= CURRENT_TIMESTAMP - interval 7 day) as usersChange,

#   get active users in the last 7 days
    (select
        count(distinct userId)
    from sessions) as usersActive,

#   get count of users that created a roadmap in the last 7 days
    (select
         count(distinct ownerId)
    from roadmaps
    where createdAt >= CURRENT_TIMESTAMP - interval 7 day) as creators,

#   roadmaps created
    (select
         count(*)
    from roadmaps) as roadmapCount,

#   roadmaps created in the last 7 days
    (select
         count(*)
    from roadmaps
    where createdAt >= CURRENT_TIMESTAMP - interval 7 day) as roadmapsNew,

#   roadmap views
    (select
        count(*)
    from roadmapViews
    where full = 1) as roadmapsTotalViews,

#   roadmap views authenticated users
    (select
         count(*)
    from roadmapViews
    where userId != -1 and full = 1) as roadmapsTotalViewsAuth,

#   roadmap views anon users
    (select (roadmapsTotalViews - roadmapsTotalViewsAuth))
        as roadmapsTotalViewsAnon,


#  roadmap shows
    (select
         count(*)
     from roadmapViews) as roadmapsTotalShows,

#   roadmap shows authenticated users
    (select
         count(*)
    from roadmapViews where userId != -1) as roadmapsTotalShowsAuth,

#   roadmap shows by anonymous users
    (select (roadmapsTotalshows - roadmapsTotalShowsAuth))
        as roadmapTotalShowsAnon,

#   top roadmap data
    tr1.name as topRoadmap1Name,
    tr1.shows as topRoadmap1Shows,
    tr1.views as topRoadmap1Views,
    tr1.likes as topRoadmap1Likes,
    tr2.name as topRoadmap2Name,
    tr2.shows as topRoadmap2Shows,
    tr2.views as topRoadmap2Views,
    tr2.likes as topRoadmap2Likes,
    tr3.name as topRoadmap3Name,
    tr3.shows as topRoadmap3Shows,
    tr3.views as topRoadmap3Views,
    tr3.likes as topRoadmap3Likes,
    tr4.name as topRoadmap4Name,
    tr4.shows as topRoadmap4Shows,
    tr4.views as topRoadmap4Views,
    tr4.likes as topRoadmap4Likes,
    tr5.name as topRoadmap5Name,
    tr5.shows as topRoadmap5Shows,
    tr5.views as topRoadmap5Views,
    tr5.likes as topRoadmap5Likes,
    tr6.name as topRoadmap6Name,
    tr6.shows as topRoadmap6Shows,
    tr6.views as topRoadmap6Views,
    tr6.likes as topRoadmap6Likes,
    tr7.name as topRoadmap7Name,
    tr7.shows as topRoadmap7Shows,
    tr7.views as topRoadmap7Views,
    tr7.likes as topRoadmap7Likes,
    tr8.name as topRoadmap8Name,
    tr8.shows as topRoadmap8Shows,
    tr8.views as topRoadmap8Views,
    tr8.likes as topRoadmap8Likes,
    tr9.name as topRoadmap9Name,
    tr9.shows as topRoadmap9Shows,
    tr9.views as topRoadmap9Views,
    tr9.likes as topRoadmap9Likes,
    tr10.name as topRoadmap10Likes,
    tr10.shows as topRoadmap10Shows,
    tr10.views as topRoadmap10Views,
    tr10.likes as topRoadmap10Likes
from
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1) tr1
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 1) tr2
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 2) tr3
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 3) tr4
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 4) tr5
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 5) tr6
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 6) tr7
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 7) tr8
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 8) tr9
join
    (select
        name,
        count(distinct rV.id) as shows,
        count(distinct rVF.id) as views,
        count(distinct rL.id) as likes
    from
        roadmaps r
        left join roadmapViews rV on r.id = rV.roadmapId
        left join roadmapViews rVF on r.id = rVF.roadmapId and rVF.full = 1
        left join roadmapLikes rL on r.id = rL.roadmapId
    GROUP BY
        name
    order by views desc
    limit 1 offset 9) tr10


