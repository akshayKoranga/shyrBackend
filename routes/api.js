var express = require('express');
var multer = require('multer');
var upload = multer();
let uploadS3 = require('../Middleware/storage.js')('shyr-cloud');


var eventController = require('../controller/Api/EventController');
var homeController = require('../controller/Api/HomeController');
var gameController = require('../controller/Api/GamePlayController');
var userController = require('../controller/Api/userController');
var gameControllerNew = require('../controller/Api/GamePlayControllerNew');
var auth = require('../Middleware/CheckSession');

var router = express.Router();

router.use(function (req, res, next) {
    req.header('Content-Type', 'application/json');
    next();
});

router.get('/', homeController.showHome);
router.post('/login', upload.array(), homeController.login);
router.post('/signup', upload.array(), homeController.signup);
router.post('/changePassword', [upload.array(), auth.appAuth], homeController.changePassword);
router.post('/forgotPassword', upload.array(), homeController.forgotPassword);
router.get('/resetPassword/:token', homeController.showResetPassword);
router.post('/resetPassword', homeController.resetPassword);

// router.get('/events', auth.appAuth, eventController.showEvents);
// router.get('/upcoming-events', auth.appAuth, eventController.upcomingEvents);

router.get('/hints', auth.appAuth, eventController.showHints);

// router.get('/user_code',gameController.checkUserCode);

router.get('/assets/img/:folder/:image/:w?/:h?', homeController.imageProcess);


/** GAME ROUTES */
router.get('/game/:lang/start_game', auth.appAuth, gameController.getGame);
router.get('/fun-game', auth.appAuth, gameController.getFunGame);

// router.get('/:lang/testing_game', gameControllerNew.testing_fun);
// router.get('/:lang/testing_game', authmiddleware.auth_route, (req, res) => {
// })
router.put('/game/:lang/update_game_play', auth.appAuth, gameController.updateResult);
router.get('/game/:lang/get_user_record', auth.appAuth, gameController.allUserRecord);

//------------- event api ----------------
router.get('/event/:lang/upcoming_events', auth.appAuth, eventController.upcomingEvents);
router.get('/event/:lang/all_events', auth.appAuth, eventController.showEvents);
router.get('/event/:lang/ongoing_events', auth.appAuth, eventController.ongoingEvents);
router.post('/event/:lang/add_booster_pack', auth.appAuth, eventController.addBoosterPack);


//--------------  user api ---------------
var Upload = uploadS3.fields([{ // define params for s3 upload  
    name: 'user_invoice_image'
  }]);
router.post('/user/:lang/add_invoice', auth.appAuth, Upload, userController.addInvoice);








/** END */

/**
 * New Game flow changes in structure and api modes
 */
//console.log('uuuuuu');process.exit()
router.use('/:lang/game_new', gameControllerNew());

module.exports = router;