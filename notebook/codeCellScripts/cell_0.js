const factorial = (num) => {
  if (num === 0 || num === 1) {
    return 1
  }
   num * factorial(num - 1)
}

console.log(factorial(5))
