import cookie from 'react-cookies'
export const formatDate = () => {
    const _m = new Date()
    const year = _m.getFullYear();
    const month = _m.getMonth() + 1 < 10 ? '0' + (_m.getMonth() + 1) : _m.getMonth() + 1
    const day = _m.getDate()

    const hh = _m.getHours()
    const mm = _m.getMinutes()
    const ss = _m.getSeconds() < 10 ? '0' + _m.getSeconds() : _m.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss;
}

export const getCookie = () => ({ personId: cookie.load('wnPersonId'), personName: cookie.load('wnPersonName') || '游客' })

export const checkPersonId = (personId) => {
    return /\d{7}/.test(personId);
}
