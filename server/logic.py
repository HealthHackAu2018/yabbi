import csv
import time


class Logic:
    def __init__(self):
        nodes_filename = 'testdata/nodes.csv'
        strains_filename = 'testdata/strains_10s.csv'
        self.freq = 200 #Hz
        self.sample_time = 1./self.freq
        self.nodes = []
        self.strains = []
        self.data = []
        with open(nodes_filename, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            for i in reader:
                for j in i:
                    self.nodes.append(float(j))
        print(len(self.nodes))
        with open(strains_filename, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            for i in reader:
                for j in i:
                    self.strains.append(float(j))

                self.data.append([])
        print(len(self.strains))
        print(len(self.data))
        m = int(len(self.strains) / len(self.data))
        print(m)
        for i in range(len(self.data)):
            for j in range(m):
                node = [self.nodes[3*j + 0],
                        self.nodes[3*j + 1],
                        self.nodes[3*j + 2],
                        self.strains[i * m + j]]
                self.data[i].append(node)

        self.maxct = len(self.strains)
        self.ct = 0

        self.time0 = int(round(time.time() * 1000))
        self.frameNumber = 1;

    def read_in_data(self):

        row = self.ct % self.maxct
        self.ct += 1
        self.ct = self.ct % len(self.data)
        return self.data[self.ct]

    def update(self):
        t = int(round(time.time() * 1000)) - self.time0
        self.frameNumber = int(t / 5)

    def get_frame(self, index):
        frameNumberIndex = index % len(self.data);
        return self.data[frameNumberIndex]
