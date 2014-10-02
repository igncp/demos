_ = require 'lodash'
util = require 'util'

YAML = require 'yamljs'
metasFile = YAML.load 'api/info/metas.yml'

module.exports = {
  getMetas: ((category, key, isHome = false)->
    commonTitle = 'Data Visualization Examples · Demos'
    metas = {
      title: (->
        if isHome then return commonTitle
        else
          info = demosInfoSe.getInfo(category, key)
          return info.name + ' Chart · ' + commonTitle
      )()
      description: ( ->
        if isHome then return metasFile['home']['description']
        else
          if metasFile[category][key]
            return metasFile[category][key].description
          else
            return ''
      )()
    }

    metas
  )
}