const express =require("express")
const router=express.Router();
const app = express();
const {registerUsers, authUsers,getUserList,editUsers}=require("../controllers/userController")
router.route('/').post(registerUsers);

router.route('/').get(getUserList);
router.route('/login').post(authUsers);
router.route('/edit').put(editUsers);
app.use(express.static(path.join(__dirname, '..', '..', 'Web', 'build'))); // Adjust path to the build folder

// Catch-all route for any other request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Web', 'build', 'index.html')); // Adjust path to index.html
});

module.exports=router;