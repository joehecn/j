
const fs = require('fs')

const {
  getPayload,
  getEndData
} = require('../../../../src/main/robot/webwxapi/upload/requestPayload.js')

const fields = require('../../../../helper/mockFields.js')

const payload = '------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="id"\r\n\r\nWU_FILE_0\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="name"\r\n\r\n139-150210134411-50.jpg\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="type"\r\n\r\nimage/jpeg\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="lastModifiedDate"\r\n\r\nFri Jul 20 2018 13:24:20 GMT+0800 (中国标准时间)\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="size"\r\n\r\n230564\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="mediatype"\r\n\r\npic\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="uploadmediarequest"\r\n\r\n{"UploadType":2,"BaseRequest":{"Uin":3642174990,"Sid":"qSgQFieSWCmGMZRD","Skey":"@crypt_a397bd88_b0945ff5f1aba01119c1e1106997d25a","DeviceID":"e808605742951793"},"ClientMediaId":1532492161816,"TotalLen":230564,"StartPos":0,"DataLen":230564,"MediaType":4,"FromUserName":"@de4ade84dc30ab63dbe61d2d4bddf8874e0a3dbb733cf2ba4a69537725d0b368","ToUserName":"@a5c43f042d5dbd1ed7c41fe6da91d6169f01d82c999b6f44ae1c6568139dbd55","FileMd5":"4208bc3e0c19a22a73c2085e732bfe98"}\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="webwx_data_ticket"\r\n\r\ngSflnrFZ/KCV4dN4gNWBZdnT\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="pass_ticket"\r\n\r\nundefined\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM\r\nContent-Disposition: form-data; name="filename"; filename="139-150210134411-50.jpg"\r\nContent-Type: image/jpeg\r\n\r\n'

const endData = '\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM--\r\n'

const boundaryStatic = '----WebKitFormBoundarycpRyN1SIuBsnjbfM'
const bothEnds = '--'

describe('requestPayload.js', () => {
  test('txt === payload + endData', () => {
    expect.assertions(1)

    const txt = fs.readFileSync('helper/requestPayload.txt', 'utf8')
      .replace(/\n/g, '\r\n')

    // fs.writeFileSync(
    //   'helper/output.js',
    //   'const res = ' + JSON.stringify(txt)
    // )

    expect(txt).toBe(payload + endData)
  })

  test('res === payload', () => {
    expect.assertions(1)

    const res = getPayload(bothEnds, boundaryStatic, fields)

    expect(res).toBe(payload)
  })

  test('res === endData', () => {
    expect.assertions(1)
    
    const res = getEndData(bothEnds, boundaryStatic)

    expect(res).toBe(endData)
  })
})
