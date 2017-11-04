
import { webwxsendmsg } from './wbwx.js'

export const sendmsg = async ctx => {
  await webwxsendmsg(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket, ctx.Msg)
  // console.log(res)
  // console.log(ctx)
}
