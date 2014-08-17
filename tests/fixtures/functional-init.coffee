module.exports = (()->
  ui.on('remote.message', (msg)-> ui.echo('* Remote error: ' + msg, 'WARNING'); )
  ui.on('remote.error', (msg)-> ui.echo('* Remote error: ' + msg, 'WARNING'); )
  ui.on('resource.error', (err)-> ui.echo('* Remote error: ' + err.errorString , 'WARNING') )

  global.fixtures = require '../fixtures/fixtures'
  global.urls = fixtures.urls

  global.Faker = require '/usr/lib/node_modules/faker/' # Couldn't load it otherwise
)