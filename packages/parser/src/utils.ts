export function isNewLine(code: number) {
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
}

// Actually, identifiers are case-sensitive and can contain Unicode letters, $, _, 
// and digits (0-9), but may not start with a digit.
// Acorn has some logic about Unicode, but now, we don't care about Unicode letters.
export function isIdentifierChar(code: number) {
  if (code < 48) return code === 36 // $
  if (code < 58) return true // 0-9
  if (code < 65) return false // 
  if (code < 91) return true // A-Z
  if (code < 97) return code === 95 // _
  if (code < 123) return true // a-z

  return false
}

export function isIdentifierStart(code: number) {
  if (code < 65) return code === 36
  if (code < 91) return true
  if (code < 97) return code === 95
  if (code < 123) return true

  return false
}

const keywords = 'break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super'
export function wordsRegexp() {
  return new RegExp('^(?:' + keywords.replace(/ /g, '|') + ')$')
}