export const validation = async (req, res, next) => {
  const error = true
  try {
    if (error) return res.status(401).send('Error: ')
    next()
  } catch (error) {
    return res.status(401).send('Error: ' + error.message)
  }
}
