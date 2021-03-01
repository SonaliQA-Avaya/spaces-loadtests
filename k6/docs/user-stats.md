# Live system usage statistics 


## Unique users per day 

```js
[
  {
    $match: { lastAccess: { $gte: ISODate('2020-09-01T00:00:00.641Z') } }
  },
  {
    $count: "meetings_count"
  }
]
```

```js
[
  {
    $match: {
      lastAccess: {
        $gte: ISODate("2020-08-28T00:00:00.641Z"),
      },
    },
  },
  {
    $project: {
      userId: "$userId",
      date: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$lastAccess",
          timezone: "America/New_York",
        },
      },
    },
  },
  {
    $group: {
      _id: {
        userid: "$userId",
        date: "$date",
      },
    },
  },
  {
    $group: {
      _id: "$_id.date",
      count: {
        $sum: 1,
      },
    },
  },
];

```

- _id:"2020-08-28" (Fri) count:18771, joins: 48,013, rate: 2.55
- _id:"2020-08-31" (Mon) count:18359, joins: 51,081, rate: 2.78


Anonymous users are counted, but data may not reflect actual usage. If someone uses anonymous for their meetings repeatedly during the day, then each join will be counted as a separate user.


## Messages per day


```js
[{$match: {
  created: {
    $gte: ISODate('2020-08-12T01:00:00.641Z')
  }
}}, {$project: {
  date: {
    $dateToString: {
      format: '%Y-%m-%d',
      date: '$created', 
      timezone: 'America/New_York'
    }
  }
}}, {$group: {
  _id: '$date',
  total: {
    $sum: 1
  }
}}, {$sort: {
  _id: 1
}}]

```

- _id:"2020-08-11" total:59949
- _id:"2020-08-12" total:54619 
- _id:"2020-08-13" total:43786