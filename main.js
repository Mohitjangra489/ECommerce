const { json } = require('body-parser');
const e = require('express');
const express = require('express');
var session = require('express-session');
let logincheck = false;
const fs = require('fs');
const { join } = require('path');
const app = express();
const port = 3000;

const initdb = require('./database/init');
initdb();

const userModel = require('./database/users');
const productModel = require('./database/products');
const cartModel1 = require('./database/cart');
const cartModel2 = require('./database/cart');


let temp = "";
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

const sendmail = require("./methods/sendmail");


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));


app.get('/', function (req, res) {


    if (req.session.islogged === true && req.session.isvarified === true) {

        productModel.find({}, (err, data) => {
            let orders = data;
          
            if (req.session.count < orders.length) {
             
                res.render("mainpage.ejs", ({ user: req.session.activeuser, orders: orders.slice(0, req.session.count) }));
            }
            else {
                res.render("mainpage.ejs", ({ user: req.session.activeuser, orders: orders.slice(0, req.session.count) }));
            }


        });
    }
    else {
        res.redirect("/login");
    }

});


app.get("/login", function (req, res) {

    if (req.session.islogged === true && req.session.isvarified === true) {
        res.redirect("/");
    }
    else {

        res.render("login.ejs", { error: temp, isvarified: 1 });
    }
});

app.post("/login", function (req, res) {
    let logindata = req.body;

    userModel.find({ username: logindata.username }, (err, doc) => {
        if (doc.length == 0) {
            res.render("login.ejs", { error: "user not found!", isvarified: 1 });
            return;
        }
        else {
            console.log("entered")
            let newdata = doc[0];
            if (newdata.isvarified === false) {
                if (newdata.username == logindata.username && newdata.password == logindata.password && newdata.OTP == logindata.OTP) {
         
                    req.session.islogged = true;
                    req.session.count = 5;
                    req.session.activeuser = newdata.username;
                    req.session.isvarified = true;

                    logincheck = true;

 
                    userModel.updateOne({ username: logindata.username }, { isvarified: true }, function (err, data) {

                    });

                    res.redirect("/");
                    logincheck = false;
                    return;
                }
                else {
                    if (logincheck === false && newdata.username == logindata.username) {
                        res.render("login.ejs", { error: "User Not varified!", isvarified: newdata.isvarified });
                        return;

                    }
                }


            }
            else {
                console.log("error")
                if (newdata.username == logindata.username && newdata.password == logindata.password) {

                    console.log("error123")

                    req.session.count = 5;
                    req.session.activeuser = newdata.username;
                    logincheck = true;
                    req.session.isvarified = true;
                    req.session.islogged = true;
                console.log(req.session.isvarified)
                    res.redirect("/");
                    return;
                }
                else {
                    if (logincheck === false && newdata.username == logindata.username) {
                        res.render("login.ejs", { error: "Invalid Credentials", isvarified: newdata.isvarified });
                        return;
                    }
                }

            }
        };
    });
});


app.get("/signup", function (req, res) {
    if (req.session.islogged === true && req.session.isvarified === true) {
        res.redirect("/");
    }
    else {
        res.render("signup", { error: temp });
    }
});


app.post("/signup", function (req, res) {

    let { username, password, email, mobile } = req.body;



    userModel.find({}, (err, data) => {
        if (err) {
            res.render("signup", { error: "user not found!" });
            return;
        }
        else {
            let users = data;
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                if (user.username === username) {
                    res.render("signup", { error: "user already exists!" });
                    return;
                }
            }
            let user = {
                username: username,
                password: password,
                email: email,
                mobile: mobile,
                isvarified: false,
                OTP: parseInt(Math.random() * 1000000)
            }


            sendmail(email, user.OTP, function (err, data) {
                if (err) {
                    res.render("signup", { error: "something went wrong" });
                    return;
                }
                let newuser = new userModel(user);
                newuser.save();
                req.session.islogged = true;
                req.session.activeuser = user;
                res.redirect("/login");
            })
        }
    });
});


app.get("/home", function (req, res) {
    res.render("home");
})

app.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/login");
    logincheck = false;


});

app.get("/loadproduct", function (req, res) {

    req.session.count += 5;

    res.redirect("/");

});

app.get("/update", function (req, res) {
    res.render("changepassword.ejs", { error: "" });

});

app.post("/update", function (req, res) {

    userModel.find({ username: req.body.username }, (err, doc) => {
        if (doc.length == 0) {
            res.render("changepassword.ejs", { error: "user not found!", isvarified: 1 });
           
            return;
        }
        else {
            let filedata = doc[0];

            if (filedata.username == req.body.username && filedata.password == req.body.password) {
                let newpassword = req.body.Newpassword;
                userModel.updateOne({ username: req.body.username }, { password: newpassword }, function (err, data) {
                });
                res.render("changepassword.ejs", { error: "Password Changed Successfully" });
            }
            else {
                
                res.render("changepassword.ejs", { error: "Invalid Credentials!" });
                return;
            }
        }
    });
});

app.get("/Cart", function (req, res) {
    
    if (req.session.islogged === true) {
        cartModel1.findOne({ username: req.session.activeuser }, function (err, data) {
            if (data) {
                let finalData = data.cartitem.length;
                if (finalData) {
                    let cart = data.cartitem;
                    res.render("cart.ejs", { user: req.session.activeuser, cart });
                }
                else {
                    res.render("cart.ejs", { user: req.session.activeuser, cart: [] });
                }
            }
            else {
                res.render("cart.ejs", { user: req.session.activeuser, cart: [] });
            }
        })
    }
    else {
        res.redirect("/");
    }

});


app.post("/cart", function (req, res) {
    let id = req.query.id;
    let src = req.query.src;
    let price = req.query.price;

    let cartModel21 = new cartModel1();
    let ab = new cartModel2();
    ab = {
        id,
        src,
        price,
        quantity: 1
    }
    cartModel21.username = req.session.activeuser;
  

    cartModel1.findOne({ username: req.session.activeuser }, function (err, cart) {
        if (!cart) {
            cartModel21.cartitem.push(ab);
            cartModel21.save();
        }
        else {
            let duplicateFlag = false;
            for (let i = 0; i < cart.cartitem.length; i++) {
                if (cart.cartitem[i].id == req.query.id) {
                    duplicateFlag = true;
                }
            }
            if (!duplicateFlag) {

                cartModel21.cartitem.push(ab);
                cart.cartitem.push(ab);
                cartModel1.updateOne({ username: req.session.activeuser }, { cartitem: cart.cartitem }, function (err, result) {
                })
            }
        
        }
    })
    res.redirect("/");
})


app.post("/minuscart", function (req, res) {

  

    cartModel1.find({ username: req.session.activeuser }, (err, doc) => {
       
        let id = req.body.id;
        let username = req.session.activeuser;
        let cartdata = doc[0];

        let newData = cartdata.cartitem;
    
        newData.forEach(function (elem, idx) {
          
            if (elem.id == id) {
              
                if (elem.quantity > 1) {
                    // elem.quantity--;
                    let oneUnit = Math.floor((parseInt(elem.price))/elem.quantity)
                    newData[idx].quantity--;
                    Price = (parseInt(elem.price))-oneUnit
                    elem.price = `${Price.toString()}`
    
                }
                cartModel1.updateOne({ username: req.session.activeuser }, { cartitem: newData }, function (err, data) {
                  
                })
  
                res.end(JSON.stringify({quantity:elem.quantity,price:elem.price}));
            }
        })
    });
});

app.post("/pluscart", function (req, res) {

    cartModel1.find({ username: req.session.activeuser }, (err, doc) => {

        let id = req.body.id;
        let username = req.session.activeuser;
        let cartdata = doc[0];

        let newData = cartdata.cartitem;

        newData.forEach(function (elem, idx) {
            if (elem.id == id) {
              
               
                let oneUnit = Math.floor((parseInt(elem.price))/elem.quantity)
                newData[idx].quantity++;
                Price = (parseInt(elem.price))+oneUnit
                elem.price = `${Price.toString()}`
           
                cartModel1.updateOne({ username: req.session.activeuser }, { cartitem: newData }, function (err, data) {
                 
                })
                res.end(JSON.stringify({quantity:elem.quantity,price:elem.price}));
            }
        })
    });
});


app.post("/delete", function (req, res) {
    let id = req.query.id;

    cartModel1.findOne({ username: req.session.activeuser }, function (err, data) {
        let newData = data.cartitem;
   
        newData.forEach(function (elem, idx) {
            if (elem.id == id) {
                newData.splice(idx, 1);
                return;
            }
        })
        cartModel1.updateOne({ username: req.session.activeuser }, { cartitem: newData }, function (err, data) {
        })
        res.redirect("/cart");
    })
})


app.get("/details", function (req, res) {
    let id = req.query.id;

    productModel.find({}, (err, data) => {
        let details = data;
        res.send(details[id]);

    });
});


app.get("*", function (req, res) {
    res.sendStatus(404);
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

