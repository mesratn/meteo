generate-data = (lines, idx) ->
  min = max = +lines.0[idx]
  hour-vals = []
  mins = []
  maxs = []
  avgs = []
  last-hour = 1
  for line, i in lines
    val = +line[idx]
    if val is val
      min <?= val
      max >?= val
      hour-vals.push val

    hour = Math.ceil ++i / 720
    if hour isnt last-hour or i is lines.length
      last-hour := hour

      mins.push min
      maxs.push max
      avgs.push if hour-vals then avg hour-vals else 0

      min := max := +line[i + 1]?[idx]
      hour-vals := []
  [mins, maxs, avgs]

line = (color, title, value) ->
  ...: {color, value}
  width: 1
  zIndex: 2
  label:
    text: title

details = angular.module('meteo.details', [])
details.controller 'DetailsCtrl', ($state-params, $scope, $http) !->
  file = loadFiles![$state-params.id]
  unless file?
    alert "No such file"
    return
  $scope.graph = header-index: 0
  $http.get file.url
    ..error -> alert if it? then "Error: #it" else "Erreur interne"
    unparsed <- ..success
    [header, ...lines] = simple-parse-his unparsed
    $scope.title = lines?0?0

    $scope.headers = header[1 to]
    $scope.headerIndex = 0
    var graph1, graph2
    colors = Highcharts.get-options!colors
    do $scope.draw = ->
      graph1?destroy!
      graph2?destroy!
      [mins, maxs, avgs] = generate-data lines, $scope.graph.header-index + 1
      graph1 = Highcharts.chart 'graph-first' do
        title: '1st chart'
        yAxis:
          plotLines:
            * line \red \Min Math.min ...mins
            * line \green \Max Math.max ...maxs
            * line \blue \Moy avg avgs
        xAxis:
          title:
            text: 'Date/heure'
          categories: [1 to 24]
        series:
          * name: 'Min'
            data: mins
          * name: 'Max'
            data: maxs
          * name: 'Moy'
            data: avgs

      graph2 = Highcharts.chart 'graph-second' do
        title:
          text: '2nd chart'
        chart:
          zoom-type: \x
        xAxis:
          categories: [1 to 24]
        plot-options:
          area:
            fill-color:
              linear-gradient:
                x1: 0
                y1: 0
                x2: 0
                y2: 1
              stops:
                * [0 colors.0]
                * [1, Highcharts.color colors.0 .set-opacity 0 .get 'rgba']
            marker:
              radius: 2
            line-width: 1
            states:
              hover:
                line-width: 1
            treshold: null
        series:
          * type: 'area'
            name: 'Moy'
            data: avgs
            color: '#0000ff'
          ...
