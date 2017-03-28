"""
Remark: Some code has been copy pasted from tutorials.
https://github.com/dfm/flask-d3-hello-world/blob/master/app.py tesst
"""
"""
This file is part of the flask+d3 Hello World project.
"""
import json
import os
import flask
import numpy as np
import pandas as pd
import pickle

PATH_TO_DATA = "../../Data/verkeersOngelukkenNederland.p"
app = flask.Flask(__name__)



@app.route("/")
def index():
    """
    When you request the root path, you'll get the index.html template.
    """
    return flask.render_template("mapbig.html")


@app.route("/data")
@app.route("/data/<int:year>")
def data(year= 2015 ):
    # result = data[ (data["PVE_CODE"] == "NH") & (data["JAAR_VKL"] == 2015)]
    # return  result.head(3).reset_index().to_json(orient='index')

    result = data[ (data["JAAR_VKL"] == year)]
    output = result["PVE_NAAM"].value_counts().to_json(orient="columns")

    return output


def dangerPoints(df, number_of_accidents=10, d=5):
    x = df[["VKL_NUMMER", "X_COORD", "Y_COORD", "lat", "lon"]].sort(["X_COORD", "Y_COORD"],
                                                                    ascending=[1, 1]).reset_index(drop=True)
    #print(x.head(1000))
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
            break
        addedToTemp = False
        a = x.loc[i - 1]
        b = x.loc[i ]
        whileCount = 0
        while(abs(b["X_COORD"] - a["X_COORD"]  ) < d ):
            whileCount += 1
            if abs(b["Y_COORD"] - a["Y_COORD"]) < d:
                if temp == [] and (i + whileCount) not in apLocs:
                    temp.append([a["VKL_NUMMER"], a["lat"], a["lon"]])
                    apLocs[i-1] = True
                if (i + whileCount) not in apLocs:
                    temp.append([b["VKL_NUMMER"], b["lat"], b["lon"]])
                    addedToTemp = True
                    apLocs[i] = True
            if(i+whileCount == len(x.index)):
                break
            b = x.loc[i + whileCount]

        if not addedToTemp and temp != []:
            output.append(temp)
            temp = []

    output.sort(key=len, reverse=True)

    return getDangerBounds(output[:10])


if __name__ == "__main__":
    #open data
    #data = pickle.load(open( PATH_TO_DATA, "rb" ) )
    #data = 5
    port = 8000

    # Open a web browser pointing at the app.
    os.system("open http://localhost:{0}".format(port))

    # Set up the development server on port 8000.
    app.debug = True
    app.run(port=port)













# from flask import Flask, render_template, request, jsonify, redirect, url_for
# from nvd3 import pieChart
#
# # app.py
# app = Flask(__name__
#             )
# @app.route('/')
# def index():
#     return render_template('index.html')
#
# # @app.route('/hello')
# # def aloha():
# #     return redirect(url_for('index'))
#
# @app.route('/hello')
# def aloha():
#     type = 'pieChart'
#     chart = pieChart(name=type, color_category='category20c', height=450, width=450)
#     xdata = ["Orange", "Banana", "Pear", "Kiwi", "Apple", "Strawberry", "Pineapple"]
#     ydata = [3, 4, 0, 1, 5, 7, 3]
#     extra_serie = {"tooltip": {"y_start": "", "y_end": " cal"}}
#     chart.add_serie(y=ydata, x=xdata, extra=extra_serie)
#     chart.buildcontent()
#     print(chart.htmlcontent)
#     return chart.htmlcontent
#     #return "hello there"
#
# if __name__ == "__main__":
#     app.run(
#         host="0.0.0.0",
#         port=int("8000"),
#         debug=True
#     )



