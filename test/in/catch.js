try {
  throw Error('test')
} catch (e) {
  console.log(e)
}

try {
  throw Error('test')
} catch {
  console.log('Error')
}

try {
  throw Error('test')
} finally {
  console.log('done')
}

try {
  throw Error('test')
} catch (e) {
  console.log(e)
} finally {
  console.log('done')
}

try {
  throw Error('test')
} catch {
  console.log('Error')
} finally {
  console.log('done')
}
