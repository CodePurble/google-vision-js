let express = require('express')
let vision = require('@google-cloud/vision') 
let upload = require('express-fileupload')
let app = express()

app.use(upload())
app.use(express.static("images"))

app.set('view engine', 'ejs')

let client = new vision.ImageAnnotatorClient()


app.get('/', function (req, res) { // Server get request
    res.render('index') // render html with ejs in browser
    // res.send(data) // directly show data file
})
// console.log(data)

app.post("/", function(req, res){
    if(req.files){
        let file = req.files.image
        let filename = file.name
        let mode = req.body.mode
        
        file.mv("./images/"+filename).then(function(){
            if(mode == "label"){
                client.labelDetection("./images/" + filename).then(function(data){ // Send image to Google for processing
                    console.log(data)
                    res.render('resultLabel', {data: data[0].labelAnnotations, filename: filename})
                    })
            }
            else if(mode == "text"){
                client.textDetection("./images/" + filename).then(function (data) { // Send image to Google for processing
                    console.log(data)
                    res.render('resultText', { data: data[0].fullTextAnnotation.text, filename: filename})
                })
            }
            else if(mode == "face"){
                client.faceDetection("./images/" + filename).then(function (data) { // Send image to Google for processing
                    console.log(data)
                    res.render('resultFace', { data: data[0].faceAnnotations, filename: filename})
                })
            }
        })
    }
    else{
        res.send("UPLOAD A FILE")
    }
})

app.listen(5000, function(){
    console.log("Server running")
})