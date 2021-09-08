const questionList = document.querySelector('#question-list');
let idarr = [];
let answers = [];
let score = 0;

let url_string = document.location.href;
var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);

db.collection('students').doc(url_string_user).get().then(snapshot => {
    if(snapshot.exists == false)
    {
        console.log("does not exist")
        window.location.href='/';
    }

})


// create element of a single question & render test
function renderTest(doc){
    let arrn = 0;
    let qdiv = document.createElement('div');
    let question = document.createElement('p');
    let options = document.createElement('div')
    qdiv.id = doc.id;
    question.textContent = doc.data().question;
    qdiv.appendChild(question);

    idarr.push(doc.id);
    answers.push(doc.data().answer);
    //arrn++;

    for(let i = 0; i < 4; i++)
    {
        let option1 = document.createElement('input');
        option1.type= "radio";
        option1.name= doc.id;
        option1.id = "ans"+ i + " " + doc.id;

        let lb1 = document.createElement("label");
        let description1 = document.createTextNode(doc.data().options[i]);
        //lb1.textContent = doc.data().options[0];
        lb1.appendChild(description1);
        lb1.setAttribute("for","ans"+ i + " " + doc.id);

        let br1 = document.createElement('br');

        qdiv.appendChild(option1);
        qdiv.appendChild(lb1);
        qdiv.appendChild(br1);
    }
    qdiv.setAttribute("class", "li question");
    if(!(/[\u0590-\u05FF]/).test(question.textContent)){
        question.setAttribute("class","li-ltr");
    }
    questionList.appendChild(qdiv);
}

// getting data
db.collection('tests1').get().then(snapshot => {
    /*snapshot.docs.forEach(doc => {
        renderTest(doc);
    });*/
    let test = [];
    let temp = snapshot.docs;
    console.log(temp);
    let q;
    for(let i=0; i<30 ; i++){
        q = Math.floor(Math.random() * temp.length);
        test.push(temp.splice(q, 1)[0]);
    }
    console.log(test);
    test.forEach(question =>
        {
            console.log(question.data().answer);
            renderTest(question);
        })
});

function getscore(i) {
    
    

    for(let j = 0; j < 4;j++)
    {
        let ques = document.getElementById("ans" + j + " " + idarr[i]);


        if(ques.checked == true)
        {
            console.log("label[for=" + "ans" + j + " " + idarr[i] + "]");

            let lbl = ques.nextElementSibling;
            //var ids = "label[for=" + "ans" + j + " " + idarr[i] + "]";
            //let lbl = document.querySelector(ids);
            let txt = lbl.innerHTML;
            //txt = lbl.innerHTML;

            if(txt == answers[i])
            {
                score++;
            }
        }
    }     

}

document.getElementById('submit').onclick = function() {
    score = 0;

    for(let i = 0; i< idarr.length;i++)
    {
        getscore(i);
    }
    
    //let pel = document.getElementById('score');

    //pel.innerHTML = "";

    let tscore = (score / answers.length) * 100;
    var tscoref = parseFloat(tscore.toFixed(2));


    //let url_string = document.location.href;
    //var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);
    console.log(url_string_user);

    console.log(tscoref);
    db.collection('students').doc(url_string_user).update({
        "score": tscoref
    }).then(temp => {
        window.location.href='/personal/' + url_string_user;
    });
    
    
   // .get().then(doc => {
   //     console.log(doc);
   //     console.log(doc.data().name);
        //doc.data().score = tscoref;
  //      doc.data().score = 57;
  //  });
    
    //student.data().score = tscoref;

    ////window.location.href='/personal/' + url_string_user;

}

//disable refreshing
function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };
// To disable f5
    /* jQuery < 1.7 */
$(document).bind("keydown", disableF5);
/* OR jQuery >= 1.7 */
$(document).on("keydown", disableF5);

// // To re-enable f5
//     /* jQuery < 1.7 */
// $(document).unbind("keydown", disableF5);
// /* OR jQuery >= 1.7 */
// $(document).off("keydown", disableF5);

