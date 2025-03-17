var express = require('express');
var router = express.Router();
const auth = require('../controller/admincontroller/authcontroller');
const authtoken = require('../middleware/authtoken');
const usercontroller = require('../controller/admincontroller/usercontroller');
const categorycontroller = require('../controller/admincontroller/categorycontroller');
const subCategoriesController = require('../controller/admincontroller/subCategoriesController');
const bookingcontroller = require('../controller/admincontroller/bookingcontroller');
const contactUsController = require('../controller/admincontroller/contactUsController');
const cmsController = require('../controller/admincontroller/cmsController');

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

// router for categories
router.post('/createcategory',categorycontroller.createCategory);
router.get('/categorylist',categorycontroller.Categorylist);
router.get('/categorydetail/:id',categorycontroller.categoryDetail);
router.post('/categorystatus',categorycontroller.categoryStatus);
router.post('/categorydelete/:id',categorycontroller.categoryDelete);
router.post('/categoryupdate/:id',categorycontroller.categoryUpdate);

// router for subcategories
router.post('/createsubcategory',subCategoriesController.subCategoryCreate);
router.get('/subcategorylist',subCategoriesController.subCategoryList);
router.get('/subcategorydetail/:id',subCategoriesController.subCategoryDetail);
router.post('/subcategorystatus',subCategoriesController.updateSubcategoryStatus);    
router.post('/subcategorydelete/:id',subCategoriesController.subCategoryDelete); 
router.post('/subcategoryupdate/:id',subCategoriesController.updateSubcategory);

// router for bookings
router.get('/bookinglist',bookingcontroller.bookinglist);
router.get('/bookingdetail/:id',bookingcontroller.bookingDetail);
router.post('/updatebookingstatus',bookingcontroller.updateBookingStatus);
router.post('/bookingdelete/:id',bookingcontroller.bookingDelete);

// router for contact us
router.get('/contactList',contactUsController.contact_get);
router.get('/contactDetail/:id',contactUsController.contact_view);  
router.post('/contact/:id',contactUsController.contact_delete);

// router for cms
router.get('/privacypolicy',cmsController.privacy_policy);
router.post('/privacypolicy',cmsController.privacypolicy);    
router.get('/aboutus',cmsController.aboutus);
router.post('/aboutus',cmsController.updateabout);      
router.get('/terms&conditions',cmsController.term);
router.post('/terms&conditions',cmsController.updateterm);

module.exports = router;
