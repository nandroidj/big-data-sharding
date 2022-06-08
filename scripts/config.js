config = {
    _id: 'config', members: [
        {_id: 0, host: 'config01:27019'},
        {_id: 1, host: 'config02:27019'},
        {_id: 2, host: 'config03:27019'}
    ]
};
rs.initiate(config);
rs.status();