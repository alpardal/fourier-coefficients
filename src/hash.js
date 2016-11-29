
const Hash = {
  add(params) {
    this.set(Object.assign(this.get(), params));
  },

  set(params) {
    const hash = Object.keys(params)
                       .map((key) => `${key}=${params[key]}`)
                       .join("&");
    window.location.hash = hash;
  },

  clear(key) {
    const current = this.get();
    delete current[key];
    this.set(current);
  },

  get() {
    return window.location.hash.substring(1)
                 .split("&").reduce((obj, keyVal) => {
       const [key, val] = keyVal.split("=");
       obj[key] = val;
       return obj;
    }, {});
  }
};


export default Hash;
