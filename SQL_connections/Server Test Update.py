# -*- coding: utf-8 -*-
"""
Created on Mon Nov 18 16:17:59 2019

@author: Petronium
"""

import psycopg2

conn = psycopg2.connect("dbname='Baltic_project' \
                         host='localhost' \
                         user='postgres' \
                         password='1Michalak123'")

cur = conn.cursor()
cur.execute("""UPDATE grid_data
               SET fuzzyvalue = (bathmean * {}) + (shipmean * {}) + (windmean * {});""".format(0.3, 0.3, 0.4))
conn.commit()

cur.execute("""SELECT id, fuzzyvalue, ST_AsGeoJSON(geom)
               FROM grid_data
               LIMIT 5;""")
rows = cur.fetchall()

output = """{
  "type": "FeatureCollection",
  "features": ["""

for row in rows:

    output = output + '''{
      "type": "Feature",
      "properties": {
          "id": '''+str(row[0])+''',
          "fuzzyvalue": '''+str(row[1])+'''},
      "geometry": '''+row[2]+'''
    },'''


output = output[:-1] + """]
  }"""

cur.close()
conn.close()