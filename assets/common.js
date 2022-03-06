export function MoneyFormatter(num) {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');// '$' +
}

export function IsNull(val) {
    return val == null || val == undefined || val == NaN || val == "" || val == '' ? true : false;
}