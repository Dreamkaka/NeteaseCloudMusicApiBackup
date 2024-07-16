const createOption = require('../util/option.js')

module.exports = async (query, request) => {
  // 设置请求时的cookie信息
  query.cookie.os = 'pc'

  // 构造请求的数据体
  const data = {
    ids: JSON.stringify([query.id]),
    br: parseInt(query.br || 320000), // 默认比特率320kbps
  }

  // 发送POST请求获取歌曲信息
  const res = await request(
    'POST',
    `/api/song/enhance/player/url`,
    data,
    createOption(query),
  )

  // 检查响应状态和数据有效性
  if (
    res.status === 200 &&
    res.body &&
    res.body.code === 200 &&
    res.body.data.length > 0
  ) {
    const songUrl = res.body.data[0].url
    if (songUrl) {
      // 如果URL有效，返回URL以供重定向
      return {
        status: 200, // HTTP状态码302表示重定向
        body: {
          code: 200,
          data: { url: songUrl },
        },
      }
    } else {
      // 如果没有有效的URL，返回错误信息
      return {
        status: 404,
        body: {
          code: 404,
          message: 'Song URL not found',
        },
      }
    }
  } else {
    // 如果API调用失败或返回的数据不正确，返回错误信息
    return {
      status: 404,
      body: {
        code: 404,
        message: 'Song not found or API error',
      },
    }
  }
}
