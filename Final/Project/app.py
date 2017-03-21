"""
Remark: Some code has been copy pasted from tutorials.
https://github.com/dfm/flask-d3-hello-world/blob/master/app.py
"""
"""
"""
import json
import os
import flask
import numpy as np
import pandas as pd
import pickle

PATH_TO_DATA = "../../Data/verkeersOngelukkenNederland.p"
app = flask.Flask(__name__)


#######################################
# this is for the main map
#######################################
@app.route("/")
def index():
    """
    When you request the root path, you'll get the index.html template.
    """
    return flask.render_template("home.html")

@app.route("/data")
@app.route("/data/<int:year>")
def data(year= 2015 ):
    result = accidentData[ (accidentData["JAAR_VKL"] == year)]
    output = result["PVE_NAAM"].value_counts().to_json(orient="columns")

    #here we add the population data
    outputDict = {}
    for key, value in json.loads(output).items():
        weather = result[(result["PVE_NAAM"] == key)]["WGD_CODE_1"]
        outputDict[key] = {"weather":weather.value_counts().to_json(orient="columns"), "accidents": value, "per_capita": round((int(value) / populationData[key] ), 5)}

    return json.dumps(outputDict)

#######################################
# this is for the pointMap
#######################################
#Global Variable
currentProvince = "Noord-Holland"
provinceBounds = {'_northEast': {'lat': 53.184795, 'lng': 5.316834}, '_southWest': {'lat': 52.165467, 'lng': 4.493821}}

@app.route("/pointMap")
@app.route("/pointMap/<province>")
def pointMap(province="Noord-Holland"):
    #set global province to the
    global currentProvince

    currentProvince = province
    """
    When you request the root path, you'll get the index.html template.
    """
    return flask.render_template("pointMap.html")


@app.route("/province")
def province( ):
    return currentProvince

@app.route("/postProvinceBounds", methods=['POST'] )
def postProvinceBounds():
    global provinceBounds
    provinceBounds = flask.request.get_json()
    return "" #flask.jsonify({"david": 23})

@app.route("/getProvinceBounds" )
def getProvinceBounds():
    coordinates = [[0,0],[0,0]]
    coordinates[0][0] = provinceBounds["_northEast"]['lat']
    coordinates[0][1] = provinceBounds["_northEast"]['lng']
    coordinates[1][0] = provinceBounds["_southWest"]['lat']
    coordinates[1][1] = provinceBounds["_southWest"]['lng']
    print(provinceBounds)
    return flask.jsonify( {"bounds": coordinates} )


@app.route("/dataCoordinates")
@app.route("/dataCoordinates/<int:year>")
def dataCoordinates(year= 2015 ):
    result = accidentData[ (accidentData["JAAR_VKL"] == year)]
    output = result[result["PVE_NAAM"] == currentProvince][['X_COORD', 'Y_COORD']]
    return output.to_json(orient="records")



if __name__ == "__main__":
    # load accident data
    accidentData = pickle.load(open( PATH_TO_DATA, "rb" ) )
    # import population data
    with open("static/data/population.json") as f:
        populationData = json.load(f)


    port = 8000

    # Open a web browser pointing at the app.
    #os.system("open http://localhost:{0}".format(port))

    # Set up the development server on port 8000.
    app.debug = True
    app.run(port=port)






