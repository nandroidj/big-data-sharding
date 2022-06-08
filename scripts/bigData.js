config = {
    _id: 'bigData', members: [
        {_id: 0, host: 'bigData01'},
        {_id: 1, host: 'bigData02'},
        {_id: 2, host: 'bigData03'}
    ]
};
rs.initiate(config);
rs.status();
