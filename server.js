const express = require("express");
const app = express();
const fs= require('fs');

app.use(express.json());



app.get("/",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))

	res.send(data)
})	``


app.get("/courses",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))

	let main_course=[]
	for (i of data){
		let main_dict={}
		let name=i.name
		let id=i.id
		let description=i.description
		main_dict["id"]=id
		main_dict["name"]=name
		main_dict["description"]=description
		main_course.push(main_dict)
	
	}res.send(main_course)
})



app.get("/one_course/:id",(req,res )=>{
	const data = JSON.parse(fs.readFileSync("data.json"))

	for (i of data){
		if (req.params.id==i.id){
			res.send(i)
		}
	}
})


app.get("/course/:id",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))

	let id=req.params.id
	let one_course=data[id-1]
	delete one_course["submission"]
	res.send(one_course)
})

app.post("/course",(req,res)=>{
	let course={
		"id":data.length+1,
		"name":req.body.name,
		"description":req.body.description,
		"submission":[]
	}
	data.push(course)
	fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
	res.send("Inserted!")

})


app.put("/course/:id",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))

	for (i of data){
		if (req.params.id==i.id){
			var index=data.indexOf(i)
			// console.log(index)

			let course={
				"id":req.body.id,
				"name":req.body.name,
				"description":req.body.description,
				"submission":i.submission
			}
			data[index]=course
			fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
			res.send(course) 
		}
	}
})


app.delete("/course/:id",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const indexOfid=req.params.id-1

	delete data[indexOfid]
	fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
	res.send(data)

})


// FOR submission

app.get("/courses/submission",(req,res)=>{

	const data = JSON.parse(fs.readFileSync("data.json"))
	let arr=[]
	for (i of data){
		if ("submission" in i){
			for (j of i['submission']){
				delete j.usersummision
				arr.push(j)
			}
		}
	}res.send(arr)

})




app.get("/course/:id/submission",(req,res,)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))

	for (i of data){
		if (req.params.id==i.id){
			// console.log(i)
			if ("submission" in i){
				var arr=[]	
				for (var j of i["submission"]){
					delete j["usersummision"]
					arr.push(j)
				}
				
			}
			console.log(arr)
			res.send(arr)
			

		}
	}

}),



app.get("/course/:id/submission/:courseId",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))

	for (i of data){
		if (req.params.id==i.id){
			if ("submission" in i){
				for (j of i["submission"]){
					if (req.params.courseId==j["courseid"]){
						var a=j
					}
				}
			}
		}
	}
	res.send(a)
})


// post for submission

app.post("/course/:id/submission",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const id=req.params.id
	let course={};
	for (i of data){
		if (i.id == id){
			course={
				"id":id,
				"courseid":i.submission.length+1,
				"name":req.body.name,
				"description":req.body.description,
				"usersummision":[]
			}

		}i.submission.push(course)
		
	}fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
	res.send(course)
})


// put for submission

app.put("/course/:id/submission/:courseId",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const id = req.params.id
	const courseId = req.params.courseId
	
	for (i of data){
		if (i.id == id){
			for (j of i.submission){
				if (j.courseid == courseId){
						j.name=req.body.name
						j.description=req.body.description
				}
			}
		}
	}fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
	res.send(data[id-1].submission[courseId-1])

})


//  delete  for submission
app.delete("/course/:id/submission",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const indexOfid = req.params.id-1

	delete data[indexOfid].submission
	res.send(data)
})



//// for usersummision
app.get("/courses/usersummision",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	let arr = [];
	for (i of data){
		for (j of i.submission){
			for (k of j.usersummision){
				delete k.usersubmissions
				arr.push(k)
			}
		}
	}res.send(arr)
})



app.get("/courses/usersummision/:id",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	for (i of data){
		if (req.params.id == i.id){
			var arr=[]
			for (j of i.submission){
				for (user_sum of j.usersummision){
					delete user_sum.usersubmissions
					arr.push(user_sum)
				}
			}res.send(arr)

		}
		
	}

})




app.get("/courses/usersummision/:id/:courseId",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	for (i of data){
		if (req.params.id == i.id){
			var arr=[]
			for (j of i.submission){
				for (user_sum of j.usersummision){
					delete user_sum.usersubmissions
					if (req.params.courseId == user_sum.courseid){
						arr.push(user_sum)
					}
				}
			}res.send(arr)

		}
		
	}

})



///// post for usersummision

app.post("/usersummision/:id/:courseId/",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const id = req.params.id-1
	const courseId = req.params.courseId-1

	data[id].submission[courseId].usersummision.push(req.body)
	
	res.send(data)
	fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
})


// put for usersummision

app.put("/usersummision/:id/:courseId/:username",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const id = req.params.id
	const courseId = req.params.courseId
	const username = req.params.username

	for (i of data){
		if(i.id==id){
			console.log("ok")
			for (sub of i.submission){
				if (sub.courseid == courseId){
					for (j of sub.usersummision){
						console.log("okk")
						if(j.username == username){
							j.usersubmissions=req.body
							console.log("updated")
						}
					}
				}
			}
		}
	}
	fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
	
})

// delete for usersummision

app.delete("/usersummision/:id/:courseId",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const indexOfid = req.params.id-1
	const indexOfcourseid = req.params.courseId-1

	delete data[indexOfid].submission[indexOfcourseid].usersummision
	fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
	res.send(data)
})


// delete for usersubmissions
app.delete("/usersummision/:id/:courseId/:username",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	const indexOfid = req.params.id-1
	const indexOfcourseid = req.params.courseId-1
	const username=req.params.username

	const usersummision = data[indexOfid].submission[indexOfcourseid].usersummision
	
	for (i of usersummision){
		if (i.username==username){
			delete i.usersubmissions
		}
	}
	fs.writeFileSync("data.json",JSON.stringify(data,null,2),null)
	res.send(usersummision.username)
})

//// For comments...

app.get("/courses/comments",(req,res)=>{
	const data = JSON.parse(fs.readFileSync("data.json"))
	let arr=[]
	for (i of data){
		for (user_sum of i.submission){
			for (comments of user_sum.usersummision){
				arr.push(comments.usersubmissions)
			}

		}	
	}res.send(arr)

})







const port=9090;
app.listen(port)
console.log(`listening on port ${port}...`);

   	 	