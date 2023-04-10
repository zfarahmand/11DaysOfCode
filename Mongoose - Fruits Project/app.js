const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fruitsDB');


  ///////////////////////////////////////////////// Insertion //////////////////////////////////
  const fruitSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true , "You have forgotten to specify the name!"]
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    review: String
  });
  const Fruit = mongoose.model("Fruit", fruitSchema);

  const apple = new Fruit({
    name: "Apple",
    rating: 8,
    review: "Great fruit when you're hungry!"
  });

  // const peach = new Fruit({
  //   rating: 10,
  //   review: "Peaches are truely lovely!"
  // });

  // await apple.save();

  // const personSchema = new mongoose.Schema({
  //   name: String,
  //   age: Number
  // });

  // const Person = new mongoose.model("Person", personSchema);

  // const person = new Person({
  //   name: "John",
  //   age: 37
  // });

  // await person.save();

  // const kiwi = new Fruit({
  //   name: "Kiwi",
  //   rating: 9,
  //   review: "Fairly sour."
  // });

  // const orange = new Fruit({
  //   name: "Orange",
  //   rating: 10,
  //   review: "Has a beautiful color!"
  // });

  // const banana = new Fruit({
  //   name: "Banana",
  //   rating: 10,
  //   review: "Nice texture and easy to eat!"
  // });

  // Fruit.insertMany([
  //   apple, kiwi, orange,banana    
  // ]).then(function () {
  //   console.log("Successfully saved defult items to DB");
  // })
  // .catch(function (err) {
  //   console.log(err);
  // });

  ////////////////////////////// Query/////////////////////////////////////////////////

// Fruit.find().select('name').exec().then(function(fruits) {
//   mongoose.connection.close();  
  
//   fruits.forEach(function(fruit) {
//       console.log(fruit.name);
//     });
//   }).catch(function(err) {
//     console.log(err);
//   });

  // Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);


  ///////////////////////////////////////////// Update /////////////////////////////////////////////////

  Fruit.updateOne({_id: "64343016fe693b46f1b4965f"} , {name: "Peach" , rating: 10 , review: "Peaches are truely lovely!"}).then(function() {
    console.log("Succesfully updated the document!");
  }).catch(function(err) {
    console.log(err);
  });


    ///////////////////////////////////////////// Delete /////////////////////////////////////////////////

    Fruit.deleteMany({name: "Apple2"}).then(function() {
      mongoose.connection.close();
      console.log("The document was succesfully deleted!");
    }).catch(function(err) {
      console.log(err);
    })
}
