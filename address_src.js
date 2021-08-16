const pi = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;


function bd09_To_Gcj02( bd_lat,  bd_lon) {
    let x = bd_lon - 0.0065, y = bd_lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
    let gg_lon = z * Math.cos(theta);
    let gg_lat = z * Math.sin(theta);
    return [gg_lat, gg_lon];
}
function gcj_To_Gps84( lat,  lon) {
    let gps = transform(lat, lon);
    let lontitude = lon * 2 - gps[1];
    let latitude = lat * 2 - gps[0];
    return  [latitude, lontitude];
}

function bd09_To_Gps84( bd_lat,  bd_lon) {
    let gcj02 = bd09_To_Gcj02(bd_lat, bd_lon);
    let map84 = gcj_To_Gps84(gcj02[0],gcj02[1]);
    return map84;

}

function transform( lat,  lon) {
    // if (outOfChina(lat, lon)) {
    //     return new GpsVo(lat, lon);
    // }
    let dLat = transformLat(lon - 105.0, lat - 35.0);
    let dLon = transformLon(lon - 105.0, lat - 35.0);
    let radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    let mgLat = lat + dLat;
    let mgLon = lon + dLon;
    return [mgLat, mgLon];
}

function transformLat( x,  y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
            + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon( x,  y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
            * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
            * pi)) * 2.0 / 3.0;
    return ret;
}