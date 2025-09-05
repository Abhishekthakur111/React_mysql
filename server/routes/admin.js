var express = require('express');
var router = express.Router();
const auth = require('../controller/admincontroller/authcontroller');
const authtoken = require('../middleware/authtoken');
const usercontroller = require('../controller/admincontroller/usercontroller');
const lenderController = require('../controller/admincontroller/lenderController');
const categorycontroller = require('../controller/admincontroller/categorycontroller');
const contactUsController = require('../controller/admincontroller/contactUsController');
const cmsController = require('../controller/admincontroller/cmsController');
const productController = require('../controller/admincontroller/productController');
const bookingController = require('../controller/admincontroller/bookingController');
const transactionController = require('../controller/admincontroller/transactionController');
const ratingController = require('../controller/admincontroller/ratingController');



router.post('/signup',auth.signup);
router.post('/login',auth.login);
router.use(authtoken.verifyToken);  
router.get('/profile',auth.profile);
router.post('/updateprofile',auth.edit_profile);
router.post('/updatepassword',auth.reset_password);
router.post('/logout',auth.logout);
router.get('/dashboard',auth.dashboard);
router.post('/chartdata',auth.chartData);

// router for users
router.get('/userlist',usercontroller.userlist_get);
router.get('/userdetail/:id',usercontroller.userDetail);
router.post('/userstatus',usercontroller.userStatus);
router.post('/userdelete/:id',usercontroller.userDelete);

// router for lenders
router.get('/lenderlist',lenderController.LenderList);
router.get('/lenderdetail/:id',lenderController.lenderDetail);
router.post('/lenderstatus',lenderController.lenderStatus);
router.post('/lenderdelete/:id',lenderController.lenderDelete);

// router for categories
router.post('/createcategory',categorycontroller.createCategory);
router.get('/categorylist',categorycontroller.Categorylist);
router.get('/categorydetail/:id',categorycontroller.categoryDetail);
router.post('/categorystatus',categorycontroller.categoryStatus);
router.post('/categorydelete/:id',categorycontroller.categoryDelete);
router.post('/categoryupdate/:id',categorycontroller.categoryUpdate);



// router for contact us
router.get('/contactList',contactUsController.contactGet);
router.get('/contactDetail/:id',contactUsController.contactView);  
router.post('/contact/:id',contactUsController.contactDelete);

// router for cms
router.get('/privacypolicy',cmsController.privacy_policy);
router.post('/privacypolicy',cmsController.privacypolicy);    
router.get('/aboutus',cmsController.aboutus);
router.post('/aboutus',cmsController.updateabout);      
router.get('/termsconditions',cmsController.term);
router.post('/termsconditions',cmsController.updateterm);


// router for products
router.get('/productlist',productController.productList);
router.post('/createproduct',productController.productCreate);
router.get('/productdetail/:id',productController.productDetail);
router.post('/productdelete/:id',productController.productDelete);
router.post('/productstatus',productController.updateProductStatus);

// router for bookings
router.get('/bookinglist',bookingController.bookinglist);
router.get('/bookingdetail/:id',bookingController.bookingDetail);
router.post('/bookingstatus',bookingController.updateBookingStatus);
router.post('/bookingdelete/:id',bookingController.bookingDelete);

// router for transactions
router.get('/transactionlist',transactionController.transactionList);
router.get('/transactiondetail/:id',transactionController.transactionDetail);
router.post('/transactiondelete/:id',transactionController.transactionDelete);

// router for ratings
router.get('/ratinglist',ratingController.ratingList);
router.get('/ratingdetail/:id',ratingController.ratingDetail);
router.post('/ratingdelete/:id',ratingController.ratingDelete);


module.exports = router;
