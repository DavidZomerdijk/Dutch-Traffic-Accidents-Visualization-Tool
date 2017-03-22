"""
Author: David Zomerdijk
Description: This file will load the
"""
import pandas as pd
from collections import defaultdict
import pickle
from Converter import *
import numpy as np

PATH_RAW_DATA = "raw/"
FILENAME = "verkeersOngelukkenNederland"

def createMapping(path ,min_year, max_year):
    # a little weird but the directory structure is not equal for all data, therefore I made this dictionary
    def subfoldermapping():
        path = defaultdict(lambda: "02 TOTNL J-N-J-N/")
        path[2013] = ""
        path[2003] = "J-N-J-N/"
        path[2015] = "02TOTNL J-N-J-N/"
        return path

    subfolder = subfoldermapping()
    mapping = {}
    for y in range(min_year, max_year +1):
        mapping[y] = path+ "01-01-" + str(y) +" - 31-12-" + str(y) + "/" + subfolder[y]
    return mapping


def importData(path, min_year, max_year):
    # a little weird but the directory structure is not equal for all data, therefore I made this dictionary
    path_mapping = createMapping(path, min_year, max_year)
    ongelukkenData = pd.concat([  pd.read_csv( path_mapping[year] + "Ongevallengegevens/ongevallen.txt" ,encoding ='latin1' ,low_memory=False) for year in range(min_year, max_year + 1)]).reset_index()
    puntLocaties = pd.concat(
        [pd.read_csv(path_mapping[year] + "Netwerkgegevens/puntlocaties.txt", encoding='latin1',low_memory=False) for year in
         range(min_year, max_year + 1)]).drop_duplicates(['FK_VELD5'], keep='last').reset_index()

    data = pd.merge(ongelukkenData, puntLocaties, how='left' ,left_on='FK_VELD5', right_on='FK_VELD5')

    converter = Converter()
    data["lat"] = data.apply(lambda row: converter.toLat( row["X_COORD"], row["Y_COORD"]), axis=1)
    data["lon"] = data.apply(lambda row: converter.toLon( row["X_COORD"], row["Y_COORD"]), axis=1)
    #write to csv
    data.to_csv(FILENAME+".csv", sep='\t', encoding='utf-8' )

    #dump as pickle
    pickle.dump( data, open(FILENAME + ".p", "wb"))

    print("The data has {} rows".format(len(data)))
    print("The data has succesfully been imported and saved as a picklefile and a csv in this directory under the name {}.".format(FILENAME))

if __name__ == "__main__":

    importData(PATH_RAW_DATA, 2003, 2015)