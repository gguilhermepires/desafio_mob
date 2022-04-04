class ConversaoDadoGeografico {
 
  static extraiSomenteDataDataBanco(stringData: string) {
    let hora = stringData.split('T')[0];
    return `${hora?.split('-')[2]}/${hora?.split('-')[1]}/${hora?.split('-')[0]}`; 
  }

 static getDistanceFromLatLonInKm(position1:any, position2:any) {
    "use strict";
    var deg2rad = function (deg:any) { return deg * (Math.PI / 180); },
      R = 6371,
      dLat = deg2rad(position2.latitude - position1.latitude),
      dLng = deg2rad(position2.longitude - position1.longitude),
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(deg2rad(position1.latitude))
        * Math.cos(deg2rad(position1.latitude))
        * Math.sin(dLng / 2) * Math.sin(dLng / 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c * 1000).toFixed());
  }
}

export default ConversaoDadoGeografico;


