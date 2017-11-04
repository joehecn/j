
import { webwxsendmsg } from './wbwx.js'

export const sendmsg = async ctx => {
  const res = await webwxsendmsg(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket, ctx.Msg)
  console.log(res)
  console.log(ctx)
}
