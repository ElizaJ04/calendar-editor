// ----- Initialize Global Variables ---- //
schedulesArray2D = [
]
numPeriods = 0;
schedulesCreated = 1;
page = 0;
unpressed = true;
jsonUpload = "";
jsonDownload = "";
fileUploaded = false;
dayArray = []
setTimeout(() => {  //inital setup, waits 30ms for everything to load first
    
    
    document.getElementById("weeks").style.display = "none"
    document.getElementById("console").style.display = "none"
    document.getElementById("scheduleIntro").style.display = "none";
    document.getElementById("schedules").style.display = "none";
    document.getElementById("scheduleSubmit").style.display = "none";
    document.getElementById("twitter").style.display = "none"
    

}, 30);

// ------- Schedule step ------- //
//temporary to populate schedule


function periodCount(){
    var NumPeriods = document.getElementById('periods').value //figures out how many periods, sends it along
    if (NumPeriods > 0 && unpressed)
    {
    unpressed = false;
    numPeriods = NumPeriods; //i wanted it to be local but its global so sad
    //creates a submit b
    
   
    scheduleCreateor(NumPeriods)
    }
}

function scheduleCreateor(periods)
{
    var nameLabel = document.createElement("label") //creates the input for schedule name
    nameLabel.innerHTML = "Schedule Name: "
    var nameInput = document.createElement("input")
    nameInput.type = "text";
    nameInput.id = "scheduleName"
    document.getElementById("schedules").append(nameLabel)
    document.getElementById("schedules").append(nameInput)

// adds all html things for submitting      
for (i=1; i<=periods; i++)
{
    
    var period = document.createElement("div")
    period.id = "period" + i

    // Aiden I need u to make this actually look good and not look weird when i > 10

    var startLabel = document.createElement("label")
    startLabel.innerHTML = "Period " + i + " start: "
    var startInput = document.createElement("input")
    startInput.id = "start" + i
    startInput.type = "text"

    var endLabel = document.createElement("label")
    endLabel.innerHTML = "Period " + i + " end: ";
    var endInput = document.createElement("input")
    endInput.id = "end" + i
    endInput.type = "text"

    var nameLabel = document.createElement("label")
    nameLabel.innerHTML = "Period " + i + " name:"
    var nameInput = document.createElement("input")
    nameInput.id = "name"+i





    period.append(startLabel);
    period.append(startInput);
    period.append(endLabel);
    period.append(endInput);
    period.append(nameLabel);
    period.append(nameInput);
    document.getElementById("schedules").append(period)
}
    var submitButton = document.createElement("button")
    submitButton.type = "button";
    submitButton.addEventListener("click", function () {
    submitSchedule();
  }); // creates a submit button
    submitButton.innerHTML = "Submit"
    document.getElementById("scheduleSubmit").append(submitButton)

}

function submitSchedule()
{
    unpressed = true;

    var obj = {scheduleNumber: schedulesCreated, scheduleName: document.getElementById("scheduleName").value}
    for (i = 1; i <= numPeriods; i++) //does a loop to collect all inputs into an object
    {
        obj["period"+i] = {
            periodStart: document.getElementById("start"+i).value,
            periodEnd: document.getElementById("end"+i).value,
            periodName: document.getElementById("name"+i).value
        };
    
    }
    schedulesArray2D.push(obj) //adds schedule object to schedule array

    document.getElementById("schedules").innerHTML = null;
    document.getElementById("scheduleSubmit").innerHTML = null;
    //resets the divs that should be empty at the end
    //increasing values for next loop
    schedulesCreated++;
    document.getElementById("scheduleNum").innerHTML = "Schedule #" + schedulesCreated;
    document.getElementById("periods").value = "";

    // create object with all values

}
// controls the flow of the pages, so that loading is not necessary // 
function toNext()
{
    if (page == 0)
        document.getElementById("scheduleIntro").style.display = "inline";
        document.getElementById("schedules").style.display = "inline";
        document.getElementById("scheduleSubmit").style.display = "inline";
        document.getElementById("fileUpload").style.display = "none";
        document.getElementById("nextB").innerHTML = "Next"
        if (fileUploaded)
            fileParse(jsonUpload, true)
        document.getElementById("scheduleNum").innerHTML = "Schedule #" + schedulesCreated;
        console.log(dayArray)
    }
    if (page == 1)
    {
        document.getElementById("scheduleIntro").style.display = "none";
        document.getElementById("schedules").style.display = "none";
        document.getElementById("scheduleSubmit").style.display = "none";
        document.getElementById("weeks").style.display = "inline"
        document.getElementById("nextB").innerHTML = "Finish"
        populateWeeks()
    }
    else if (page == 2)
    {
        document.getElementById("weeks").style.display = "none";
        document.getElementById("console").style.display = "inline"
        document.getElementById("nextB").style.display = "none";
        createObject()

    }
    page++;

}
// ----- Week step ----- //

function populateWeeks()
{
    for (i = 1; i <= 7; i++)
    {
        for (j = 0; j < schedulesArray2D.length; j++)
        {
            var opt = document.createElement("option")
            opt.value = schedulesArray2D[j].scheduleNumber; //value of selection is the schedule #, makes it easier in the long run
            opt.innerText = schedulesArray2D[j].scheduleName;
            if (dayArray[i-1] == schedulesArray2D[j].scheduleName)
            {
                console.log("select")
                opt.selected = "true";
            }
            
            document.getElementById("day"+i).append(opt)
        }
        document.getElementById("day"+i).selected = dayArray[i];

    }

}

function createObject() // converts array that already exists into a json object
{
    obj = {}
    for (i = 0; i < schedulesArray2D.length; i++)
    {

    obj["schedule"+i]= schedulesArray2D[i];
    }
    
    obj["monday"] =  schedulesArray2D[document.getElementById("day1").value-1].scheduleName;
    obj["tuesday"] =  schedulesArray2D[document.getElementById("day2").value-1].scheduleName;
    obj["wednesday"] =  schedulesArray2D[document.getElementById("day3").value-1].scheduleName;
    obj["thursday"] =  schedulesArray2D[document.getElementById("day4").value-1].scheduleName;
    obj["friday"] =  schedulesArray2D[document.getElementById("day5").value-1].scheduleName;
    obj["saturday"] =  schedulesArray2D[document.getElementById("day6").value-1].scheduleName;
    obj["sunday"] = schedulesArray2D[document.getElementById("day7").value-1].scheduleName;

    console.log(obj)

    jsonDownload = JSON.stringify(obj);

    download('schedule.json', jsonDownload);

}

// -- File upload and download -- //


function fileUpload(file)
{
    fileUploaded = true;
    document.getElementById("nextB").innerHTML = "Accept" //changing some values to reflect that a file was uploaded
    document.getElementById("twitter").style.display = "inline"

//thanks to the internet
    var input = file.files[0]
    //console.log(document.getElementById("test"))
    const reader = new FileReader();
    reader.readAsText(input);

    reader.addEventListener('load', (e) => {
        var data = JSON.parse(e.target.result);

        jsonUpload = data;
        console.log(data);
        fileParse(jsonUpload, false)
    });
}

function fileParse(file, accept)
{
    for (const key in file) {

        if (file.hasOwnProperty(key)) {
            if (typeof (file[key] == "object") && typeof (file[key]) != "string") 
            {
                if (accept)
                {
                    schedulesArray2D.push(file[key])
                    console.log(schedulesArray2D)
                    schedulesCreated++;
                }
                else{

                    for (const be in file[key])
                    {
                        if (be == "scheduleName")
                        {
                            var element = document.createElement('h4');
                            element.innerHTML = "Schedule Name: " + file[key][be];
                            document.getElementById("fileUpload").append(element)   
                        }
                        else if (typeof (file[key][be]) == "object")
                        {
                            var element = document.createElement('p');
                            element.innerHTML = "Period name: " + file[key][be]["periodName"] + " Period Start: " + file[key][be]["periodStart"] + " Period End: " + file[key][be]["periodEnd"];
                            document.getElementById("fileUpload").append(element)
                        }
                    }
                }
            }
            else
            {
                if (accept)
                dayArray.push(file[key])

            }
                
            
            //check if it has a tag of schedule something
    
        }
    }
}




// trusting stack overflow...  // 
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }