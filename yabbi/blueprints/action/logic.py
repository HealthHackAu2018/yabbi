import pandas as pd
import numpy as np

class Logic:

 #   default_frame = {'meta': {'3ddata':{'values':{'strain':0}}},'time': 0,'3ddata':[]}

    def __init__(self):
        nodes_filename = 'testdata/nodes.csv'
        strains_filename = 'testdata/strains_10s.csv'
        self.freq = 200 #Hz
        self.sample_time = 1./self.freq
        self.nodes = pd.read_csv(nodes_filename, delimiter=',', dtype=np.float64)
        self.strains = pd.read_csv(strains_filename, delimiter=',', dtype=np.float64)
        self.maxct = self.strains.shape[0]
        self.ct = 0

    def read_in_data(self):
        frame = {'meta': {'3ddata':{'values':{'strain':0}}},'time': 0,'3ddata':[]}
        frame['time'] = self.ct*self.sample_time
        row = self.ct % self.maxct
        for i in range(self.nodes.shape[0]):
            pos = {'x': self.nodes.iloc[i,0],'y': self.nodes.iloc[i,1],'z': self.nodes.iloc[i,2],'values':[]}
            pos['values'].append(self.strains.iloc[row, i])
            frame['3ddata'].append(pos)
        self.ct += 4
        return frame
