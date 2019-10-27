const parseRubyOutput = output => {
  let regexp = /(=> )(\S)(\s\d.\d.\d\s:\d{3}) >$/g;
  return [...output.matchAll(regexp)][0][2];
};
