interface TransferPatch {
  [from: string]: {
    [railway: string]: string;
  };
}

const transferPatch: TransferPatch = {
  'odpt.Station:Toei.Arakawa.OjiEkimae': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Oji',
  },
  'odpt.Station:Toei.Arakawa.OtsukaEkimae': {
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Otsuka',
  },
  'odpt.Station:Toei.Asakusa.Daimon': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Hamamatsucho',
    'odpt.Railway:JR-East.Yamanote':
      'odpt.Station:JR-East.Yamanote.Hamamatsucho',
  },
  'odpt.Station:Toei.Asakusa.Mita': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Tamachi',
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Tamachi',
  },
  'odpt.Station:Toei.Asakusa.Sengakuji': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.TakanawaGateway',
    'odpt.Railway:JR-East.Yamanote':
      'odpt.Station:JR-East.Yamanote.TakanawaGateway',
  },
  'odpt.Station:Toei.Mita.Hibiya': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Yurakucho',
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Yurakucho',
  },
  'odpt.Station:Toei.Mita.Mita': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Tamachi',
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Tamachi',
  },
  'odpt.Station:Toei.Oedo.Daimon': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Hamamatsucho',
    'odpt.Railway:JR-East.Yamanote':
      'odpt.Station:JR-East.Yamanote.Hamamatsucho',
  },
  'odpt.Station:Toei.Oedo.UenoOkachimachi': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Okachimachi',
    'odpt.Railway:JR-East.Yamanote':
      'odpt.Station:JR-East.Yamanote.Okachimachi',
  },
  'odpt.Station:Toei.Shinjuku.Iwamotocho': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Akihabara',
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Akihabara',
    'odpt.Railway:MIR.TsukubaExpress':
      'odpt.Station:MIR.TsukubaExpress.Akihabara',
  },
  'odpt.Station:MIR.TsukubaExpress.Akihabara': {
    'odpt.Railway:Toei.Shinjuku': 'odpt.Station:Toei.Shinjuku.Iwamotocho',
  },
  'odpt.Station:TamaMonorail.TamaMonorail.TachikawaKita': {
    'odpt.Railway:JR-East.ChuoRapid':
      'odpt.Station:JR-East.ChuoRapid.Tachikawa',
    'odpt.Railway:JR-East.Nambu': 'odpt.Station:JR-East.Nambu.Tachikawa',
    'odpt.Railway:JR-East.Ome': 'odpt.Station:JR-East.Ome.Tachikawa',
  },
  'odpt.Station:TamaMonorail.TamaMonorail.TachikawaMinami': {
    'odpt.Railway:JR-East.ChuoRapid':
      'odpt.Station:JR-East.ChuoRapid.Tachikawa',
    'odpt.Railway:JR-East.Nambu': 'odpt.Station:JR-East.Nambu.Tachikawa',
    'odpt.Railway:JR-East.Ome': 'odpt.Station:JR-East.Ome.Tachikawa',
  },
  'odpt.Station:JR-East.ChuoRapid.Tachikawa': {
    'odpt.Railway:TamaMonorail.TamaMonorail':
      'odpt.Station:TamaMonorail.TamaMonorail.TachikawaKita',
  },
  'odpt.Station:JR-East.KeihinTohokuNegishi.TakanawaGateway': {
    'odpt.Railway:Toei.Asakusa': 'odpt.Station:Toei.Asakusa.Sengakuji',
  },
  'odpt.Station:JR-East.Nambu.Tachikawa': {
    'odpt.Railway:TamaMonorail.TamaMonorail':
      'odpt.Station:TamaMonorail.TamaMonorail.TachikawaKita',
  },
  'odpt.Station:JR-East.Ome.Tachikawa': {
    'odpt.Railway:TamaMonorail.TamaMonorail':
      'odpt.Station:TamaMonorail.TamaMonorail.TachikawaKita',
  },
  'odpt.Station:JR-East.Yamanote.TakanawaGateway': {
    'odpt.Railway:Toei.Asakusa': 'odpt.Station:Toei.Asakusa.Sengakuji',
  },
  'odpt.Station:TokyoMetro.Chiyoda.Hibiya': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Yurakucho',
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Yurakucho',
  },
  'odpt.Station:TokyoMetro.Chiyoda.MeijiJingumae': {
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Harajuku',
  },
  'odpt.Station:TokyoMetro.Fukutoshin.MeijiJingumae': {
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Harajuku',
  },
  'odpt.Station:TokyoMetro.Ginza.UenoHirokoji': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Okachimachi',
    'odpt.Railway:JR-East.Yamanote':
      'odpt.Station:JR-East.Yamanote.Okachimachi',
  },
  'odpt.Station:TokyoMetro.Hibiya.Hibiya': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Yurakucho',
    'odpt.Railway:JR-East.Yamanote': 'odpt.Station:JR-East.Yamanote.Yurakucho',
  },
  'odpt.Station:TokyoMetro.Hibiya.NakaOkachimachi': {
    'odpt.Railway:JR-East.KeihinTohokuNegishi':
      'odpt.Station:JR-East.KeihinTohokuNegishi.Okachimachi',
    'odpt.Railway:JR-East.Yamanote':
      'odpt.Station:JR-East.Yamanote.Okachimachi',
  },
};

export default transferPatch;
