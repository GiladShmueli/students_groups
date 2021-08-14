const questionList = document.querySelector('#question-list');
let idarr = [];
let answers = [];
let arrn = 0;
let score = 0;
let randoarr = [];
let orig = [];

// create element & render test
function renderTest(doc){

    let qdiv = document.createElement('div');
    let question = document.createElement('p');
    let options = document.createElement('div')
    qdiv.id = doc.id;
    question.textContent = doc.data().question;
    qdiv.appendChild(question);

    idarr[arrn] = doc.id;
    answers[arrn] = doc.data().answer;
    arrn++;

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
    
    questionList.appendChild(qdiv);
}


function mix_and_split(quiz, form_length=30) {
    console.log(quiz);
    const qlength = quiz.length;
    let q, temp_quiz;
    let forms_number = Math.floor(qlength/form_length);
    let versions = new Array(forms_number); //array of versions, each contain different questions

    for(var i=0; i<forms_number; i++) {
      versions[i] = new Array(form_length);
      temp_quiz = quiz //to avoid duplicated questions in a version
      for(var j=0 ; j<form_length; j++) {
        q = Math.floor(Math.random() * temp_quiz.length);
        versions[i][j] = temp_quiz.pop(q);
      }
    }
    return versions;
} 


console.log('im here');

/*db.collection('tests1').get().then(snapshot => {
    let randoarr1 = []
    snapshot.docs.forEach(doc => {
       randoarr1.push(doc);
    });

    console.log(randoarr1);
    randoarr = mix_and_split(randoarr1,4)[0];
    console.log(randoarr);
    randoarr.forEach(dc => {
        renderTest(dc);
    });
});

orig = [];
db.collection('tests1').get().then(snapshot => {

    snapshot.docs.forEach(doc => {
        
        orig.push({
            //"idd": doc.id,
            "answer": doc.data().answer,
            //"question": doc.data().question,
           // "option": doc.data().options
        })
    });
});*/



// getting data
db.collection('tests1').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderTest(doc);
    });
});

arrn = 0;


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
    var tscoref = tscore.toFixed(2);


    let url_string = document.location.href;
    var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);
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

