import jwt from 'jsonwebtoken'

export class TokenHelper {
  static generate(encode = {}, options = {}) {
    const payload = { nonce: this.nonce(), ...encode }
    return jwt.sign(payload, process.env.AUTH_KEY, options)
  }

  static verify(token) {
    const decode = jwt.verify(token, process.env.AUTH_KEY)
    return decode
  }

  static nonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}
