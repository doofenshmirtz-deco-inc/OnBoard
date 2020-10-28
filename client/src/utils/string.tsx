import React from "react";

const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const TextToLinks = (text: string, color: string) => {
  return text.split(urlRegex).map((text, i) =>
    i % 2 === 0 ? (
      text
    ) : (
      <a style={{ color: color }} href={text} target="_blank">
        {text}
      </a>
    )
  );
};
