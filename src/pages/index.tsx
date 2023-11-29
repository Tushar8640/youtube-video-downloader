import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });
type VideoFormat = {
  mimeType: string;
  qualityLabel: string;
  bitrate: number;
  audioBitrate: number | null;
  contentLength: string;
  // Add other properties based on your actual format structure
  // For example:
  width: number;
  height: number;
  hasVideo: boolean;
  hasAudio: boolean;
  container: string;
  quality: string;
  itag: number;
  url: string;
};
type ApiResponse = VideoFormat[]; // Array of VideoFormat

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [videoQuality, setVideoQuality] = useState("");
  const [fileType, setFileType] = useState("");
  const [formats, setFormats] = useState<ApiResponse>([]);

  const handleDownload = async () => {
    try {
      setFormats([]);
      const response = await axios.get(`/api/youtube?videoUrl=${videoUrl}`);
      console.log(response);
      const filtered = response.data.filter((d: VideoFormat) => d.itag === 18);
      setFormats(filtered);
    } catch (error) {
      setError("Failed to download video");
      console.log(error);
    }
  };

  useEffect(() => {
    if (videoUrl) {
      handleDownload();
    }
  }, [videoUrl]);

  const handleDownloadVideo = async () => {
    try {
      console.log("downloading");
      const response = await axios.get(
        `/api/download?videoUrl=${encodeURIComponent(
          videoUrl
        )}&videoQuality=${encodeURIComponent(videoQuality)}`,
        {
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "video.mp4";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log("Download complete");
    } catch (error) {
      setError("Failed to download video");
      console.error(error);
    }
  };

  useEffect(() => {
    if (videoQuality) {
      handleDownloadVideo();
    }
  }, [videoQuality]); // The dependency array ensures the effect runs when videoQuality changes

  const handleButtonClick = (format: string) => {
    // Triggering a state update
    setVideoQuality(format);
  };
  console.log(videoQuality);
  return (
    <main className={`container mx-auto mt-8 ${inter.className}`}>
      <div className="max-w-3xl mx-auto ">
        <h1 className="text-3xl font-bold mb-4">YouTube Video Downloader</h1>
        <div className="flex">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube Video URL"
            className="border p-2 mr-2 flex-grow"
          />
          {/* <button
            onClick={handleDownload}
            className="bg-blue-500 text-white p-2"
          >
            Download
          </button> */}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {formats.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mt-4">Video Formats:</h2>
            <ul>
              {formats.map((format, index) => (
                <li key={index} className="mt-2">
                  <p>
                    <strong>Quality:</strong> {format.qualityLabel}
                  </p>
                  {format.contentLength && (
                    <p>
                      <strong>Size:</strong>{" "}
                      {(parseInt(format.contentLength) / (1024 * 1024)).toFixed(
                        2
                      )}{" "}
                      mb
                    </p>
                  )}

                  <p>
                    <strong>Audio Available:</strong>{" "}
                    {format.hasAudio ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Video Available:</strong>{" "}
                    {format.hasVideo ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Video Itag:</strong> {format.itag}
                  </p>

                  <a
                    className="bg-purple-500 px-4 py-1 rounded text-white mt-2 mb-10"
                    download
                    href={`/api/download?videoUrl=${videoUrl}`}
                  >
                    Download
                  </a>

                  <div className="my-10">
                    <video autoFocus controls src={format.url}></video>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
