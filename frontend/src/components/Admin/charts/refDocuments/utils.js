export function cumnormdist(x) {
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const p = 0.2316419;
    const c = 0.39894228;

    if (x >= 0.0) {
        const t = 1.0 / (1.0 + p * x);
        return (1.0 - c * Math.exp( -x * x / 2.0 ) * t *
        ( t *( t * ( t * ( t * b5 + b4 ) + b3 ) + b2 ) + b1 ));
    } else {
        const t = 1.0 / (1.0 - p * x);
        return ( c * Math.exp( -x * x / 2.0 ) * t *
        ( t *( t * ( t * ( t * b5 + b4 ) + b3 ) + b2 ) + b1 ));
    }
}


export function number_format(number, decimals = 0, decPoint = '.', thousandsSep = ',') {
    let n = parseFloat(number);
    let prec = parseInt(decimals);
  
    n = !isFinite(+n) ? 0 : n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
  
    let s = (prec > 0) ? n.toFixed(prec) : Math.round(n).toString();
    let abs_n = Math.abs(n);
    let decimalPos = s.indexOf('.');
    if (decimalPos === -1) {
      decimalPos = s.length;
    } else {
      s = s.replace('.', decPoint);
    }
  
    if (abs_n >= 1000) {
      let thousandsPos = decimalPos - 3;
      while (thousandsPos > 0) {
        s = s.slice(0, thousandsPos) + thousandsSep + s.slice(thousandsPos);
        thousandsPos -= 3;
      }
    }
  
    return s;
  }
  