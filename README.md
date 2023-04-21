# Project-3

#### -- Project Status: Completed

## Project Intro/Objective
The purpose of this project is to explore and analyze demographics in the Minneapolis area and the effects on internet service. The main Internet Service Provided we will be analyzing will be CenturyLink. 

## Tools Used
- DB Browser for SQLite
- Python
  - Pandas
  - Sqlite3
  - SQLAlchemy
  - Flask
  - Datetime
- JavaScript
  - Leaflet
  - Plotly
  - D3
  - ApexCharts
- CSS
- HTML

## Data Wrangling
- Narrowed down search from the whole USA to just Minneapolis
- Loaded CSV’s into Pandas DataFrames to create, sort, and clean data for SQLite tables
- Loaded data into a SQLite db with two classes
  - Raw Data
  - Grouped Data
- Used DB Browser for SQLite to troubleshoot database class issues
- Created the API with SQLAlchemy and Flask to return each Jsonified class on separate paths

## Visualization Explanations 

- Map of Minneaplis by Block Group
- Stacked Bar Chart with 3 views
- Pie Charts created using ApexCharts.js to showcase Icome Level and the technology type 

## Files
The individual charts were put into the subfolders along with chart-specific HTML files. 
- Colleen/stackedbar.js
- Dan/static/js/map.js
- Pie chart files/pie.js

Data Cleansing files
- data_selection.ipynb was used to pull the data in and manipulate it into a SQLite db.
- sqlalchemy_api.ipynb was the test file to create the api that is made available by app.py

Data files
- Data/isp.sqlite
- minneapolis_centurylink_plans.csv

In order to run
- Start the API via the base level app.py file locally
- Use the base level index.html file to display, running 'python -m http.server' to avoid CORS errors





## Contributing Members

Amy Baker, Lexie Fallow, Colleen Karwoski, Dan Lee

## Data Sources
- Kaggle https://www.kaggle.com/datasets/michaelbryantds/internet-speeds-and-prices?select=speed_price_centurylink.csv
- Git Hub - https://github.com/the-markup/investigation-isp
- Article - https://themarkup.org/show-your-work/2022/10/19/how-we-uncovered-disparities-in-internet-deals
