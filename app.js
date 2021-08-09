const questionList = document.querySelector('#question-list');
let idarr = [];
let answers = [];
let arrn = 0;
let score = 0;

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
    qdiv.setAttribute("class", "li");
    questionList.appendChild(qdiv);
}

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
    
    let pel = document.getElementById('score');

    //pel.innerHTML = "";

    let tscore = (score / answers.length) * 100;
    var tscoref = tscore.toFixed(2);

    pel.innerHTML = "your score is: " + tscoref.toString();
}

