const marker1={
    name: "chamel",
    color: "red",
    address: "haryana"
}
//objects 
const marker2={
    name: "apsara",
    color: "black",
    address: "punjab"
}

//manipulating the objects

marker1["color"] = "black"
delete(marker1["address"])

//printing the manipulated objects

console.log (marker1)
console.log (marker2)



const arr = [1,2,3,4,5,6,7,8,9]

// arr.pop()
// console.log(arr)

// arr.push(70)
// console.log(arr)

// arr.shift(12)
// console.log(arr)

// arr.unshift(1)
// console.log(arr)

arr.slice(2,5)
console.log(arr)

console.log(arr.splice(2,3))



const name ="Aryan Prasher"

const arr2 = name.split("")
console.log(arr2)

const arr3 = name.split(" ")
console.log(arr3)

const arr4 = name.slice(2, 5)
console.log(arr4)

const students =["aryan", "rakesh", "akshit", "kunal", "rahul", "sonali"]
console.log(students.splice(2,3))


