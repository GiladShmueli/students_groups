const questionList = document.querySelector('#question-list');

// create element & render test
function renderTest(doc){

    let qdiv = document.createElement('div');
    let question = document.createElement('p');
    let options = document.createElement('div')
    qdiv.id = doc.id;
    question.textContent = doc.data().question;
    qdiv.appendChild(question);

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

// getting data
db.collection('tests1').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderTest(doc);
    });
});