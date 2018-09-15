## Description

### To Run
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
