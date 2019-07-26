class SGT_template {
	/* constructor - sets up SGT object and storage of students
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose:
		- stores the appropriate DOM elements inside of an object
		and uses those element references for later portions of the application
		- Also, stores all created student objects in this.data
		- Finally, binds methods that need to be bound
	return: undefined
	*/
	constructor(elementConfig) {
		this.elementConfig = elementConfig; /* console.log elementConfig to note what data you have access to */

		this.data = {};
		 
		this.addEventHandlers = this.addEventHandlers.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.clearInputs = this.clearInputs.bind(this);
		this.doesStudentExist = this.doesStudentExist.bind(this);
		this.displayAllStudents = this.displayAllStudents.bind(this);
		this.displayAverage = this.displayAverage.bind(this);
		this.deleteStudentFromServer = this.deleteStudentFromServer.bind(this);
		this.retrieveData = this.retrieveData.bind(this);
		this.handleDataFromServer = this.handleDataFromServer.bind(this);
		this.handleSuccessAddStudentToServer = this.handleSuccessAddStudentToServer.bind(this);
		this.handleErrorAddStudentToServer = this.handleErrorAddStudentToServer.bind(this);
		this.addStudentToServer = this.addStudentToServer.bind(this);
		this.handleSuccessDeleteStudentToServer = this.handleSuccessDeleteStudentToServer.bind(this);
		this.handleErrorDeleteStudentToServer = this.handleErrorDeleteStudentToServer.bind(this);

	}
	

	/* addEventHandlers - add event handlers to pre-made dom elements
	make sure to use the element references that were passed into the constructor (see elementConfig)
	purpose:
		adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	addEventHandlers() {

		this.elementConfig.addButton.on("click",this.handleAdd);
		this.elementConfig.cancelButton.on("click",this.handleCancel);
		this.elementConfig.retrieveButton.on("click",this.retrieveData);


	}

	/* clearInputs - Clear the values in the three form inputs
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	clearInputs() {
		$(this.elementConfig.nameInput).val("");
		$(this.elementConfig.courseInput).val("");
		$(this.elementConfig.gradeInput).val("");

	}

	/* handleCancel - function to handle the cancel button press (should clear out all values in the inputs)
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel() {
		this.clearInputs();

	}

	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose:
			If no id is present, it must pick the next available id that can be used in the this.data object
			{Object.keys is helpful for this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys}
			If the id of the student to be created already exists, the method should return false
				- {You should use the "doesStudentExist" method below to see if the student id exists}
			Once you have all the necessary data, including an ID, name, course, and grade, create the new student.
			*** You MUST pass the id, name, course, grade, and a reference to SGT's deleteStudent method to properly create a student! ***
			Finally, store the student in the this.data object at a key that matches the students id
	params:
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudent(name, course, grade , id, deleteStudentFromServer) {
		
		// if(typeof name !== "undefined" || typeof grade !== "undefined" || typeof course !== "undefined"){
		// 	var newStudent = new Student(id, name, course, grade);
		// 	console.log("newStudent", newStudent);
		
		if(id){
			
			if(this.doesStudentExist(id)){
			return false;
			}
			this.data[id] = new Student(id, name, course, grade, this.deleteStudentFromServer);
			
			return true;
		
		}else {
			var objectId = Object.keys(this.data);
			// console.log("keys", Object.keys(this.data));
			// console.log("keys length", objectId.length);
			var nextId = objectId.length + 1;

			for (var i = 0 ; i < objectId.length; i++){
				if((objectId[i+1] - objectId[i]!= 1)){	
					nextId = parseInt(objectId[i]) + 1;
					break;
				}	
			}
	
			this.data[nextId] = new Student(nextId, name, course, grade, this.deleteStudentFromServer);
			//console.log('added',this.data[nextId]);
			
		
	}
	
}

	/* doesStudentExist -
		determines if a student exists by ID.  returns true if yes, false if no
	purpose:
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params:
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id) {
		
		return this.data.hasOwnProperty(id);
		
	}

	/* handleAdd - function to handle the add button click
	purpose:
		- grabs values from inputs,
		- utilizes the createStudent method to create the	student,
		- stores the created student in this.data at the appropiate key,
		- then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd() {
		console.log("this.data1", this.data);
		console.log("studentname", studentName);

		var studentName = $(this.elementConfig.nameInput).val();
		var courseName = $(this.elementConfig.courseInput).val();
		var gradeVal = $(this.elementConfig.gradeInput).val();
		var studentID = null;

		this.createStudent(studentName, courseName , gradeVal, studentID);
		this.addStudentToServer(studentName, courseName , gradeVal);
		this.clearInputs();

		console.log("this.data2", this.data);
		

	}


	addStudentToServer(studentName, studentCourse, studentGrade){
		var ajaxConfigObject = {
			dataType: 'json',
			url: "http://s-apis.learningfuze.com/sgt/create",
			method: "post",
			data: {"api_key": "Ke3qZVF5U2", "name": studentName, "course": studentCourse, "grade": studentGrade},

			success: this.handleSuccessAddStudentToServer,

			error: this.handleErrorAddStudentToServer,
		
		}

		$.ajax(ajaxConfigObject);

	}

	handleSuccessAddStudentToServer(result){
		if(result){
			this.retrieveData();
		}


	}

	handleErrorAddStudentToServer(result){
		if(result === "error"){
			return false;
		}

	}

	

	/* readStudent -
		get the data for one or all students
	purpose:
			- determines if ID is given or not
				- if ID is given, return the student by that ID, if present
				- if ID is not given, return all students in an array
	params:
		id: (number)(optional) the id of the student to search for, if any
	return:
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(id) {
		//console.log('students', Object.values(this.data));
		if( ! id) {
			return Object.values(this.data);
		} else {
			if(this.doesStudentExist(id)){
				return this.data[id];
			}
			else{
				return false;
			}
		}

	}

	/* displayAllStudents - iterate through all students in the this.data object
	purpose:
		- grab all students from this.data,
		- empty out every student in the dom's display area,
		- iterate through the retrieved list,
		- then render every student's dom element
		- then append every student to the dom's display area
		- then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents() {
		$("#displayArea").empty();
		var studentDetails =  Object.keys(this.data);
		//console.log("data", studentDetails);
		
		for(var key in this.data){
		
			$("#displayArea").append(this.data[key].render());
				
		}
		this.displayAverage();

	}

	/* displayAverage - get the grade average and display it
	purpose:
		- determine the average grade from students in this.data,
		- and shows it on the dom
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	displayAverage() {

		
		var allGrades = Object.keys(this.data);
		var gradeSum = 0;
		var avg = 0;


		for(var key in this.data){
			if(isNaN(this.data[key].data.grade)){

				
			}
			else{
				gradeSum += this.data[key].data.grade;
			}
			
		}
		avg = gradeSum / allGrades.length;
		avg = avg.toFixed(2);
		console.log("avg", avg);
		
		$(".avgGrade").text(avg);

	}

	/* deleteStudent -
		delete the given student at the given id
	purpose:
			- determine if the ID exists in this.data
			- remove it from the object
			- return true if successful, false if not
			(this is often called by the student's delete button through the Student handleDelete)
	params:
		id: (number) the id of the student to delete
	return:
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteStudentFromServer(id) {
		if(this.data[id]){
			delete this.createStudent();
			//return true;
		}
		//return false;

		console.log('delete', id);
		console.log(this.data[id].data.id);
		console.log(this.data);

		var ajaxConfigObject = {
			dataType: 'json',
			url: "http://s-apis.learningfuze.com/sgt/delete",
			method: "post",
			data: {api_key: "Ke3qZVF5U2", "student_id": id},

			success: this.handleSuccessDeleteStudentToServer,

			error: this.handleErrorDeleteStudentToServer,
		
		}

		$.ajax(ajaxConfigObject);
			
	}

	handleSuccessDeleteStudentToServer(result){
		if(result){
			console.log('delete success', result	);
			//this.data;
			this.retrieveData();
		}

	}

	handleErrorDeleteStudentToServer(result){
		if(!result){

			return false;
		}

	}


	/* updateStudent -
		*** not used for now.  Will be used later ***
		pass in an ID, a field to change, and a value to change the field to
	purpose:
		- finds the necessary student by the given id
		- finds the given field in the student (name, course, grade)
		- changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params:
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return:
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent() {

	}

	handleDataFromServer(result){
		console.log('Handle Data from Server:', result.success);
		console.log("data", result);

			if(result.success){
				this.data = {};
			for(var i = 0; i < result.data.length; i++){
				var name = result.data[i].name;
				var course = result.data[i].course;
				var grade = result.data[i].grade;	
				var id = result.data[i].id;

				var newstudent = this.createStudent(name, course, grade, id);
				
							
			}
			
		}
			
		this.displayAllStudents();
			
	}


	handleError(result){
		if(!result){
			return false;
		}
	}


	retrieveData(){
		
		var ajaxConfigObject = {
			dataType: 'json',
			url: "http://s-apis.learningfuze.com/sgt/get",
			method: "post",
			data: {api_key: "Ke3qZVF5U2"},

			success: this.handleDataFromServer,

			error: this.handleError,
		
		}

		$.ajax(ajaxConfigObject);

	}

}


	