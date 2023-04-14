
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect #, Column, Integer, String, Float, DateTime

import pandas as pd

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///C:/Users/Dan/Documents/Python Scripts/Project-3/Data/isp.sqlite")
#engine = create_engine("sqlite:///Data/isp.sqlite")

Base = automap_base()

Base.prepare(autoload_with=engine)

Base.classes.keys()

minneapolis_centurylink = Base.classes.Minneapolis_Centurylink

#################################################
# Flask Setup
#################################################
from flask_cors import CORS

# requires flask-cors to be installed
# pip install -U flask-cors

app = Flask(__name__)

cors = CORS(app)

#################################################
# Flask Routes
#################################################


@app.route("/")
def welcome():
    session = Session(engine)

    data = session.query(minneapolis_centurylink.address_full, \
                        minneapolis_centurylink.major_city, \
                        minneapolis_centurylink.state, \
                        minneapolis_centurylink.lat, \
                        minneapolis_centurylink.lon, \
                        minneapolis_centurylink.block_group,\
                        minneapolis_centurylink.collection_datetime, \
                        minneapolis_centurylink.provider, \
                        minneapolis_centurylink.price, \
                        minneapolis_centurylink.speed_down, \
                        minneapolis_centurylink.speed_up, \
                        minneapolis_centurylink.speed_unit, \
                        minneapolis_centurylink.technology, \
                        minneapolis_centurylink.package, \
                        minneapolis_centurylink.fastest_speed_down,	\
                        minneapolis_centurylink.fastest_speed_price, \
                        minneapolis_centurylink.speed_down_bins, \
                        minneapolis_centurylink.redlining_grade, \
                        minneapolis_centurylink.race_perc_non_white, \
                        minneapolis_centurylink.race_quantile, \
                        minneapolis_centurylink.median_household_income, \
                        minneapolis_centurylink.income_dollars_below_median, \
                        minneapolis_centurylink.income_level, \
                        minneapolis_centurylink.ppl_per_sq_mile, \
                        minneapolis_centurylink.n_providers, \
                        minneapolis_centurylink.internet_perc_broadband).all()

    dataArray = []

    for address_full, major_city, state, lat, lon, block_group, collection_datetime,\
        provider, price, speed_down, speed_up, speed_unit, technology, package, \
        fastest_speed_down, fastest_speed_price, speed_down_bins, redlining_grade, \
        race_perc_non_white, race_quantile, median_household_income, income_dollars_below_median, \
        income_level, ppl_per_sq_mile, n_providers, internet_perc_broadband in data:
        
        rowData = {}
        rowData["address_full"] =  address_full
        rowData["major_city"] =  major_city
        rowData["state"] =  state
        rowData["lat"] =  lat
        rowData["lon"] =  lon
        rowData["block_group"] =  block_group
        rowData["collection_datetime"] =  collection_datetime
        rowData["provider"] =  provider
        rowData["price"] =  price
        rowData["speed_down"] =  speed_down
        rowData["speed_up"] =  speed_up
        rowData["speed_unit"] =  speed_unit
        rowData["technology"] =  technology
        rowData["package"] =  package
        rowData["fastest_speed_down"] =  fastest_speed_down
        rowData["fastest_speed_price"] =  fastest_speed_price
        rowData["speed_down_bins"] =  speed_down_bins
        rowData["redlining_grade"] =  redlining_grade
        rowData["race_perc_non_white"] =  race_perc_non_white
        rowData["race_quantile"] =  race_quantile
        rowData["median_household_income"] =  median_household_income
        rowData["income_dollars_below_median"] =  income_dollars_below_median
        rowData["income_level"] =  income_level
        rowData["ppl_per_sq_mile"] =  ppl_per_sq_mile
        rowData["n_providers"] =  n_providers
        rowData["internet_perc_broadband"] =  internet_perc_broadband

        dataArray.append(rowData)

    return jsonify(dataArray)


if __name__ == "__main__":
    app.run(debug=True)