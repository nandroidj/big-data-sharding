config = {
    _id: 'alfa', members: [
        {_id: 0, host: 'alfa01'},
        {_id: 1, host: 'alfa02'},
        {_id: 2, host: 'alfa03'}
    ]
};
rs.initiate(config);
rs.status();