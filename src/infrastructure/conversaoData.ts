import debug from "debug";
//@ts-ignore
const log = debug('desafio:infrastrutura:conversordadta');
import moment from 'moment';
class ConversaoData {
  static extraiSomenteDataDataBanco(stringData: string) {
    let hora = stringData.split('T')[0];
    return `${hora?.split('-')[2]}/${hora?.split('-')[1]}/${hora?.split('-')[0]}`; 
  }

  static formataDataTelaParaDataBanco(data: any) {
    if(data == '')
      return null;
    //@ts-ignore

    return new Date(moment(data, 'DD/MM/YYYY'));
  }

  static buscaDataAgora(): Date {
    return new Date()
  }

  static formataDataParaString(data: Date): string {
    return `${data.getFullYear()}-${data.getMonth()}-${data.getDate()} ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
  }


  static formataHora(horaString: string) {
    if (horaString == '' || horaString == null || horaString == undefined)
      return null

    var hora = horaString.split(':')[0];
    var minuto = horaString.split(':')[1];

    var data = new Date(Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      //@ts-ignore
      hora,
      minuto,
      0, 0));
    return data;
  }

  static formataData(dataString: string, diminuiMes = false) {
    if (dataString == '' || dataString == null)
      return null;

    var lista = dataString.split('/');
    var ano = lista[2];
    var mes = lista[1];

    if (diminuiMes == true)
      //@ts-ignore
      mes = mes - 1;

    var dia = lista[0];
    var data = new Date(Date.UTC(
      //@ts-ignore
      ano,
      mes,
      dia)
    );
    return data;
  }

  static extraiHoraDataBanco(stringData: string) {
    try {
      if(stringData == null)
      return ''

    let hora = stringData.split('T')[1];
    return `${hora?.split(':')[0]}:${hora?.split(':')[1]}`;
    } catch (error) {
      return null;
    }
  }
}

export default ConversaoData;


