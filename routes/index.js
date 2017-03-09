var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/update', function(req, res, next) {
  res.send('update route');
              fs.appendFile('log.txt', new Date().toLocaleString() + 'update route requested\n', function(err) {
                if (err) {
                    return console.log(err);
                }
            });
});

router.post('/update', function(req, res) {
			text = JSON.stringify(req.body,null, '\t');
            fs.appendFile('log.txt', text, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
			
			var webhook = spawn('./webhook.sh');
            webhook.stderr.on('data', function(data) {
                log_error(data);
                res.status(500).send('stderr: ' + data);
            });
			webhook.on('close', function(data) {
				res.sendStatus(200);
        });

});
function log_error(new_error) {
    var error = new Date().toLocaleString() + " - " + new_error.message + "\n";
    fs.appendFile('error.txt', error, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}
module.exports = router;
