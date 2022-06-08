sh.addShard("alfa/alfa01,alfa02,alfa03")
sh.enableSharding("finanzas")
sh.shardCollection("finanzas.facturas", {"cliente.region": 1, "cliente.nombre": 1})
sh.status()