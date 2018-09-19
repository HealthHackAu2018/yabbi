from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from logic import Logic
import struct


logicInstance = Logic()


class SimpleStreamer(WebSocket):
    # Called for every client connecting (after handshake)
    def handleConnected(self):
        print(self.address, 'connected')

    # Called for every client disconnecting
    def handleClose(self):
        print(self.address, 'closed')


    # Called when a client sends a message
    def handleMessage(self):
        t0 = 0
        message = self.data
        #print(message)

        #
        # Read in the message (containg the client's frame number)
        #
        if message == None: t0 = -1
        else: t0 = int(message)


        #
        # Calculate how many frames to send
        #
        frame = logicInstance.update()
        tf = logicInstance.frameNumber

        if (t0 < tf - 100): t0 = tf - 100
        nFrames = tf - t0

        #
        # Write the current frame timestamp and the number of frames to follow
        #
        data = []
        args = ''
        data.append(tf)
        args += 'i'
        data.append(nFrames)
        args += 'i'

        #
        # Output frames for each time up to current
        #
        for ti in range(t0, tf):
            frame = logicInstance.get_frame(ti)
            nPoints = 2047
            data.append(nPoints)
            args += 'i'
            for i in range(nPoints):
                x = frame[i][0]
                y = frame[i][1]
                z = frame[i][2]
                s = frame[i][3]
                data.append(x)
                data.append(y)
                data.append(z)
                data.append(s)
            args += '%sf' % (4 * nPoints)

        #
        # Send the message as a blob
        #
        buf = struct.pack(args, *data)
        self.sendMessage(buf)
