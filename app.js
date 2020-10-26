
const express=require('express');
var fs=require('fs');
var http=require('http');
var path = require('path');
var app=express();
const mysql=require('mysql');
var url=require('url');
const bodyparser =require('body-parser');
const {parse}=require('querystring');
var lodash= require('lodash');
const val= require('./public/student.js');
var verified=false;
const swal=require('sweetalert');
var router = express.Router();

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
	if(!err){
		console.log('MySql connected');
	}

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
			if(req.method==='POST'){
				var sql='DELETE FROM tempCheck';
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})	
				let info= "";
				
				req.on("data",function(chunk){
					info += chunk.toString();
				});

				req.on("end",function(){
					
						var post = {parse}.parse(info);
					 	console.log(parse(info));

					 	var sql=`INSERT INTO tempCheck (username,password) values ('${post.username}','${post.password}')`;
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})	
					 	
					 	var checkPassword='SELECT password.password from password, tempCheck where password.email=tempCheck.username and password.password=tempCheck.password;';
					 	db.query(checkPassword,(err,result)=>{
								if(err) throw err;
									if(result.length==0)
									{
										verified=false;
										console.log("Wrong password");
										swal("wrong password");	
									}
									else{
										verified=true;
										
									}
										
					 			})	
			

						})


		}
	}
	else if(req.url === "/loggedIn.html"){
			if(verified===true){
				console.log("verified");
				fs.readFile('./public/loggedIn.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
		});
	}
			

	}
	else if(req.url === "/student.html"){

			fs.readFile('./public/student.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
			});
		
			
		if(req.method==='POST'){

			let info= "";
			
			req.on("data",function(chunk){
				info += chunk.toString();
			});

			req.on("end",function(){

				var count='SELECT count (*) as total from stu_personal_info';
				var stuid="";
				var eduid="";
				var cid="";
				var val="";
				db.query(count,(err,result)=>{
					if(err){
						throw err;
					}
					else{
						setValue(result[0].total+1)
					}
				});
				function setValue(value){
					val=value;
					stuid+=('ST'+val).toString();
					eduid+=('E'+val).toString();
					cid+=('CS'+val).toString();
					var post = {parse}.parse(info);
				 	console.log(parse(info));

				 	var sql=`INSERT INTO email (contact_id1,email) values ('${cid}','${post.email}')`;
				 	db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})
				 	
				 	var sql=`INSERT INTO stu_edu_info (edu_id,highest_qualification,current_edu) values ('${eduid}','${post.highest_qualification}','${post.current_edu}')`;
				 	db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})
				 	
				 	var sql=`INSERT INTO contact_info (number,contact_id1) values ('${post.numberOne}','${cid}')`;
				 	db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})
				 	var sql=`INSERT INTO contact_info (number,contact_id1) values ('${post.numberTwo}','${cid}')`;
				 	db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})
				 	
				 	var sql=`INSERT INTO stu_personal_info (stu_id,name,dob,city,contact_id1,edu_id) values ('${stuid}','${post.name}','${post.dob}','${post.city}','${cid}','${eduid}')`; 	
				 	db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})
					
					var sql=`INSERT INTO stu_project_pref (stu_id, project_id, team_id, proj_time, difficulty_lvl) values ('${stuid}','${post.project_id}','${post.team_id}','${post.proj_time}','${post.difficulty_lvl}')`;
					db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})
					
					var sql=`INSERT INTO password (email, password, confirm_password) values ('${post.email}','${post.password}', '${post.confirm_password}')`;
				 	db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})
				 }
				})


					// for(const property in parse(info)) {
					// 		console.log("property:",property);
					//  		if(property=="name")
					//  		{
					//  			var sql=`INSERT INTO stu_personal_info (name) values ("${parse(info)[property]}")`;
					//  			console.log("inserted");
					// 	 		db.query(sql,(err,info)=>{
					// 				if(err) throw err;
					// 			})
					//  		}
			 		// if(property=="dob")
			 		// {
			 		// 	var sql=`INSERT INTO stu_personal_info (dob) values ("${parse(info)[property]}")`;
				 	// 	db.query(sql,(err,info)=>{
						// 	if(err) throw err;
						// })
			 		// }
			 		
		}
	}
	else if(req.url === "/instructor.html"){

			fs.readFile('./public/instructor.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
			});

			if(req.method==='POST'){

				let info= "";
				
				req.on("data",function(chunk){
					info += chunk.toString();
				});

				req.on("end",function(){

					var count='SELECT count (*) as total from inst_personal_info';
					var inid="";
					var eduid="";
					var cid="";
					var val="";
					db.query(count,(err,result)=>{
						if(err){
							throw err;
						}
						else{
							setValue(result[0].total+1)
						}
					});
					function setValue(value){
						val=value;
						inid+=('IN'+val).toString();
						eduid+=('IE'+val).toString();
						cid+=('CI'+val).toString();
						var post = {parse}.parse(info);
					 	console.log(parse(info));

					 	var sql=`INSERT INTO inst_edu_info (inst_edu,highest_qualification,teaching_exp,current_profession) values ('${eduid}','${post.highest_qualification}','${post.teaching_exp}','${post.current_profession}')`;
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})

					 	var sql=`INSERT INTO email (contact_id1,email) values ('${cid}','${post.email}')`;
				 		db.query(sql,(err,info)=>{
							if(err) throw err;
				 			})

					 	var sql=`INSERT INTO contact_info (number,contact_id1) values ('${post.numberOne}','${cid}')`;
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})

					 	var sql=`INSERT INTO contact_info (number,contact_id1) values ('${post.numberTwo}','${cid}')`;
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})
					 				 	
					 	var sql=`INSERT INTO inst_personal_info (inst_id,name,dob,city,contact_id1,inst_edu) values ('${inid}', '${post.name}','${post.dob}','${post.city}','${cid}','${eduid}')`; 	
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})
					
						var sql=`INSERT INTO inst_project_pref (inst_id,team_id,project_id,proj_time,difficulty_lvl) values ('${inid}','${post.team_id}','${post.project_id}','${post.proj_time}','${post.difficulty_lvl}')`;
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})

					 	var sql=`INSERT INTO password (email, password, confirm_password) values ('${post.email}','${post.password}', '${post.confirm_password}')`;
					 	db.query(sql,(err,info)=>{
								if(err) throw err;
					 			})
					 }
					
					})

		}
	}
	else if(req.url === "/done.html"){
			console.log(val.nameVal);
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