'use strict'

const axios = require('axios')
const CHATWORK_URL = 'https://api.chatwork.com/v2'
module.exports = class Chatwork {
  set apiToken (apiToken) {
    this._apiToken = apiToken
  }

  get apiToken () {
    return this._apiToken || process.env.CHATWORK_API_TOKEN
  }

  getRequestHeaders () {
    return {
      'X-ChatWorkToken': this.apiToken
    }
  }

  checkApiToken (headers) {
    if (!headers['X-ChatWorkToken']) {
      throw new Error('Chatwork API Token is not set.')
    }
  }

  saveRateLimits (headers) {
    const rateLimits = Object.entries(headers)
      .filter(([key, value]) => key.startsWith('x-ratelimit'))
      .map(([key, value]) => [key, Number(value)])
    this._rateLimits = Object.fromEntries(rateLimits)
  }

  async get (uri, params = {}) {
    const requestHeaders = this.getRequestHeaders()
    this.checkApiToken(requestHeaders)
    const { data, headers } = await axios.get(CHATWORK_URL + uri, {
      headers: requestHeaders,
      params
    })
    this.saveRateLimits(headers)
    return data
  }

  async post (uri, params = {}) {
    const requestHeaders = this.getRequestHeaders()
    this.checkApiToken(requestHeaders)
    const { data, headers } = await axios.post(CHATWORK_URL + uri, new URLSearchParams(params), {
      headers: {
        ...requestHeaders,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    this.saveRateLimits(headers)
    return data
  }

  async delete (uri, params = {}) {
    const requestHeaders = this.getRequestHeaders()
    this.checkApiToken(requestHeaders)
    const { data, headers } = await axios.delete(CHATWORK_URL + uri, {
      headers: requestHeaders,
      params
    })
    this.saveRateLimits(headers)
    return data
  }

  async put (uri, params = {}) {
    const requestHeaders = this.getRequestHeaders()
    this.checkApiToken(requestHeaders)
    const { data, headers } = await axios.put(CHATWORK_URL + uri, new URLSearchParams(params), {
      headers: {
        ...requestHeaders,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    this.saveRateLimits(headers)
    return data
  }

  async getMe () {
    return await this.get('/me')
  }

  async getMyStatus () {
    return await this.get('/my/status')
  }

  /**
     * Add new message to the chat
     * @param roomId
     * @param params
     */
  async postRoomMessage (roomId, params) {
    return await this.post(`/rooms/${roomId}/messages`, params)
  }
}
