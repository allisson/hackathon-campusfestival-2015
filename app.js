var fs = require('fs');
var request = require('request');
var Converter = require("csvtojson").Converter;

// dados que serão coletados
var requisicoes = [
  {exercicio: 2014, mes: 1, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 2, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 3, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 4, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 5, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 6, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 7, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 8, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 9, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 10, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 11, orgao: -1, tipor: 10},
  {exercicio: 2014, mes: 12, orgao: -1, tipor: 10},
]

var getDespesa = function(exercicio, mes, orgao, tipor) {
  request.post(
    'http://appcge.pb.gov.br/siafweblivre/DespesaConsolidadaImpressao', {
      form: {
        exercicio: exercicio,
        mes: mes,
        orgao: orgao,
        tipo: 'csv',
        tipor: tipor
      }
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // removendo o header do csv
        body = body.substring(body.indexOf('\n') + 1);

        // iniciando o Converter para parsear csv -> json
        var converter = new Converter({
          delimiter: ';',
          noheader: true,
          headers: [
            'codigo', 'descricao', 'executada', 'realizada', 'saldo_a_pagar'
          ]
        });

        // csv -> json
        converter.fromString(body, function(error, result) {
          if (!error) {
            // salvado o json no disco
            var fileName = 'despesas_' + exercicio + '_' + mes + '.json'
            fs.writeFile(fileName, JSON.stringify(result), function(error) {
              if (!error) {
                console.log('Arquivo salvo: ' + fileName);
              }
            });
          }
        });
      }
    }
  );
};

// inicia coleta de dados
requisicoes.forEach(function(item){
  getDespesa(item.exercicio, item.mes, item.orgao, item.tipor);
});
