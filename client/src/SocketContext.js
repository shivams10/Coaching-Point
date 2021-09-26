import React , {createContext, useState, useRef, useEffect} from "react";
import {io} from "socket.io-client"
import Peer from "simple-peer"

const SocketContext = createContext();
const socket = io("http://localhost:5000");

const ContextProvider = ({children}) => {

    const [ stream, setStream ] = useState ( null );
    const [ me, setMe ] = useState ( '' );
    const [ call, setCall ] = useState ({});
    const [callAccepted, setCallAccepted] = useState( false );
    const [callEnded, setCallEnded] = useState( false );
    const myVideo = useRef();

    useEffect(() => {
        // To get the permission to access camera and microphone we can use built in navigator
        navigator.mediaDevices.getUserMedia( { video: true, audio: true } )
        .then( ( currentStream) => {
            setStream(currentStream);

            myVideo.current.srcObject = currentStream;
        })

        socket.on('me', (id) => setMe(id));
        socket.on('calluser', ( { from, name: callerName, signal } ) => {
            setCall({ isReceivedCall: true, from, name:callerName, signal})
        })
    }, [])

    const answercall = () => {
        setCallAccepted( true );

        const peer = new Peer ({initiator: false, trickle: false, stream});

        peer.on( 'signal', (data) => {
            socket.emit( 'answercall', { signal: data, to: call.from });
        })

        peer.on('stream', ( currentStream ))
    }

    const callUser = () => {

    }

    const leaveCall = () => {

    }

}