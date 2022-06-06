import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

export default function Video() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  

  const remoteVideo = useRef(null);
  const currentVideo = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentVideo.current.srcObject = mediaStream;
        currentVideo.current.play();
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideo.current.srcObject = remoteStream;
          remoteVideo.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    let getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentVideo.current.srcObject = mediaStream;
      currentVideo.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideo.current.srcObject = remoteStream;
        remoteVideo.current.play();
      });
    });
  };

  return (
    <div>
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
      />
      <button onClick={() => call(remotePeerId)}>Call</button>
      <div className="d-flex flex-row">
        <div className="p-2">
            <video ref={currentVideo} />
        </div>
        <div className="p-2">
            <video ref={remoteVideo} />
        </div>
      </div>
      
    </div>
  );
}


//https://www.youtube.com/watch?v=5JTpRCo0e8s&t=1678s