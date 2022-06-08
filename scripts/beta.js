config = {
    _id: 'beta', members: [
        {_id: 0, host: 'beta01'},
        {_id: 1, host: 'beta02'},
        {_id: 2, host: 'beta03'}
    ]
};
rs.initiate(config);
rs.status();