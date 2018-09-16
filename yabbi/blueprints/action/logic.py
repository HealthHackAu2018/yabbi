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
        self.data = []
        for i in range(self.strains.shape[0]):
            frame = np.empty([self.nodes.shape[0], self.nodes.shape[1]+1])
            frame[:,0:3] = self.nodes.values
            frame[:,3] = self.strains.values[i,:-1].T
            self.data.append(frame)
            #change the z position of some points to show changes in the plot
            lin_strain = np.multiply(np.arange(frame.shape[0]), np.sin(6.28/200)/frame.shape[0])
            frame[:,1] = np.add(frame[:,1], lin_strain)
        self.maxct = self.strains.shape[0]
        self.ct = 0

    def read_in_data(self):
        self.ct += 1
        self.ct = self.ct % len(self.data)
        return self.data[self.ct]
