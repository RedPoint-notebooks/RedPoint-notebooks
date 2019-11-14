export const LANGUAGES = ["Markdown", "Javascript", "Ruby", "Python"];
export const LOWERCASE_LANGUAGES = ["markdown", "javascript", "ruby", "python"];
export const capitalizeLanguage = language =>
  language.charAt(0).toUpperCase() + language.slice(1);
