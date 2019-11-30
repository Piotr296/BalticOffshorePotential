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
cur.execute("""SELECT *
               FROM grid_data;""")
rows = cur.fetchall()

cur.close()
conn.close()

for i in rows:
    print(i)

        <!-- Menu -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="{{ url_for('index') }}">Map</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">

          <li class="nav-item active">
            <a class="nav-link" href="{{ url_for('about') }}">About<span class="sr-only">(current)</span></a>
          </li>

    	    <li class="nav-item active">
            <a class="nav-link" href="{{ url_for('statistics') }}">Statistics<span class="sr-only">(current)</span></a>
          </li>

        </ul>
      </div>
    </nav>
