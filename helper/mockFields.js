
const filename = '139-150210134411-50.jpg'
const type = 'image/jpeg'
const lastModifiedDate = 'Fri Jul 20 2018 13:24:20 GMT+0800 (中国标准时间)'
const uploadmediarequest = '{"UploadType":2,"BaseRequest":{"Uin":3642174990,"Sid":"qSgQFieSWCmGMZRD","Skey":"@crypt_a397bd88_b0945ff5f1aba01119c1e1106997d25a","DeviceID":"e808605742951793"},"ClientMediaId":1532492161816,"TotalLen":230564,"StartPos":0,"DataLen":230564,"MediaType":4,"FromUserName":"@de4ade84dc30ab63dbe61d2d4bddf8874e0a3dbb733cf2ba4a69537725d0b368","ToUserName":"@a5c43f042d5dbd1ed7c41fe6da91d6169f01d82c999b6f44ae1c6568139dbd55","FileMd5":"4208bc3e0c19a22a73c2085e732bfe98"}'

module.exports = [
  { name: 'id', value: 'WU_FILE_0' },
  { name: 'name', value: filename },
  { name: 'type', value: type },
  { name: 'lastModifiedDate', value: lastModifiedDate },
  { name: 'size', value: '230564' },
  { name: 'mediatype', value: 'pic' },
  { name: 'uploadmediarequest', value: uploadmediarequest },
  { name: 'webwx_data_ticket', value: 'gSflnrFZ/KCV4dN4gNWBZdnT' },
  { name: 'pass_ticket', value: 'undefined' },
  { name: 'filename', filename, type }
]
