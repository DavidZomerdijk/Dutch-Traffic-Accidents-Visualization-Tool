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

max_color_value = 0.0
min_color_value = 1000.0

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
@app.route("/data/<int:year>/<weer>")
def data(year= 2015 , weer = "all" ):
    global max_color_value
    global min_color_value
    max_color_value = 0.0
    min_color_value = 1000.0
    provinces = ["Noord-Holland", "Zuid-Holland", "Groningen", "Friesland", "Drenthe", "Overijssel", "Flevoland", "Gelderland", "Utrecht", "Zeeland", "Noord-Brabant", "Limburg"]
    if weer == "all":
        result = accidentData[ accidentData["JAAR_VKL"] == year   ]
    else:
        result = accidentData[ accidentData["JAAR_VKL"] == year   ][accidentData["WGD_CODE_1"] == str(weer)]

    output = result["PVE_NAAM"].value_counts().to_json(orient="columns")

    #here we add the population data
    outputDict = {}
    for key, value in json.loads(output).items():
        outputDict[key] = {"accidents": value, "per_capita": round((int(value) / populationData[key] ), 5)}
        provinces.remove(key)
        #   weather = result[(result["PVE_NAAM"] == key)]["WGD_CODE_1"]
        #"weather":weather.value_counts().to_json(orient="columns"),
        if max_color_value < round((int(value) / populationData[key]), 5):
            max_color_value = round((int(value) / populationData[key]), 5)
        if min_color_value > round((int(value) / populationData[key]), 5):
            min_color_value = round((int(value) / populationData[key]), 5)

    for prov in provinces:
        outputDict[prov] = {"accidents": 0, "per_capita": 0}
    return json.dumps(outputDict)

@app.route("/maxvalue")
def maxvalue():
    global max_color_value
    global min_color_value
    return flask.jsonify({"max_value"  : str(max_color_value), "min_value" : str(min_color_value)})

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
    return flask.jsonify({"province" : currentProvince})

@app.route("/postProvinceBounds", methods=['POST'] )
def postProvinceBounds():
    global provinceBounds
    provinceBounds = flask.request.get_json()
    return ""

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
@app.route("/dataCoordinates/<int:year>/<int:minTijd>/<int:maxTijd>")
def dataCoordinates(year= 2015,minTijd=0, maxTijd=24 ):
    #filter on year
    data_filtered = accidentData[ (accidentData["JAAR_VKL"] == year)]

    #filter on province
    output = data_filtered[data_filtered["PVE_NAAM"] == currentProvince]

    #filter on time
    output = output[ (output["UUR"] >= minTijd) & (output["UUR"] <= maxTijd) ]

    #only take lat lon
    output = output[['lat', 'lon']]

    #group and sum
    output = output[['lat', 'lon']].groupby(['lat', 'lon']).size().reset_index(name="accidents")


    return output.to_json(orient="records")


@app.route("/dangerousPoints")
@app.route("/dangerousPoints/<int:distance>")
@app.route("/dangerousPoints/<int:distance>/<int:year>")
def dangerousPoints(distance=1, year=2015):
    data_filtered = accidentData[ accidentData["JAAR_VKL"] == year][accidentData["PVE_NAAM"] == currentProvince ]
    return flask.jsonify( {"dangerousPoints" : dangerPoints(data_filtered, distance)})

def dangerPoints(df, d=1):
    x = df[["VKL_NUMMER", "X_COORD", "Y_COORD", "lat", "lon"]].sort(["X_COORD", "Y_COORD"],
                                                                    ascending=[1, 1]).reset_index(drop=True)
    #print(x.head(1000))
    print(d)
    def getDangerBounds(accidentPoints):
        output2 = []
        for x in accidentPoints:
            tempDict = {}
            tempDict["Number_of_accidents"] = len(x)

            lats = [p[1] for p in x]
            longs = [p[2] for p in x]
            tempDict["bounds"] = [[min(lats), min(longs)], [max(lats), max(longs)]]
            output2.append(tempDict)
        return output2

    output = []
    temp = []
    apLocs = {}
    for i in range(1, len(x.index)):
        if i in apLocs:
            continue
        addedToTemp = False
        a = x.loc[i - 1]
        b = x.loc[i ]
        whileCount = 0
        while(abs(b["X_COORD"] - a["X_COORD"]  ) < d ):

            if abs(b["Y_COORD"] - a["Y_COORD"]) < d:
                if temp == [] and (i-1)  not in apLocs:
                    temp.append([a["VKL_NUMMER"], a["lat"], a["lon"]])
                    apLocs[i-1] = True
                if (i + whileCount) not in apLocs:
                    temp.append([b["VKL_NUMMER"], b["lat"], b["lon"]])

                    apLocs[i + whileCount] = True


            whileCount += 1
            if( i + whileCount == len(x.index)):
                break
            b = x.loc[i + whileCount]

        if  temp != []:
            output.append(temp)
            temp = []


    output.sort(key=len, reverse=True)

    return getDangerBounds(output[:25])

# old not smart
# def dangerPoints(df, number_of_accidents=10, d=10):
#     x = df[["VKL_NUMMER", "X_COORD", "Y_COORD", "lat", "lon"]].sort(["X_COORD", "Y_COORD"],
#                                                                     ascending=[1, 1]).reset_index(drop=True)
#     def getDangerBounds(accidentPoints):
#         output2 = []
#         for x in accidentPoints:
#             tempDict = {}
#             tempDict["Number_of_accidents"] = len(x)
#
#             lats = [p[1] for p in x]
#             longs = [p[2] for p in x]
#             tempDict["bounds"] = [[min(lats), min(longs)], [max(lats), max(longs)]]
#             output2.append(tempDict)
#         return output2
#
#     output = []
#     temp = []
#     apLocs = {}
#     for i in range(1, len(x.index)):
#         a = x.loc[i - 1]
#         b = x.loc[i]
#         addedToTemp = False
#
#         if abs(b["X_COORD"] - a["X_COORD"] )< d:
#             if abs(b["Y_COORD"] - a["Y_COORD"]) < d:
#                 if temp == [] and (i - 1) not in apLocs:
#                     temp.append([a["VKL_NUMMER"], a["lat"], a["lon"]])
#                     addedToTemp = True
#                     apLocs[i-1] = True
#                 if (i ) not in apLocs:
#                     temp.append([b["VKL_NUMMER"], b["lat"], b["lon"]])
#                     addedToTemp = True
#                     apLocs[i ] = True
#
#         if not addedToTemp and temp != []:
#             output.append(temp)
#             temp = []
#
#     output.sort(key=len, reverse=True)
#
#     return getDangerBounds(output[:10])

if __name__ == "__main__":
    # load accident data
    accidentData = pickle.load(open( PATH_TO_DATA, "rb" ) )
    data_filtered = data
    # import population data
    with open("static/data/population.json") as f:
        populationData = json.load(f)


    port = 8000

    # Open a web browser pointing at the app.
    #os.system("open http://localhost:{0}".format(port))

    # Set up the development server on port 8000.
    app.debug = True
    app.run(port=port)






