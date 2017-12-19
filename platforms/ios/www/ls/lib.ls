export simple-parse-his = ->
  parsed = (it / '\n')[1 to]
  parsed.map (/ '\t')

export full-parse-his = ->
  for simple-parse-his it
    {[key, ..[i]] for key, i in header}

export load-files = ->
  try
    if local-storage.get-item 'files'
      return JSON.parse that or []
  return []

export any = (pred, xs) -->
  for x in xs
    return true if pred x
  return false

export exists = (col, value, xs) -->
  any (.[col] is value), xs

export removeAt = (xs, idx) -->
  xs.splice idx, 1
