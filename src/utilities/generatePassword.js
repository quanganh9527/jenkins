export default function generatePassword(l) {
  if (typeof l === 'undefined') { l = 8; }
  /* c : alphanumeric character string */
  var c = 'abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ12345679',
    // n = c.length,
    /* p : special character string */
    p = '!@#$+-*&_',
    o = p.length,
    r = '',
    n = c.length,
    /* s : determinate the position of the special character */
    s = Math.floor(Math.random() * (p.length - 1));

  for (var i = 0; i < l; ++i) {
    if (s === i) {
      /* special charact insertion (random position s) */
      r += p.charAt(Math.floor(Math.random() * o));
    } else {
      /* alphanumeric insertion */
      r += c.charAt(Math.floor(Math.random() * n));
    }
  }
  return r;
}