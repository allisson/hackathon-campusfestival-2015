var express = require('express');
var router = express.Router();
var request = require('request');
var Converter = require('csvtojson').Converter;

/* Index. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/obterDespesas', function(req, res, next) {
  if (req.body.exercicio && req.body.mes && req.body.orgao && req.body.tipor) {
    request.post(
      'http://appcge.pb.gov.br/siafweblivre/DespesaConsolidadaImpressao', {
        form: {
          exercicio: req.body.exercicio,
          mes: req.body.mes,
          orgao: req.body.orgao,
          tipo: 'csv',
          tipor: req.body.tipor
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
              res.json(result);
            }
          });
        } else {
          res.status(500).json({
            error: 'erro ao obter a despesa'
          });
        }
      }
    );
  } else {
    res.status(400).json({
      error: 'parâmetros em falta'
    });
  }

});

module.exports = router;
