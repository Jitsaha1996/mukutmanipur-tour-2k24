const express =require("express")
const router=express.Router();
const {registerUsers, authUsers,getUserList,editUsers,getUserByEmail,paymentInfoForFamilyWidse,forgetpasswords}=require("../controllers/userController")
router.route('/').post(registerUsers);

router.route('/').get(getUserList);
router.route('/edit').put(editUsers);

router.route('/login').post(authUsers);
router.route('/paymentinfo').put(paymentInfoForFamilyWidse);
router.route('/forgetPassword').put(forgetpasswords);
router.get('/email/:email', getUserByEmail);

// Catch-all route for any other request

module.exports=router;