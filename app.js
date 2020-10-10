const bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  expressSanitizer = require("express-sanitizer"),
	  mongoose = require("mongoose"),
	  express = require("express"),
	  app = express();

//APP CONFIG
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/restfull_blog_app', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//MONGOOSE/MODLE CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

Blog.create({
	title: "Test Blog",
	image: "https://cdn.akc.org/Marketplace/Breeds/Siberian_Husky_SERP.jpg",
	body: "Hello This Is A Blog Post!"
});

//RESTFULL ROUTS

app.get("/", (req, res) => {
	
	res.redirect("/blogs");
}),

	
	//index Rout
app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err){
			console.log("Error");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});
//NEW ROUT
app.get("/blogs/new", (req, res) => {
	res.render("new");	
});
//CREATE ROUT
app.post("/blogs", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs")
		}
	});
});

//SHOW ROUT
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}	
	});
});

//EDIT ROUT
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUT
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUT
app.delete("/blogs/:id", (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});


app.listen(3000, () => { 
  console.log('YelpCamp Server listening on port 3000'); 
});
