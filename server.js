const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/FreshMart',(err,database) => {
	if (err) return console.log(err)
	db = database.db('FreshMart')
	app.listen(4000,()=>{
		console.log('Listening at port number 4000')
	})
})
app.set('view-engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

 
app.get('/', (req,res)=>{
		db.collection('Products').find().toArray((err,result)=>{
			if(err) return console.log(err)
				res.render('Homepage.ejs', {data:result})
		})
})

app.get('/Add',(req,res)=>{
	res.render('Add.ejs')
})

app.get('/Update',(req,res)=>{
	res.render('Update.ejs')
})

app.get('/Delete',(req,res)=>{
	res.render('Delete.ejs')
})

app.post('/Addproduct',(req,res)=>
{
	db.collection('Products').save(req.body,(err,result)=>{
		if(err) return console.log(err)
	res.redirect('/')
	})
})

app.post('/update',(req,res)=>{
	db.collection('Products').find().toArray((err,result)=>{
		if(err) 
			return console.log(err)
		for(var i=0;i<result.length;i++)
		{
			if(result[i].title==req.body.id)
			{
				q = result[i].quanitity
				p = result[i].price
				break
			}
		}
		db.collection('Products').findOneAndUpdate({title: req.body.id}, {
		$set: {quanitity: parseInt(q)+parseInt(req.body.quanitity)}},{sort: {_id:-1}},
		(err,result) =>{
			if(err)
				return console.log(err)
		})
		db.collection('Products').findOneAndUpdate({title: req.body.id}, {
		$set: {price: parseInt(p)+parseInt(req.body.price)}},{sort: {_id:-1}},
		(err,result) =>{
			if(err)
				return console.log(err)
		})
		res.redirect('/')
	})
})

app.post('/delete',(req,res)=>
{
	db.collection('Products').findOneAndDelete({title:req.body.id},(err,result)=>{
		if(err) return console.log(err)
	res.redirect('/')
	})
})

	
			


