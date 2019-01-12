const _toArrayBuffer = (blob) => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort();
          reject(new DOMException("Problem parsing input blob."));
        };

        temporaryFileReader.onload = () => {
          resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsArrayBuffer(blob);
      });
    };


function printDataFrameSet(dataFrameSet) {
    var dataList = dataFrameSet.getDataframeList();
    var len = dataList.length;
    var str = "size: " + len + "\n";
    for (var i = 0; i < len; ++i) {
        str += "channelName: " + dataList[i].getChannelname() + "\n";
        str += "       time: " + dataList[i].getTime() + "\n";
        str += "       data: [" + dataList[i].getDataList() + "]\n";
    }
    console.log(str);
}
var nextEnum = {
    RECEIVE_CHANNELS: 0,
    RECEIVE_DATA: 1
}

var next = nextEnum.RECEIVE_CHANNELS;
const framesToRequest = 10000;
var frameCounter = framesToRequest;
//var ws = new WebSocket('ws://132.234.133.234:8080/'); 
var ws = new WebSocket('ws://127.0.0.1:8080/'); 
ws.onopen = function open() {
    console.log('connected')
    var binaryType = ws.binaryType
    console.log("binary type: " + binaryType);
    var request = new proto.yabbi.ClientRequest();
    request.setRequest(proto.yabbi.ClientRequest.Request.CHANNELS);
    var msg = request.serializeBinary();
    ws.send(msg);
};

ws.onclose = function close() {
    console.log('disconnected')
};

ws.onmessage = async function incoming(event) {
//	console.log('message')
    switch (next) {
        case nextEnum.RECEIVE_CHANNELS:
            var arrbuff = await _toArrayBuffer(event.data);
            var availableChannels = proto.yabbi.AvailableChannels.deserializeBinary(arrbuff);
            console.log(availableChannels);
            var request = new proto.yabbi.ClientRequest();
            request.setRequest(proto.yabbi.ClientRequest.Request.DATA);
            request.setNframes(framesToRequest);
            var msg = request.serializeBinary();
            next = nextEnum.RECEIVE_DATA;
            ws.send(msg);
            break;
        case nextEnum.RECEIVE_DATA:
            var arrbuff = await _toArrayBuffer(event.data);
            var dataFrameSet = proto.yabbi.DataFrameSet.deserializeBinary(arrbuff);
            dataQueue.push(dataFrameSet);
            //printDataFrameSet(dataFrameSet);
            if (--frameCounter < 0){ 
                ws.close();
            }
            break;
    }
    

};

