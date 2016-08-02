/**
 * @fileOverview  The model class Person with property definitions, (class-level) check methods, 
 *                setter methods, and the special methods saveAll and loadAll
 * @author Gerd Wagner
 */

/**
 * Enumeration type
 * @global
 */
PersonTypeEL = Object.defineProperties( {}, {
	EMPLOYEE: {value: 1, writable: false},
	AUTHOR: {value: 2, writable: false},
    MAX: {value: 2, writable: false},
    names: {value:["Employee","Author"], writable: false}
});
// ***********************************************
// *** Constructor with property definitions ****
// ***********************************************
function Person( slots) {
  this.personId = 0;        // Number (Integer)
  this.name = "";           // String

  // constructor invocation with arguments
  if (arguments.length > 0) {
    this.setPersonId( slots.personId);
    this.setName( slots.name);
  }
};
// ***********************************************
// *** Checks and Setters ************************
// ***********************************************
Person.checkPersonId = function (id) {
  if (id === undefined) {  // this is okay, as we just check the syntax
    return new NoConstraintViolation();
  } else {
    // convert to integer in case of string
    id = parseInt( id);
    if (isNaN( id) || !util.isPositiveInteger( id)) {
      return new RangeConstraintViolation("The author ID must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }
};
Person.checkPersonIdAsId = function (id, personOrSubclass) {
  var constraintViolation=null;
  id = parseInt( id);  // convert to integer in case of a string
  if (isNaN( id)) {
	  constraintViolation = new MandatoryValueConstraintViolation(
        "A value for the person ID is required!");
  } else {
    constraintViolation = Person.checkPersonId( id);
    if ((constraintViolation instanceof NoConstraintViolation)) {
      if (personOrSubclass.instances[String(id)]) {  // convert id to string if number
        constraintViolation = new UniquenessConstraintViolation(
            'There is already a '+ personOrSubclass.name +' record with this person ID!');
      }     	      	  
    }
  }
  return constraintViolation;
};
Person.prototype.setPersonId = function (id) {
  var constraintViolation = null;
  // this.constructor may be Person or any subtype of it
  constraintViolation = Person.checkPersonIdAsId( id, this.constructor);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.personId = parseInt( id);
  } else {
    throw constraintViolation;
  }
};
Person.checkName = function (n) {
  if (!n) {
    return new MandatoryValueConstraintViolation("A name must be provided!");
  } else if (typeof(n) !== "string" || n.trim() === "") {
    return new RangeConstraintViolation("The name must be a non-empty string!");
  } else {
    return new NoConstraintViolation();
  }
};
Person.prototype.setName = function (n) {
  var constraintViolation = Person.checkName( n);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.name = n;
  } else {
    throw constraintViolation;
  }
};
// ***********************************************
// *** Methods ***********************************
// ***********************************************
/**
 *  Convert person object to row/record
 */
Person.prototype.convertObj2Row = function () {
  var persRow = util.cloneObject(this);
  return persRow;
};
// *****************************************************
// *** Class-level ("static") methods ***
// *****************************************************
/**
 *  Create a new person row
 */
Person.create = function (slots) {
  var person=null, persId="";
  try {
    person = new Person( slots);
    persId = String(person.personId);
    if (Person.instances[persId]) {
      throw new UniquenessConstraintViolation(
          'There is already a person record with this person ID!');    	
    }
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    person = null;
  }
  if (person) {
    Person.instances[persId] = person;
    console.log("Saved: " + person.name);
  }
};
/**
 *  Update an existing person row
 */
Person.update = function (slots) {
  var person = Person.instances[slots.personId.toString()],
      noConstraintViolated = true,
      ending = "",
      updatedProperties = [],
      objectBeforeUpdate = util.cloneObject( person);
  try {
    if ("name" in slots && person.name !== slots.name) {
      person.setName( slots.name);
      updatedProperties.push("name");
    }
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    Person.instances[slots.personId.toString()] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log("Propert"+ending+" " + updatedProperties.toString() + " modified for person " + person.name);
    } else {
      console.log("No property value changed for person " + person.name + " !");
    }
  }
};
/**
 *  Delete an existing person row
 */
Person.destroy = function (id) {
  var person = Person.instances[String(id)];
  // delete the person record
  delete Person.instances[String(id)];
  console.log("Person " + person.name + " deleted.");
};
/**
 *  Load all person rows from the Local Storage persons key
 *  and add their slots to Employee and Author
 */
Person.loadAll = function () {
  var key="", keys=[], persons={}, i=0;
  if (!localStorage["persons"]) {
    localStorage.setItem("persons", JSON.stringify({}));
  }  
  try {
    persons = JSON.parse( localStorage["persons"]);
  } catch (e) {
    console.log("Error when reading from Local Storage\n" + e);        
  }
  keys = Object.keys( persons);
  console.log( keys.length +" persons loaded.");
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    Person.instances[key] = Person.convertRow2Obj( persons[key]);
  }
};
/**
 *  Convert person row to person object
 */
Person.convertRow2Obj = function (persRow) {
  var person={};
  try {
    person = new Person( persRow);
  } catch (e) {
    console.log( e.constructor.name + " while deserializing a person row: " + e.message);
    person = null;
  }
  return person;
};
/**
 *  Save all person objects from the Person subclasses Employee and Author
 */
Person.saveAll = function () {
  var key="", keys=[], persons={}, i=0, n=0;
  keys = Object.keys( Employee.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    emp = Employee.instances[key];
    persons[key] = {personId: emp.personId, name:emp.name};
  }
  keys = Object.keys( Author.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    if (!persons[key]) {
      author = Author.instances[key];
      persons[key] = {personId: author.personId, name: author.name};    	
    }
  }
  try {
    localStorage["persons"] = JSON.stringify( persons);
    n = Object.keys( persons);
    console.log( n +" persons saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
