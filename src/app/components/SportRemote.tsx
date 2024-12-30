"use client";
import { init, loadRemote } from "@module-federation/enhanced/runtime";
import { useCallback, useEffect, useRef } from "react";
import React from "react";

export const CSS_DOCUMENTS_COM: string[] = [
  "https://sportsbook.adjarabet.com/config/typography.css",
  "https://sportsbook.adjarabet.com/config/theme1.css",
  "https://newstatic.adjarabet.com/static/atomic/buildcss/sb-styles-com.css",
];

export const CSS_DOCUMENTS_AM: string[] = [
  "https://sportsbook.adjarabet.am/config/typography.css",
  "https://sportsbook.adjarabet.am/config/theme1.css",
  "https://staticfiles.adjarabet.am/static.am/atomic/buildcss/sb-styles-am.css",
];

init({
  name: "AB-TURBO",
  remotes: [
    {
      name: "angular3",
      entry: `https://sportsbook.adjarabet.com/remoteEntry.js?cache=${Date.now()}`,
    },
  ],
});

declare global {
  interface Window {
    SSBaseUrl: string;
    SSRouterBaseUrl: string;
  }
}

export const addCssToDocumentTag = (url: string, global: boolean) => {
  const linkElement = document.createElement("link");
  if (global) {
    linkElement.setAttribute("id", "global_stylesheet");
  }
  linkElement.setAttribute("rel", "stylesheet preload");
  linkElement.setAttribute("type", "text/css");
  linkElement.setAttribute("as", "style");
  linkElement.setAttribute("href", url);
  document.head.appendChild(linkElement);
};

declare global {
  interface Window {
    SSBaseUrl: string;
    SSRouterBaseUrl: string;
  }
}

const SportRemote = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  try {
    window.SSBaseUrl = "https://sportsbook.adjarabet.com";
    window.SSRouterBaseUrl = '/';
  } catch (error) {
    console.log("Error setting SSBaseUrl and SSRouterBaseUrl:", error);
  }

  const addSsRoot = useCallback(() => {
    const ssRoot = document.createElement("ss-root");
    if (containerRef.current) {
      containerRef.current.appendChild(ssRoot);
    }
  }, []);

  const addCss = useCallback(() => {
    const time = Date.now();
    CSS_DOCUMENTS_COM.forEach((doc) => {
      addCssToDocumentTag(doc + `?cache=${time}`, false);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      addSsRoot()
      addCss();
      loadRemote("angular3/webcomponents")
        .then((m: any) => {
          if (m) {
            console.log("dev => remote module", m);
          } else {
            console.error("Failed to load remote module");
          }
        })
        .catch((err) => {
          console.error("Error loading remote module:", err);
        });
    }, 3000);
  }, []);


  // return React.createElement('ss-root')
  return (
    <div ref={containerRef} style={{ height: "100vh", width: "100%" }}>
    </div>
    // <div className="w-full h-[100vh] relative">
    //   <iframe
    //     src="https://sportsbook.adjarabet.com/angular3/webcomponents?lang=ka"
    //     width="100%"
    //     height="100%"
    //   ></iframe>
    // </div>
  );
};

export default SportRemote;
