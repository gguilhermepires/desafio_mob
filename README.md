# desafio_mob
## iniciar banco
npx sequelize-cli db:drop ; npx sequelize-cli db:create ; npx sequelize-cli db:migrate ;npx sequelize-cli db:seed:all


## gerar modelos automatico
npx sequelize-auto -o "./src/models" -d desafio -h localhost -u desafio -p 5434 -x desafio -e postgres -l ts --cm p -v --useDefine

## doc para cálculo de distância
https://cref.if.ufrgs.br/?contact-pergunta=calculo-aproximado-de-distancias-com-base-em-coordenadas-de-latitude-e-longitude


raiz( A^2 + B^2 ) = distancia km



A = difAbs(lat)* 111,1
B = fidAbs(long) * 96,2


function getDistanceFromLatLonInKm(position1, position2) {
    "use strict";
    var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        R = 6371,
        dLat = deg2rad(position2.lat - position1.lat),
        dLng = deg2rad(position2.lng - position1.lng),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(position1.lat))
            * Math.cos(deg2rad(position1.lat))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return ((R * c *1000).toFixed());
}

var distancia = (getDistanceFromLatLonInKm(
   {lat: -23.522490, lng: -46.736600},
   {lat: -23.4446654, lng: -46.5319316}
));

console.log(distancia);
