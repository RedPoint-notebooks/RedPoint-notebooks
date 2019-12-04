export const LANGUAGES = ["Markdown", "Javascript", "Ruby", "Python"];
export const SIGTERM_ERROR_MESSAGE = `Timeout Error: the request to the server timed out.
              The maximum timeout threshold for server requests is currently 5 seconds.
              Check your code for infinite loops, or timeouts greater than the threshold.`;
const domain = window.location.host.split(".").splice(-2);
export const PROXY_URL = "http://www." + domain;
