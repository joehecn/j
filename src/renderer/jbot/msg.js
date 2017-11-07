
import { webwxsendmsg, webwxuploadmedia, webwxsendmsgimg } from './wbwx.js'

export const sendmsg = async ctx => {
  await webwxsendmsg(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket, ctx.Msg)
}

export const sendimg = async ctx => {
  let res = await webwxuploadmedia(ctx.BaseRequest, ctx.passTicket, ctx.webwxDataTicket, ctx.file, ctx.FileMd5, ctx.buf, ctx.Msg)
  ctx.Msg.MediaId = res.MediaId
  await webwxsendmsgimg(ctx.BaseRequest, ctx.passTicket, ctx.Msg)
}
