const reverseString = chars => {
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left += 1;
    right -= 1;
  }

  return chars;
};

//Test Cases:
reverseString(["h", "e", "l", "l", "o"]); // Return: ["o","l","l","e","h"]

reverseString(["H", "a", "n", "n", "a", "h"]); // Return: ["h","a","n","n","a","H"]
