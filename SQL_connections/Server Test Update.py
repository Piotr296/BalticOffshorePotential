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
cur.close()
conn.close()