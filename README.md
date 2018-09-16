## Description

### To Run
download miniconda for python 3 https://conda.io/miniconda.html
conda create -n webenv python=3  
source activate webenv  
pip install -e .  
./run-build  

### To View
127.0.0.1:8000

### Where stuff is

#### Webpage (HTML files)
Located in /yabbi/blueprints/page/templates/page/home.html

#### Javascript
Located in /yabbi/static/scripts

#### Routes (Where python connects to the front end)
Located in /yabbi/blueprints/page/views.py

#### Logic files (Python logic)
Located in /yabbi/blueprints/action/logic.py



#### Operation
yabbi/static/scripts/main.js is the entry point for the client -
it sends an ajax request for the "/get_info" url, which returns data in the format:
data[pointIndex][0] = x coordinate
data[pointIndex][1] = y coordinate
data[pointIndex][2] = z coordinate
data[pointIndex][3] = currently the strain value of the coordinate.

On success the ajax call:
First time- initializes three.js visualisation
Calls an update on the three.js visualisation (position and color)
Calls runSummaryVis which updates the 2d graph visualisations.
Finally, calls itself - looping the update process.