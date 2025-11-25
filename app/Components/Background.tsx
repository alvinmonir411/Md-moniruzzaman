import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

const Background = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div
        className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-20 animate-pulse ${
          isDark ? "bg-indigo-600" : "bg-indigo-300"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-20 animate-pulse ${
          isDark ? "bg-purple-600" : "bg-purple-300"
        }`}
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('[https://grainy-gradients.vercel.app/noise.svg](https://grainy-gradients.vercel.app/noise.svg)')] opacity-20"></div>

      {/* Grid Lines */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
        } bg-[size:24px_24px]`}
      ></div>
    </div>
  );
};

export default Background;
