const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 4001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret:'retailbot-secret', resave:false, saveUninitialized:false }));
app.use(express.static(path.join(__dirname, 'public')));

// Dummy products
const products = [
  {id:1,name:'Wireless Mouse',price:25,image:'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/G309-Lightspeed-Gaming-Mouse/gallery/g309-lightspeed-wireless-mouse-white-gallery-1.png?v=1'},
  {id:2,name:'Bluetooth Headphones',price:599,image:'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSridjkVi2_eUfQC2ivC3zWuZHTYVrJpy3PIxLPdiOAT8NS47JX7aXIU2MnS-42Ld69xXuVNSAwzTrYSeOzZ-D5CBioIuq4gGoXMJDNW33HbT0eWA8KKNzS7tlN_Qompguqeb4R8ps&usqp=CAc'},
  {id:3,name:'Smartwatch',price:120,image:'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRSDU12k7qj2DrRVEq8El7mIZCFmk7jj7MC8jvIEpZPbLSgZ_3FyULx4KNgdTpjAFzOcsjxDKyWEUDqjKgaTo7XwhI3b4HGxxN9Sv4DK4mH1FzSOJFm7UItQYtXDl-uIqgpTiI1_JEba3I&usqp=CAc'},
  {id:4,name:'USB-C Cable',price:10,image:'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSon5zPrYmTRmF1KzCunSNaBuyrmCb6Wvy4JMe5zUGS5f5yE_ZIX_5W5ieKxjZz_wNt0xCjkuGwJ15xom2_KB1XVm0bcX_0zWPuCahMVI33MlTO05RCMV3JUlO9bHoU2mg2gqEz0w&usqp=CAc'},
  {id:5,name:'Gaming Keyboard',price:80,image:'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQmPRaM61RCTBDI35C2mTNwHJcjipVHaVIYx9NoxoilVlfr1S2Zg5etD5pemPc1asixuxFCoYzXqns2trwR3rKz9Z628rs53Yu1EZIAxg&usqp=CAc'},
  {id:6,name:'Power Bank',price:35,image:'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSNPwxH-DYdzuSdRuv78vFQb6OkkOGcfK9p63MvNxwjqAGXx8OzamXzUmGdmqAjnd4fbUfuuBb1OAjRHpXxnK0WjJclJw7qaj96WqESYNxNoJvVKwj5zKs3vJ53ELHsZtUmk-Fyljw&usqp=CAc'}
];

// Middleware to pass login/cart info to all views
app.use((req,res,next)=>{
  res.locals.loggedIn = !!req.session.email;
  res.locals.email = req.session.email;
  res.locals.cartCount = req.session.cart ? req.session.cart.reduce((a,b)=>a+b.qty,0):0;
  next();
});

app.get('/', (req,res)=> res.redirect('/login'));

app.get('/login', (req,res)=> res.render('login', { title:'Login' }));

app.post('/login', (req,res)=>{
  const {email,password} = req.body;
  if(email==='gopim@pronixinc.com' && password==='Admin@1234'){
    req.session.email = email;
    req.session.cart = [];
    res.redirect('/home');
  }else{
    res.send('<h2>Invalid credentials</h2><a href="/login">Try again</a>');
  }
});

app.get('/logout', (req,res)=> { req.session.destroy(()=>res.redirect('/login')); });

function requireAuth(req,res,next){
  if(req.session.email){ next(); }
  else res.redirect('/login');
}

app.get('/home', requireAuth, (req,res)=> res.render('home', {title:'Home'}));
app.get('/products', requireAuth, (req,res)=> res.render('products', {title:'Products', products}));
app.post('/add-to-cart', requireAuth, (req,res)=>{
  const id = parseInt(req.body.id,10);
  const product = products.find(p=>p.id===id);
  if(!product){ return res.redirect('/products'); }
  req.session.cart = req.session.cart || [];
  const existing = req.session.cart.find(c=>c.id===id);
  if(existing) existing.qty += 1;
  else req.session.cart.push({ ...product, qty:1 });
  res.redirect('/cart');
});
app.get('/cart', requireAuth, (req,res)=> res.render('cart',{title:'Cart', cart:req.session.cart || []}));

app.listen(PORT, ()=>console.log('RetailBot running on port '+PORT));