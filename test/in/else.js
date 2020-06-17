var n = 0

// Cuddled else in global scope
if (n > 0) {
  console.log('true')
} else {
  console.log("false")
}

/**
 * Test cuddled elses within a function
 */
function someFunc(value) {
  if (value) {
    if (value === 1) {
    } else if (value === 2) {
    } else {
    }
  } else if (value === 4) {
  } else {
  }
}
