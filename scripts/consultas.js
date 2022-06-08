use finanzas
db.facturas.find({"cliente.region":"CABA", "condPago":"30 Ds FF"}).explain()
db.facturas.find({"cliente.apellido":"Manoni"}).explain()