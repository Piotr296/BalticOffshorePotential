import random, json
import psycopg2
from flask import Flask, render_template, request, redirect, Response, jsonify
import time

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/statistics")
def statistics():
    return render_template("statistics.html")

@app.route("/lcoe")
def lcoe():
    return render_template("lcoe.html")

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

    # Piotr & Olga have data base without changed database - minor problem
    t0 = time.time()
    cur = conn.cursor()
    cur.execute("""UPDATE grid_data
                   SET fuzzyvalue = (bathmean * {}) + (shipmean * {}) + (windmean * {})
                   WHERE (pareasmean = 0 AND bufformean = 0);""".format(wB, wS, wW))
    t1 = time.time()
    conn.commit()

    cur.execute("""SELECT id, fuzzyvalue, ST_AsGeoJSON(geom)
                   FROM grid_data
                   ;""")
    t2 = time.time()
    rows = cur.fetchall()

    output = """{
      "type": "FeatureCollection",
      "features": ["""

    for row in rows:

          output = output + '''{
          "type": "Feature",
          "properties": {
              "id": %s ,
              "fuzzyvalue": %s },
          "geometry": %s },'''%(str(row[0]), str(row[1]), row[2])


    output = output[:-1] + """]
      }"""
    t3 = time.time()
    cur.close()
    conn.close()

    #print(output)
    #create an empty geojson file and overwrite it with the output
    f = open(r"D:\Moje_dokumenty\Study_in_Denmark\Study_Programme\Study Project\Application\OffshoreLocalizer\Web Application\static\geojson\output.geojson", "w+")
    f.write(output)
    f.close()
    t4 = time.time()

    print("Update:",t1-t0)
    print("Select:", t2-t1)
    print("Looping:", t3-t2)
    print("Saving:", t4-t3)
    return jsonify(output)
#    """Response(response=output, status=200, mimetype="application/json")"""


TEMPLATES_AUTO_RELOAD = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

if __name__ == "__main__":
    app.run(debug=True)
