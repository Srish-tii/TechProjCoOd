
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
var router = express.Router();
var final='';
var finalNames=[];
var finalEmails=[];

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
		finalNames=[];
		finalNames=[];
		fs.readFile('./public/proj.html',"UTF-8",(err,html)=>{
			res.writeHead(200,{"Content-Type":"text/html"});
			res.end(html);

		});
	}
	else if(req.url === "/proj.html"){
		finalNames=[];
		finalNames=[];

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
		finalNames=[];
		finalNames=[];
			fs.readFile('./public/login.html',"UTF-8",(err,html)=>{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(html);
		});
			if(req.method==='POST'){
				final='';
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
										verify();	
									}
										
					 			})	
			
					 		function verify(){
					 			var sql=`select contact_id1 from email where email='${post.username}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									console.log(result[0].contact_id1);
									if(result[0].contact_id1.substring(0,2)=='CI')
										verifyInst(result[0].contact_id1);
									if(result[0].contact_id1.substring(0,2)=='CS')
										verifyStu(result[0].contact_id1);
					 			})
					 		}
					 		function verifyInst(value){
					 			var sql=`select inst_id from inst_personal_info where contact_id1='${value}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									console.log(result[0].inst_id);
									verifytwoinst(result[0].inst_id);
					 			})
					 		}
					 		function verifyStu(value){
					 			var sql=`select stu_id from stu_personal_info where contact_id1='${value}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									console.log(result[0].stu_id);
									verifytwostu(result[0].stu_id);
					 			})
					 		}
					 		function verifytwoinst(value){
					 			var sql=`select final_id from inst_project_pref where inst_id='${value}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									console.log(result[0].final_id);
									final=result[0].final_id;
									if(final!=null){
										if(final.charAt(1)=='2'){
											verifyinstinst(final);
										}
										if(final.charAt(1)=='3'){
											verifystuinst(final);
										}
									}
					 			})
					 		}
					 		function verifytwostu(value){
					 			var sql=`select final_id from stu_project_pref where stu_id='${value}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									console.log(result[0].final_id);
									final=result[0].final_id;
									if(final!=null){
										if(final.charAt(1)=='1'){
											verifystustu(final);
										}
										if(final.charAt(1)=='3'){
											verifystuinst(final);
										}
									}
					 			})
					 		}
					 		function verifystustu(value){
					 			var sql=`select stu_id from stu_stu_team where final_id2='${value}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									console.log(result);
									for(var i=0;i<result.length;i++){
										verifyfourss(result[i].stu_id);
									}
					 			})
					 		}
					 		function verifystuinst(value){
					 			var sql=`select stu_id,inst_id from stu_inst_team where final_id1='${value}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									verifyfours(result[0].stu_id);
									verifyfouri(result[0].inst_id);
					 			})
					 		}
					 		function verifyinstinst(value){
					 			var sql=`select inst_id from inst_inst_team where final_id3='${value}';`
					 			db.query(sql,(err,result)=>{
									if(err) throw err;
									console.log(result);
									for(var i=0;i<result.length;i++){
										verifyfourii(result[i].inst_id);
									}
					 			})
					 		}
					 		var i=0;
					 		var j=0;
					 		var k=0;
					 		function verifyfourss(value){
					 			var sql=`select stu_personal_info.name, email.email from stu_personal_info, email where stu_personal_info.stu_id='${value}' and email.contact_id1=stu_personal_info.contact_id1;`
					 			db.query(sql,(err,result)=>{
					 				if(err) throw err;
										finalNames[j]=result[0].name;
										finalEmails[j]=result[0].email;
										j=j+1;
									
					 			})
					 		}
					 		function verifyfours(value){
					 			
					 			var sql=`select stu_personal_info.name, email.email from stu_personal_info, email where stu_personal_info.stu_id='${value}' and email.contact_id1=stu_personal_info.contact_id1;`
					 			db.query(sql,(err,result)=>{
					 				if(err) throw err;
										finalNames[0]=result[0].name;
										finalEmails[0]=result[0].email;
										
									
					 			})
					 			console.log(finalNames[0]);
					 		}
					 		function verifyfouri(value){
					 			console.log(finalNames[0]);
					 			var sql=`select inst_personal_info.name, email.email from inst_personal_info, email where inst_personal_info.inst_id='${value}' and email.contact_id1=inst_personal_info.contact_id1;`
					 			db.query(sql,(err,result)=>{
					 				if(err) throw err;
										finalNames[1]=result[0].name;
										finalEmails[1]=result[0].email;									
					 			})
					 		}
					 		
					 		
					 		function verifyfourii(value){
					 			var sql=`select inst_personal_info.name, email.email from inst_personal_info, email where inst_personal_info.inst_id='${value}' and email.contact_id1=inst_personal_info.contact_id1;`
					 			db.query(sql,(err,result)=>{
					 				if(err) throw err;
					 				finalNames[i]=result[0].name;
					 				finalEmails[i]=result[0].email;
					 				i=i+1;

					 			})
					 		}



						})

		}
	}
	else if(req.url === "/loggedIn.html"){
			if(verified===true){

				if(final===null){
					res.writeHead(200,{"Content-Type":"text/html"});
					res.write('<!DOCTYPE html>'+
					'<html>'+
					'<head>'+
					    '<link rel="stylesheet" type="text/css" href="proj.css">'+
					   	'<title>Logged In</title>'+
					'</head>'+
					'<body id="signUp-body">'+
						'<h2>Perfect match for your project has not been found yet, please come back after some time!!</h2>'+
						'<button class="stu-inst" style="margin-top: 20px"><a href="proj.html">Logout'+'</a>'+'</button>'+
					'</body>'+
					'</html>');
					res.end();
										
				}
				else{
					res.writeHead(200,{"Content-Type":"text/html"});
					console.log(finalNames.length);

					if(finalNames.length==2){
					res.write('<!DOCTYPE html>'+'<html>'+
						'<head>'+
					    '<link rel="stylesheet" type="text/css" href="proj.css">'+
					   	'<title>Logged In</title>'+
						'</head>'+
				        '    <body id="bg-only" style="text-align:center; margin-top:10vh">'+      
				              '<h1>Welcome, your team is ready!</h1>'+
				              '<h2>Meet your team</h2>'+ 
				              '<table border="1" cellpadding = "5" cellspacing = "5" style="margin:auto">'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[0]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[0]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[1]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[1]
				              				+'</td>'+
				              		'</tr>'+
				          
				              '</table>'+'<button class="stu-inst" style="margin-top: 20px"><a href="proj.html">Logout'+'</a>'+'</button>'+
				        '</body>'+            
				        '</html>');
				}
				if(finalNames.length==3){
					res.write('<!DOCTYPE html>'+'<html>'+
						'<head>'+
					    '<link rel="stylesheet" type="text/css" href="proj.css">'+
					   	'<title>Logged In</title>'+
						'</head>'+
				        '    <body id="bg-only" style="text-align:center; margin-top:10vh;">'+      
				              '<h1 style="margin=-15px">Welcome, your team is ready!</h1>'+
				              '<h2>Meet your team</h2>'+ 
				              '<table border="1" cellpadding = "5" cellspacing = "5" style="margin:auto">'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[0]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[0]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[1]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[1]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[2]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[2]
				              				+'</td>'+
				              		'</tr>'+
				              		
				              '</table>'+'<button class="stu-inst" style="margin-top: 20px"><a href="proj.html">Logout'+'</a>'+'</button>'+
				        '</body>'+            
				        '</html>');
				}
				if(finalNames.length==4){
					res.write('<!DOCTYPE html>'+'<html>'+
						'<head>'+
					    '<link rel="stylesheet" type="text/css" href="proj.css">'+
					   	'<title>Logged In</title>'+
						'</head>'+
				        '    <body id="bg-only" style="text-align:center;margin-top:10vh">'+      
				              '<h1>Welcome, your team is ready!</h1>'+
				              '<h2>Meet your team</h2>'+ 
				              '<table border="1" cellpadding = "5" cellspacing = "5" style="margin:auto">'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[0]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[0]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[1]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[1]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[2]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[2]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Name : </td>'+
				              				'<td>'+
				              					finalNames[3]
				              				+'</td>'+
				              		'</tr>'+
				              		'<tr>'+
				              				'<td>Email : </td>'+
				              				'<td>'+
				              					finalEmails[3]
				              				+'</td>'+
				              		'</tr>'+
				              '</table>'+'<button class="stu-inst" style="margin-top: 20px"><a href="proj.html">Logout'+'</a>'+'</button>'+
				        '</body>'+            
				        '</html>');
				}
					res.end();
			}
				
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





// 	app.get('/',function(req,res){
//     connection.query('select * from student;', function(error,rows,fields,data)
//     {
//          if (!!error)
//   {
//       console.log('Error in the query');
//   }
//   else
//   {
//       console.log('successful');
//       //console.log(rows[1].name);
//       //res.send(rows[1].name);
//       var t=rows;
//       console.log(t);
//       res.render('display.ejs',{ t });
//   }
// });



    