const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 4001;

// Valid users
const validUsers = [
  { email: 'gopim@pronixinc.com', password: 'Admin@1234' },
  { email: 'rohithj@pronixinc.com', password: 'Admin@123' },
  { email: 'shivaniv@pronixinc.com', password: 'Admin@123' }
];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret:'retailbot-secret', resave:false, saveUninitialized:false }));
app.use(express.static(path.join(__dirname, 'public')));

// Enhanced products list
const products = [
  {id:1, name:'Wireless Mouse', price:25, category:'Accessories', image:'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/G309-Lightspeed-Gaming-Mouse/gallery/g309-lightspeed-wireless-mouse-white-gallery-1.png?v=1'},
  {id:2, name:'Bluetooth Headphones', price:599, category:'Audio', image:'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSridjkVi2_eUfQC2ivC3zWuZHTYVrJpy3PIxLPdiOAT8NS47JX7aXIU2MnS-42Ld69xXuVNSAwzTrYSeOzZ-D5CBioIuq4gGoXMJDNW33HbT0eWA8KKNzS7tlN_Qompguqeb4R8ps&usqp=CAc'},
  {id:3, name:'Smartwatch', price:120, category:'Wearables', image:'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRSDU12k7qj2DrRVEq8El7mIZCFmk7jj7MC8jvIEpZPbLSgZ_3FyULx4KNgdTpjAFzOcsjxDKyWEUDqjKgaTo7XwhI3b4HGxxN9Sv4DK4mH1FzSOJFm7UItQYtXDl-uIqgpTiI1_JEba3I&usqp=CAc'},
  {id:4, name:'USB-C Cable', price:10, category:'Accessories', image:'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSon5zPrYmTRmF1KzCunSNaBuyrmCb6Wvy4JMe5zUGS5f5yE_ZIX_5W5ieKxjZz_wNt0xCjkuGwJ15xom2_KB1XVm0bcX_0zWPuCahMVI33MlTO05RCMV3JUlO9bHoU2mg2gqEz0w&usqp=CAc'},
  {id:5, name:'Gaming Keyboard', price:80, category:'Gaming', image:'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQmPRaM61RCTBDI35C2mTNwHJcjipVHaVIYx9NoxoilVlfr1S2Zg5etD5pemPc1asixuxFCoYzXqns2trwR3rKz9Z628rs53Yu1EZIAxg&usqp=CAc'},
  {id:6, name:'Power Bank', price:35, category:'Accessories', image:'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSNPwxH-DYdzuSdRuv78vFQb6OkkOGcfK9p63MvNxwjqAGXx8OzamXzUmGdmqAjnd4fbUfuuBb1OAjRHpXxnK0WjJclJw7qaj96WqESYNxNoJvVKwj5zKs3vJ53ELHsZtUmk-Fyljw&usqp=CAc'},
  // Apple Computers
  {id:7, name:'MacBook Pro M2', price:1299, category:'Computers', brand:'Apple', image:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202'},
  {id:8, name:'MacBook Air M2', price:999, category:'Computers', brand:'Apple', image:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665'},
  {id:9, name:'MacBook Pro 16"', price:2499, category:'Computers', brand:'Apple', image:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229'},
  // Dell Computers
  {id:10, name:'Dell XPS 13', price:999, category:'Computers', brand:'Dell', image:'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/black/laptop-xps-9315-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full'},
  {id:11, name:'Dell XPS 15', price:1499, category:'Computers', brand:'Dell', image:'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9520/media-gallery/black/laptop-xps-15-9520-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full'},
  {id:12, name:'Dell Alienware x17', price:1999, category:'Computers', brand:'Dell', image:'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-x17-r2/media-gallery/black/laptop-alienware-x17-r2-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full'},
  // HP Computers
  {id:13, name:'HP Spectre x360', price:899, category:'Computers', brand:'HP', image:'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08145785.png'},
  {id:14, name:'HP Envy x360', price:799, category:'Computers', brand:'HP', image:'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08145786.png'},
  {id:15, name:'HP Omen 16', price:1299, category:'Computers', brand:'HP', image:'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08145787.png'},
  {id:16, name:'iPad Pro', price:799, category:'Tablets', image:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-model-select-gallery-2-202212?wid=5120&hei=2880&fmt=p-jpg&qlt=95&.v=1667591164218'}
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
  const {email, password} = req.body;
  const user = validUsers.find(u => u.email === email && u.password === password);
  
  if(user){
    req.session.email = email;
    req.session.cart = [];
    res.redirect('/home');
  } else {
    res.send('<h2>Invalid credentials</h2><a href="/login">Try again</a>');
  }
});

app.get('/logout', (req,res)=> { req.session.destroy(()=>res.redirect('/login')); });

function requireAuth(req,res,next){
  if(req.session.email){ next(); }
  else res.redirect('/login');
}

app.get('/home', requireAuth, (req,res)=> res.render('home', {title:'Home'}));
app.get('/products', requireAuth, (req, res) => {
  const searchQuery = req.query.search || '';
  const category = req.query.category || 'all';
  
  let filteredProducts = products;
  
  if (searchQuery) {
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  res.render('products', {
    title: 'Products',
    products: filteredProducts,
    searchQuery: searchQuery,
    category: category
  });
});
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

// Add search endpoint
app.get('/search', requireAuth, (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const category = req.query.category?.toLowerCase();
  
  let filteredProducts = products;
  
  if (query) {
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query)
    );
  }
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category
    );
  }
  
  res.json(filteredProducts);
});

// Add computers page route
app.get('/computers', requireAuth, (req, res) => {
  const searchQuery = req.query.search || '';
  const brand = req.query.brand || 'all';
  
  let filteredProducts = products.filter(product => product.category === 'Computers');
  
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  if (brand && brand !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.brand && product.brand.toLowerCase() === brand.toLowerCase()
    );
  }
  
  res.render('computers', {
    title: 'Computers & Laptops',
    products: filteredProducts,
    searchQuery: searchQuery,
    brand: brand
  });
});

// Add computers search endpoint
app.get('/computers/search', requireAuth, (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const brand = req.query.brand?.toLowerCase();
  
  let filteredProducts = products.filter(product => product.category === 'Computers');
  
  if (query) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      (product.brand && product.brand.toLowerCase().includes(query))
    );
  }
  
  if (brand && brand !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.brand && product.brand.toLowerCase() === brand
    );
  }
  
  res.json(filteredProducts);
});

app.listen(PORT, ()=>console.log('RetailBot running on port '+PORT));