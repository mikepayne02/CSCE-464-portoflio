export default (value: number): string => {
  if (value < 1000) {
    return value.toString()
  }

  const suffixes = ['', 'k', 'm', 'b', 't']
  const suffixNum = Math.floor(('' + value).length / 3)
  if (suffixNum > 4) return value.toString()
  let shortValue = 0

  for (var precision = 2; precision >= 1; precision--) {
    shortValue = parseFloat(
      (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
        precision
      )
    )
    var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '')
    if (dotLessShortValue.length <= 2) {
      break
    }
  }

  if (shortValue % 1 != 0) return shortValue.toFixed(1) + suffixes[suffixNum]
  return shortValue + (suffixes[suffixNum] ?? '')
}
