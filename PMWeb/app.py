import random, json
import psycopg2
from flask import Flask, render_template, request, redirect, Response, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/receiver', methods = ['POST'])
def worker():
    print("Sending POST request")
    data = request.get_json(force=True)
    wB = data[0]['wB']
    wS = data[1]['wS']
    wW = data[2]['wW']
    conn = psycopg2.connect("dbname='Baltic_project' \
                             host='localhost' \
                             user='postgres' \
                             password='1Michalak123'")

    cur = conn.cursor()
    cur.execute("""UPDATE grid_data
                   SET fuzzyvalue = (bathmean * {}) + (shipmean * {}) + (windmean * {});""".format(wB, wS, wW))

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

    # print(output)
    return jsonify(output)

if __name__ == "__main__":
    app.run(debug=True)
