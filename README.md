# big-data-sharding


Implementar en Sharding en BD MongoDB

1.  Basados en la colección de facturas en la base de datos finanzas. Levantar todas las instancias necesarias para tener un cluster distribuido con un
único Shard.

- **Shard Alfa**

```
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("efd5628c-f982-4222-95c9-f3b4f699a575") }
MongoDB server version: 4.2.8
{
	"_id" : "alfa",
	"members" : [
		{
			"_id" : 0,
			"host" : "alfa01"
		},
		{
			"_id" : 1,
			"host" : "alfa02"
		},
		{
			"_id" : 2,
			"host" : "alfa03"
		}
	]
}
```

- **Shard Beta**

```
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("41a90f11-8eef-4b9c-9c96-7d91ed827992") }
MongoDB server version: 4.2.8
{
	"_id" : "beta",
	"members" : [
		{
			"_id" : 0,
			"host" : "beta01"
		},
		{
			"_id" : 1,
			"host" : "beta02"
		},
		{
			"_id" : 2,
			"host" : "beta03"
		}
	]
}
```

- **Shard Charlie**

```
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("39ec35f8-4096-4e39-9483-a9e422112e02") }
MongoDB server version: 4.2.8
{
	"_id" : "bigData",
	"members" : [
		{
			"_id" : 0,
			"host" : "bigData01"
		},
		{
			"_id" : 1,
			"host" : "bigData02"
		},
		{
			"_id" : 2,
			"host" : "bigData03"
		}
	]
}
```

- **Configuration Server**

```
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27019/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("f60c7aa5-4f40-4a00-860e-de179b787a74") }
MongoDB server version: 4.2.8
{
	"_id" : "config",
	"members" : [
		{
			"_id" : 0,
			"host" : "config01:27019"
		},
		{
			"_id" : 1,
			"host" : "config02:27019"
		},
		{
			"_id" : 2,
			"host" : "config03:27019"
		}
	]
}
```


2.  Pensar las consultas que podrían realizarse a esta colección y definir una clave
acorde para implementar Sharding.

Se puede consultar la facturación de una región y/o cliente mediante el par `{"cliente.region": 12, "cliente.nombre": 0}`.


3.  Implementar Sharding en la db finanzas sobre la colección facturas. Consultar
la metadata del cluster.

```
--- Sharding Status --- 
  sharding version: {
  	"_id" : 1,
  	"minCompatibleVersion" : 5,
  	"currentVersion" : 6,
  	"clusterId" : ObjectId("5f62af7132dbe2cbaadd0c0a")
  }
  shards:
        {  "_id" : "alfa",  "host" : "alfa/alfa01:27017,alfa02:27017,alfa03:27017",  "state" : 1 }
  active mongoses:
        "4.2.8" : 1
  autosplit:
        Currently enabled: yes
  balancer:
        Currently enabled:  yes
        Currently running:  no
        Failed balancer rounds in last 5 attempts:  0
        Migration Results for the last 24 hours: 
                No recent migrations
  databases:
        {  "_id" : "config",  "primary" : "config",  "partitioned" : true }
        {  "_id" : "finanzas",  "primary" : "alfa",  "partitioned" : true,  "version" : {  "uuid" : UUID("2c49d32a-725d-472b-bbb9-b00e1ef2bbe5"),  "lastMod" : 1 } }
                finanzas.facturas
                        shard key: { "cliente.region" : 1, "cliente.nombre" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                alfa	1
                        {
                        	"cliente.region" : { "$minKey" : 1 },
                        	"cliente.nombre" : { "$minKey" : 1 }
                        } -->> {
                        	"cliente.region" : { "$maxKey" : 1 },
                        	"cliente.nombre" : { "$maxKey" : 1 }
                        } on : alfa Timestamp(1, 0) 
```


4.  Agregar 2 nuevos Shards al cluster.

- **Shard Beta**

```
{
	"shardAdded" : "beta",
	"ok" : 1,
	"operationTime" : Timestamp(1600303265, 6),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1600303265, 7),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
```

- **Shard Charlie**

```
{
	"shardAdded" : "bigData",
	"ok" : 1,
	"operationTime" : Timestamp(1600303585, 8),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1600303585, 9),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
```


5.  Ejecutar el script facts.js 5 veces para crear volumen de datos.

```
MongoDB shell version v5.0.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("e46c6e93-f039-4dba-9a66-f3cbb2841ca0") }
MongoDB server version: 4.2.8
switched to db finanzas
true
true
true
true
true
154350
bye
```

6.  Consultar nuevamente la metadata del cluster: Ver los shards disponibles, los
chunks creados y en que shard están estos.

```
--- Sharding Status --- 
  sharding version: {
  	"_id" : 1,
  	"minCompatibleVersion" : 5,
  	"currentVersion" : 6,
  	"clusterId" : ObjectId("5f62af7132dbe2cbaadd0c0a")
  }
  shards:
        {  "_id" : "alfa",  "host" : "alfa/alfa01:27017,alfa02:27017,alfa03:27017",  "state" : 1 }
        {  "_id" : "beta",  "host" : "beta/beta01:27017,beta02:27017,beta03:27017",  "state" : 1 }
        {  "_id" : "bigData",  "host" : "bigData/bigData01:27017,bigData02:27017,bigData03:27017",  "state" : 1 }
  active mongoses:
        "4.2.8" : 1
  autosplit:
        Currently enabled: yes
  balancer:
        Currently enabled:  yes
        Currently running:  no
        Failed balancer rounds in last 5 attempts:  0
        Migration Results for the last 24 hours: 
                682 : Success
  databases:
        {  "_id" : "config",  "primary" : "config",  "partitioned" : true }
                config.system.sessions
                        shard key: { "_id" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                alfa	342
                                beta	341
                                bigData	341
                        too many chunks to print, use verbose if you want to force print
        {  "_id" : "finanzas",  "primary" : "alfa",  "partitioned" : true,  "version" : {  "uuid" : UUID("2c49d32a-725d-472b-bbb9-b00e1ef2bbe5"),  "lastMod" : 1 } }
                finanzas.facturas
                        shard key: { "cliente.region" : 1, "cliente.nombre" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                alfa	1
                        {
                        	"cliente.region" : { "$minKey" : 1 },
                        	"cliente.nombre" : { "$minKey" : 1 }
                        } -->> {
                        	"cliente.region" : { "$maxKey" : 1 },
                        	"cliente.nombre" : { "$maxKey" : 1 }
                        } on : alfa Timestamp(1, 0) 
```


7.  Definir dos consultas que obtengan cierta información de la BD e informar la salida del explain. Una debe poder obtener la información de un único shard y la otra debe tener que consultarlos a todos.


- **Primera Consulta**: `db.facturas.find({"cliente.region":"CABA", "condPago":"30 Ds FF"}).explain()`

```
mongos> db.facturas.find({"cliente.region":"CABA", "condPago":"30 Ds FF"}).explain()
{
	"queryPlanner" : {
		"mongosPlannerVersion" : 1,
		"winningPlan" : {
			"stage" : "SINGLE_SHARD",
			"shards" : [
				{
					"shardName" : "alfa",
					"connectionString" : "alfa/alfa01:27017,alfa02:27017,alfa03:27017",
					"serverInfo" : {
						"host" : "alfa01",
						"port" : 27017,
						"version" : "4.2.8",
						"gitVersion" : "43d25964249164d76d5e04dd6cf38f6111e21f5f"
					},
					"plannerVersion" : 1,
					"namespace" : "finanzas.facturas",
					"indexFilterSet" : false,
					"parsedQuery" : {
						"$and" : [
							{
								"cliente.region" : {
									"$eq" : "CABA"
								}
							},
							{
								"condPago" : {
									"$eq" : "30 Ds FF"
								}
							}
						]
					},
					"queryHash" : "430E8472",
					"planCacheKey" : "23F6FDFC",
					"winningPlan" : {
						"stage" : "SHARDING_FILTER",
						"inputStage" : {
							"stage" : "FETCH",
							"filter" : {
								"condPago" : {
									"$eq" : "30 Ds FF"
								}
							},
							"inputStage" : {
								"stage" : "IXSCAN",
								"keyPattern" : {
									"cliente.region" : 1,
									"cliente.nombre" : 1
								},
								"indexName" : "cliente.region_1_cliente.nombre_1",
								"isMultiKey" : false,
								"multiKeyPaths" : {
									"cliente.region" : [ ],
									"cliente.nombre" : [ ]
								},
								"isUnique" : false,
								"isSparse" : false,
								"isPartial" : false,
								"indexVersion" : 2,
								"direction" : "forward",
								"indexBounds" : {
									"cliente.region" : [
										"[\"CABA\", \"CABA\"]"
									],
									"cliente.nombre" : [
										"[MinKey, MaxKey]"
									]
								}
							}
						}
					},
					"rejectedPlans" : [ ]
				}
			]
		}
	},
	"serverInfo" : {
		"host" : "router",
		"port" : 27017,
		"version" : "4.2.8",
		"gitVersion" : "43d25964249164d76d5e04dd6cf38f6111e21f5f"
	},
	"ok" : 1,
	"operationTime" : Timestamp(1600306381, 1),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1600306381, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
```

- **Segunda Consulta**: `db.facturas.find({"cliente.apellido":"Manoni"}).explain()`

```
mongos> db.facturas.find({"cliente.apellido":"Manoni"}).explain()
{
	"queryPlanner" : {
		"mongosPlannerVersion" : 1,
		"winningPlan" : {
			"stage" : "SINGLE_SHARD",
			"shards" : [
				{
					"shardName" : "alfa",
					"connectionString" : "alfa/alfa01:27017,alfa02:27017,alfa03:27017",
					"serverInfo" : {
						"host" : "alfa01",
						"port" : 27017,
						"version" : "4.2.8",
						"gitVersion" : "43d25964249164d76d5e04dd6cf38f6111e21f5f"
					},
					"plannerVersion" : 1,
					"namespace" : "finanzas.facturas",
					"indexFilterSet" : false,
					"parsedQuery" : {
						"cliente.apellido" : {
							"$eq" : "Manoni"
						}
					},
					"queryHash" : "A0AA6BD6",
					"planCacheKey" : "A0AA6BD6",
					"winningPlan" : {
						"stage" : "SHARDING_FILTER",
						"inputStage" : {
							"stage" : "COLLSCAN",
							"filter" : {
								"cliente.apellido" : {
									"$eq" : "Manoni"
								}
							},
							"direction" : "forward"
						}
					},
					"rejectedPlans" : [ ]
				}
			]
		}
	},
	"serverInfo" : {
		"host" : "router",
		"port" : 27017,
		"version" : "4.2.8",
		"gitVersion" : "43d25964249164d76d5e04dd6cf38f6111e21f5f"
	},
	"ok" : 1,
	"operationTime" : Timestamp(1600306441, 1),
	"$clusterTime" : {
		"clusterTime" : Timestamp(1600306449, 3),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	}
}
```


## Anexo

### Setup

```
docker-compose up -d

sleep 5

" Shard Alfa
docker-compose exec alfa01 sh -c "mongo < /scripts/alfa.js"
docker-compose exec alfa02 sh -c "mongo < /scripts/slaveOk.js"
docker-compose exec alfa03 sh -c "mongo < /scripts/slaveOk.js"

" Shard Beta
docker-compose exec beta01 sh -c "mongo < /scripts/beta.js"
docker-compose exec beta02 sh -c "mongo < /scripts/slaveOk.js"
docker-compose exec beta03 sh -c "mongo < /scripts/slaveOk.js"

" Shard Charlie
docker-compose exec bigData01 sh -c "mongo < /scripts/bigData.js"
docker-compose exec bigData02 sh -c "mongo < /scripts/slaveOk.js"
docker-compose exec bigData03 sh -c "mongo < /scripts/slaveOk.js"

" Shard Config
docker-compose exec config01 sh -c "mongo --port 27019 < /scripts/config.js"
docker-compose exec config02 sh -c "mongo --port 27019 < /scripts/slaveOkconfig.js"
docker-compose exec config03 sh -c "mongo --port 27019 < /scripts/slaveOkconfig.js"

" Sleep one minute for internal connections
sleep 60

docker-compose exec alfa01 sh -c "mongo < /scripts/punto3.js"

" Clave compuesta
docker-compose exec alfa01 sh -c "mongo < /scripts/addIndex.js"

" Router Config
docker-compose exec router sh -c "mongo < /scripts/init-router.js"

" Alfa Shard Data  
docker-compose exec alfa01 sh -c "mongo < /scripts/finanzas.js"

" Shards new data
docker-compose exec router sh -c "mongo < /scripts/moreShards.js"

" Turn down containers
docker-compose down
```

### Queries

```
docker-compose exec router sh -c "mongo < /scripts/consultas.js"
```
