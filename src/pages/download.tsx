import { useState } from "react";
import streamToBlob from "stream-to-blob";

import ytdl from "ytdl-core";

export default function App() {
  const [ytUrl, setUrl] = useState("");
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="heading">My Own YouTube Downloader !</h1>
      <input
        className="URL-input"
        placeholder="Video URL e.g. https://www.youtube.com/watch?v=MtN1YnoL46Q"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="convert-button"
        onClick={async () => {
          try {
            // const stream = new stream.Readable()
            // https://www.youtube.com/watch?v=AACGbCOqSmo
            const file = await ytdl(ytUrl);
            const blob = await streamToBlob(file, "mp4");
            console.log(blob);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Convert
      </button>
    </div>
  );
}
