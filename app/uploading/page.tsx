"use client";
import axios from "axios";
import { Upload } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
  const serverUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const upload = async () => {
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${serverUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", res.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        className="border-2 p-2 cursor-pointer"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            setFile(files[0]);
            const imageUrl = URL.createObjectURL(files[0]);
            setPreviewUrl(imageUrl);
          }
        }}
      />
      {previewUrl && (
        <div>
          <img src={previewUrl} className="max-w-xs rounded mt-4"/>
        </div>
      )}
      <button
        className="border-2 px-4 py-2 flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600"
        type="button"
        onClick={upload}
      >
        <Upload size={16} />
        <span>Upload</span>
      </button>
    </div>
  );
};

export default Page;
