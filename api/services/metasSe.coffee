_ = require 'lodash'
util = require 'util'

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
    }

    metas
  )
}