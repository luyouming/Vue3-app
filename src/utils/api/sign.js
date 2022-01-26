let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

function n2s(n) {
  return letters[n];
}

let sings = [];
// 签名 秘钥 第二个是抢票API支持的
const signArr = {
  touch: [
    "sign",
    "SL00CAADD0C711E746HFA16@&9$3E16FE2F4*&^64EFD0C711E785B1FALEE16FE2F*8$9",
  ],
  wxmp: [
    "sign",
    "SL00CAADD0C711E746HFA16@&9$3E16FE2F4*&^64EFD0C711E785B1FALEE16FE2F*8$9",
    "SL00CAADD0C711E746HFA16@&9$3E16FE2F4*&^64EFD0C711E785B1FALEE16FE2F*8$9",
  ],
};
const CURRENT_CHANNEL = process.env.VUE_APP_CHANNEL;
const sign = signArr[CURRENT_CHANNEL];
if (sign) {
  sign.forEach(function (val) {
    let ks = [];
    for (let i = 0; i < val.length; i += 1) {
      ks.push(String(val.charCodeAt(i)).replace(/\d/g, n2s));
    }
    sings.push(ks);
  });
}

export default sings;
