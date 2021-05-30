const fs = require("fs");
export const streamFileUtils = function(track, res, req) { 
    const range= req.headers.range; 
    if (!range) {
      res.status(400).send("Requires Range header");
    }
    const audioPath = './files/audio'+"/"+track.toString();
    //console.log(audioPath);
    const audioSize = fs.statSync(audioPath).size;
    //console.log(audioSize);
      
    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 1*(10 ** 6); // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
    // Create headers
    const contentLength = end - start + 1;
    //console.log(contentLength);
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${audioSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "audio/mp3",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create audio read stream for this particular chunk
    const audioStream = fs.createReadStream(audioPath, { start, end });
    //console.log(start, end);

    // Stream the audio chunk to the client
    audioStream.pipe(res);
}