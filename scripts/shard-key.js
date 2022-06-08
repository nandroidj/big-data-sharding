use finanzas
db.factuas.createIndex({"cliente.region": 1, "cliente.nombre": 1})
sh.enableSharding("finanzas")
sh.shardCollection("finanzas.facturas", {"cliente.region": 1, "cliente.nombre": 1})