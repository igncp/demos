global.ui = casper

ui.test.begin('Pie Chart tests.', (test)->
  (require '../fixtures/functional-init')()

  ui.start(urls.home).then(()-> 
    test.assertEquals casper.status().currentHTTPStatus, 200, 'Page is loaded'

  )
  
  ui.run(()-> test.done())
)