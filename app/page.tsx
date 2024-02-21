import Chat from "@/components/Chat";
import Image from "next/image";
import styles from "@/public/assets/styles/Home.module.css"

import DarkLogo from "@/public/images/dark-logo.png";
import LightLogo from "@/public/images/light-logo.png";
import ChatBanner from "@/public/images/chat2.jpg";



export default function Home() {

  return (
    <main className="flex flex-col text_color">
      <header className={styles.header}>
        <Image
          src={ChatBanner}
          alt=""
          className="sm:w-screen dark:brightness-[.3] dark:opacity-60 brightness-[.6]"
        />
        <div className="flex flex-col gap-2 lg:gap-6 h-full w-full text-center justify-center pb-4">
          <h1 className="lg:text-8xl md:text-6xl text-5xl text-slate-300 dark:text-slate-300 Roblox-font">Sockmessage</h1>
          <p className="lg:text-2xl md:text-lg text-white">Communicate instantly with people all over the world!</p>
        </div>
      </header>
    </main>
  );
}




















// 'use client'
// import Image from "next/image";
// import styles from "@/public/assets/styles/Home.module.css"
// import { useSession } from "next-auth/react";
// import { useEffect, useRef } from "react";

// import { w3cwebsocket as W3CWebSocket } from "websocket";
// // import { message } from "antd";

// const serverURL = process.env.NEXT_PUBLIC_WS_SERVER || "";

// const client = new W3CWebSocket(serverURL);

// export default function Home() {

//   const {data: session, status} = useSession();

//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const onButtonClick = (value: any) => {

//     console.log(inputRef.current?.value);

//     client.send(JSON.stringify({
//       type: "message",
//       msg: inputRef.current?.value,
//       id: session?.user?.id
//     }))
//   }

//   useEffect(() => {
//     console.log(session);

//     client.onopen = () => {
//       console.log("Websocket started");
//     }
//     client.onmessage = (message: any) => {
//       const dataFromServer = JSON.parse(message.data);
//       console.log("got reply", dataFromServer);
//     }
//   }, [session])

//   return (
//     <main className="flex flex-col">

//       <div id="text-box" className="flex-1 p-5">
//           hello
//       </div>

//       <div id="form-fields" className="flex flex-row">
//         <input 
//           ref={inputRef}
//           type="text"
//           placeholder="enter here"
//           className="w-full h-10 px-3 focus:outline-none"
//         />
//         <button 
//           onClick={() => onButtonClick("Hello")}
//           className="dark:bg-red-600 px-5 h-10"
//         >
//           Send
//         </button>
//       </div>

//     </main>
//   );
// }
