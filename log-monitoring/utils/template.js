'use strict'

const fs = require('fs')
const path = require('path')
const templateDir = path.join(__dirname, '../statics')

exports.compileTemplate = (templateName, options) => {
  const content = fs.readFileSync(`${templateDir}/${templateName}`, 'utf8')
  return content
    .toString()
    .replace('#[project_id]', options.project_id)
    .replace('#[policy_name]', options.policy_name)
    .replace('#[summary]', options.summary)
    .replace('#[started_at]', options.started_at)
    .replace('#[url]', options.url)
    .replace('#[receivers]', options.receivers)
}
