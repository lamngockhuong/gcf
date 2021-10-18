const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(path.resolve(__dirname), '.env') })

const { isEmpty } = require('lodash')
const Chatwork = require('./utils/chatwork')
const { logger } = require('./utils/log')
const { compileTemplate } = require('./utils/template')
const chatwork = new Chatwork()

exports.monitoringHttp = async (req, res) => {
  try {
    const data = req.body
    logger.info(JSON.stringify(data))
    if (isEmpty(data)) {
      throw new Error('Request body is required')
    }

    handleError(data)

    res.status(200).send({ timestamp: new Date(), success: true, message: 'Success' })
  } catch (error) {
    logger.error(error.message)
    res.status(400).send({ timestamp: new Date(), success: false, message: error.message })
  }
}

async function handleError (data) {
  if (data.incident) {
    await sendChatworkAlert(data.incident)
  }
}

async function sendChatworkAlert (data) {
  if (!process.env.CHATWORK_LOG_ALERT || !process.env.CHATWORK_API_TOKEN || !process.env.CHATWORK_ROOM || !process.env.CHATWORK_RECEIVERS) {
    logger.warn(`Please setting chatwork information:
      [CHATWORK_LOG_ALERT=${process.env.CHATWORK_LOG_ALERT}
      ; CHATWORK_ROOM=${process.env.CHATWORK_ROOM}
      ; CHATWORK_RECEIVERS=${process.env.CHATWORK_RECEIVERS}
      ; CHATWORK_API_TOKEN=${process.env.CHATWORK_API_TOKEN ? 'Set' : 'Unset'}]`)
  }

  if (process.env.CHATWORK_LOG_ALERT === 'true') {
    const message = compileTemplate('chatwork-log-alert.tmpl', {
      project_id: data.scoping_project_id,
      policy_name: data.policy_name,
      started_at: new Date(data.started_at * 1000).toLocaleString(),
      summary: data.summary,
      url: data.url,
      receivers: process.env.CHATWORK_RECEIVERS
    })
    await chatwork.postRoomMessage(process.env.CHATWORK_ROOM, {
      body: message,
      self_unread: 0
    })
    logger.info(`Send message to chatwork: [${process.env.CHATWORK_ROOM}] ${JSON.stringify(message)}`)
  }
}
