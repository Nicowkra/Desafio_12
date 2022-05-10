process.on("message",(parentMessage)=>{
    const numbers =[]
    const counts ={}
    for (let i = 0; i<parentMessage; i++){
        var random_number = Math.floor(Math.random() * 1000);
        numbers.push(random_number)
    }

    numbers.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    process.send(counts)

})