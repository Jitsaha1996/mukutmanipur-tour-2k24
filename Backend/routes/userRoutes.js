const express =require("express")
const router=express.Router();
const {registerUsers, authUsers,getUserList,editUsers,getUserByEmail}=require("../controllers/userController")
router.route('/').post(registerUsers);

router.route('/').get(getUserList);
router.route('/edit').put(editUsers);

router.route('/login').post(authUsers);
router.get('/email/:email', getUserByEmail);

// Catch-all route for any other request

module.exports=router;