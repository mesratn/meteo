export simple-parse-his = ->
  parsed = (it / '\n')[1 to]
  parsed.map (/ '\t')

export full-parse-his = ->
  [header, ...lines] = simple-parse-his it
  for lines
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

export reduce = (fn, memo, xs) -->
  for x in xs
    memo := fn memo, x
  memo

export reduce1 = (fn, xs) -->
  reduce fn, xs.0, xs[1 to]

export sum = -> reduce1 (+), it

export avg = -> (sum it) / it.length
