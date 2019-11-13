import React from "react";
import ReactMarkdown from "react-markdown";

const RenderedMarkdown = props => {
  return (
    <ReactMarkdown
      className="rendered-markdown"
      source={props.code}
      escapeHtml={true}
    />
  );
};

export default RenderedMarkdown;
