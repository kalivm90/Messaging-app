'use client'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";


const Chat = () => {
      // Auth Data
  const {data: session, status} = useSession();
  // Is loading state
  const [isLoading, setIsLoading] = useState(true);

  // Input ref
  const inputRef = useRef<HTMLInputElement | null>(null);

  let client: W3CWebSocket;

  // Buton on click
  const onButtonClick = (value: any) => {
    console.log(inputRef.current?.value);

    client.send(JSON.stringify({
      type: "message",
      msg: inputRef.current?.value,
      id: session?.user?.id
    }))
  }


  useEffect(() => {
    const webSocketConnect = () => {
      // const serverURL = "ws://localhost:3001";
      const serverURL = process.env.NEXT_PUBLIC_WS_SERVER || "";
      client = new W3CWebSocket(serverURL);

      if (client.readyState === 1) {
        setIsLoading(false);
      }

      client.onopen = () => {
        console.log("Websocket started");
      }
      client.onmessage = (message: any) => {
        const dataFromServer = JSON.parse(message.data);
        console.log("got reply", dataFromServer);
      }
      client.onclose = () => {
        // setIsLoading(true);
        console.log(`Something went wrong with the server at: "${serverURL}"\nIf this is not the correct url please check your env variables.`);
      }
    }

    if (session?.user) {
      webSocketConnect(); 
    } else {
      setIsLoading(false);
      console.error("Connection refused since user is not authenticated");
    }

  }, [session])



  return (
    <section className="bg-red-500 h-full flex flex-col">

      <div id="text-box" className="flex-1 p-5 dark:text-white">
          This will be the message board
      </div>

      <div id="form-fields" className="flex flex-row">
        <input 
          ref={inputRef}
          type="text"
          placeholder="enter here"
          className="w-full h-10 px-3 focus:outline-none"
        />
        <button 
          onClick={() => onButtonClick("Hello")}
          className="dark:bg-red-600 px-5 h-10"
        >
          Send
        </button>
      </div>

    </section>
  );
}

export default Chat
