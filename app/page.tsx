"use client";

import JsSIP from "jssip";
import { useState } from "react";

export default function Home() {
  const socket = new JsSIP.WebSocketInterface("wss://phone.talkwisely.io:7443");
  const [incomingSession, setIncomingSession] = useState({} as any);
  JsSIP.debug.enable("JsSIP:*");
  const configuration = {
    sockets: [socket],
    uri: "sip:1006@phone.talkwisely.io",
    password: "PLe?jVT6B38w0cqL^MzM",
    registrar_server: "phone.talkwisely.io",
    contact_uri: "sip:1006@phone.talkwisely.io",
  };

  const ua = new JsSIP.UA(configuration);
  ua.on("newRTCSession", function (data: any) {
    const session = data.session;
    setIncomingSession(session);

    session.on("failed", () => {
      // audioPlayer.stop("ringing");
      setIncomingSession(null);
    });

    session.on("ended", () => {
      setIncomingSession(null);
    });

    session.on("accepted", () => {
      // audioPlayer.stop('ringing');
      setIncomingSession(null);
    });

    ua.start();
  });

  function handleAcceptIncoming() {
    incomingSession.answer();
  }
  function handleRejectIncoming() {
    incomingSession.terminate();
  }

  function handleStart() {
    const eventHandlers = {
      progress: function (data: any) {
        /* Your code here */
      },
      failed: function (data: any) {
        /* Your code here */
      },
      confirmed: function (data: any) {
        /* Your code here */
      },
      ended: function (data: any) {
        /* Your code here */
      },
    };
    const options = {
      eventHandlers: eventHandlers,
      pcConfig: {
        iceServers: [
          {
            urls: ["turn:13.250.13.83:3478?transport=udp"],
            username: "YzYNCouZM1mhqhmseWk6",
            credential: "YzYNCouZM1mhqhmseWk6",
          },
        ],
      },
    };
    const session = ua.call("sip:1002@phone.talkwisely.io", options);
  }

  function handleStop() {}

  return (
    <main className="flex min-h-screen justify-center items-start gap-8 p-24">
      <button
        onClick={(e) => handleStart()}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Start
      </button>
      <button
        onClick={(e) => handleStop()}
        type="button"
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Stop
      </button>
      {incomingSession === null ? (
        <div className="absolute top-8 justify-center items-center left-4 w-48 px-4 bg-white h-20 flex gap-4 ">
          <button className="bg-red-400 w-36 rounded-sm px-2 h-fit">
            Decline{" "}
          </button>
          <button className="bg-green-400 w-36 rounded-sm px-2 h-fit">
            Accept{" "}
          </button>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
