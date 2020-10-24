const express=require('express');
var fs=require('fs');
var http=require('http');
var path = require('path');
var app=express();
const mysql=require('mysql');
var url=require('url');
const bodyparser =require('body-parser');
const {parse}=require('querystring');

app.use(bodyparser.json);
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('./public'))
app.use(express.json());

const db=mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'SrishDb',
	database : 'proj'
});


db.connect((err)=>{
	if(!err)
		console.log('MySql connected');
	else
		throw err;
});

http.createServer((req,res)=>{

	if(req.url === "/"){

		fs.readFile('./public/proj.html',"UTF-8",(err,html)=>{
			res.writeHead(200,{"Content-Type":"text/html"});
			res.end(html);
	
		});
	}
	else if(req.url === "/proj.html"){
		fs.readFile('./public/proj.html',"UTF-8",(err,html)=>{
			res.writeHead(200,{"Content-Type":"text/html"});
			res.end(html);
	
		});
	}
	
	else if(req.url === "/signUp.html"){
			fs.readFile('./public/signUp.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
		});

	}
	else if(req.url === "/login.html"){

			fs.readFile('./public/login.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
		});

	}
	else if(req.url === "/student.html"){

			fs.readFile('./public/student.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
		});
		


		if(req.method==='POST'){
			let info= "";

			db.query('SELECT count (*) from stu_personal_info',(err, rows, fields)=>{
				if(!err)
				{
					console.log("counted");
				}
				else if(err)
					console.log(err);
			});

			req.on("data",function(chunk){
				info += chunk.toString();
			});

			req.on("end",function(){
				
			 	console.log(
			 			parse(info)
			 		);
			 	
				})
			for(const property in parse(info)) {
					console.log("property:",property);
			 		if(property=="name")
			 		{
			 			var sql=`INSERT INTO stu_personal_info (name) values ("${parse(info)[property]}")`;
			 			console.log("inserted");
				 		db.query(sql,(err,info)=>{
							if(err) throw err;
						})
			 		}
			 		// if(property=="dob")
			 		// {
			 		// 	var sql=`INSERT INTO stu_personal_info (dob) values ("${parse(info)[property]}")`;
				 	// 	db.query(sql,(err,info)=>{
						// 	if(err) throw err;
						// })
			 		// }
			 		// if(property=="city")
			 		// {
			 		// 	var sql=`INSERT INTO stu_personal_info (city) values ("${parse(info)[property]}")`;
				 	// 	db.query(sql,(err,info)=>{
						// 	if(err) throw err;
						// })
			 		// }

			 		// if(property=="project_id")
			 		// {
			 			
			 		// 	var sql=`INSERT INTO proj_domain_info (project_id) values ("${parse(info)[property]}")`;
				 	// 	db.query(sql,(err,info)=>{
						// 	if(err) throw err;
						// })
			 		// }

			 		// if(property=="perference")
			 		// {
			 		// 	var sql=`INSERT INTO team_info (perference) values ("${parse(info)[property]}")`;
				 	// 	db.query(sql,(err,info)=>{
						// 	if(err) throw err;
						// })
			 		// }
			 	
			};
		}
	}
	else if(req.url === "/instructor.html"){

			fs.readFile('./public/instructor.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
		});

	}
	else if(req.url === "/done.html"){

			fs.readFile('./public/done.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
		});

	}
	else if(req.url.match("\.css$")){
		var cssPath=path.join(__dirname,'public',req.url);
		var fileStream = fs.createReadStream(cssPath,"UTF-8");
		res.writeHead(200,{"Content-Type" : "text/css"});
		fileStream.pipe(res);
	}
	else if(req.url.match("\.js$")){
		var jsPath=path.join(__dirname,'public',req.url);
		var fileStream = fs.createReadStream(jsPath,"UTF-8");
		res.writeHead(200,{"Content-Type" : "text/js"});
		fileStream.pipe(res);
	}
	

}).listen(3000);





		// db.query('SELECT * FROM nameOnly',(err, rows, fields)=>{
		// if(!err)
		// {
		// 	console.log(rows);
		// 	console.log('YAYYYY');
		// }
		// else if(err)
		// 	console.log(err);
		// })
		// var sql = "INSERT INTO employees (id, name, age, city) VALUES ('1', 'Ajeet Kumar', '27', 'Allahabad')";  