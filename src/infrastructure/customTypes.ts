import UserAccount from "src/models/user/account";

export type pinturaCacheServer = {
      dataEmissao: string | null,
      tipoDeOs: string | null,
      numeroOs: string | null,
      status: string | null,
      horaPrevistaInicio: string | null,
      horaPrevistaFim: string | null,
      horaRealInicio: string | null,
      horaRealFim: string | null,
      produtividadeHistorica: string | null,
      produtividadeMediaPrevista: string | null,
      produtividadeMediaReal: string | null,
      justificativa: string | null,
      comentario: string | null
};


export type userCacheServer = {
      nome: string | null,
      email: string | null,
      token: string | null,
      userAccount: UserAccount | null,
      roles: any | null,
      grants: any | null
};

export type EmailResetPasswordContentType = {
      subject: string;
      from: string;
      html: string;
      to: string;
      text: string
}


