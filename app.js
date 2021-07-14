const questionList = document.querySelector('#question-list');

// create element & render test
function renderTest(doc){
    let qdiv = document.createElement('div');
    let question = document.createElement('p');
    let options = document.createElement('div')

    let option1 = document.createElement('input');
    option1.setAttribute("type", "radio");
    option1.setAttribute("name", doc.id);


    let option2 = document.createElement('input');
    option2.setAttribute("type", "radio");
    option2.setAttribute("name", doc.id);

    let option3 = document.createElement('inupt');
    option3.setAttribute("type", "radio");
    option3.setAttribute("name", doc.id);

    let option4 = document.createElement('input');
    option4.setAttribute("type", "radio");
    option4.setAttribute("name", doc.id);


    qdiv.setAttribute('data-id', doc.id);
    question.textContent = doc.data().question;
    option1.id = doc.data().options[0];
    option2.id = doc.data().options[1];
    option3.id = doc.data().options[2];
    option4.id = doc.data().options[3];

    let lb1 = document.createElement("label");
    lb1.textContent = doc.data().options[0];
    lb1.setAttribute("for",option1.id);

    let lb2 = document.createElement("label");
    lb2.textContent = doc.data().options[1];
    lb2.setAttribute("for",option2.id);

    let lb3 = document.createElement("label");
    lb3.textContent = doc.data().options[2];
    lb3.setAttribute("for",option3.id);

    let lb4 = document.createElement("label");
    lb4.textContent = doc.data().options[3];
    lb4.setAttribute("for",option4.id);

    qdiv.appendChild(question);
    options.appendChild(option1);
    options.appendChild(lb1);

    options.appendChild(option2);
    options.appendChild(lb2);

    options.appendChild(option3);
    options.appendChild(lb3);

    options.appendChild(option4);
    options.appendChild(lb4);

    qdiv.appendChild(options);
    questionList.appendChild(qdiv);
}

// getting data
db.collection('tests1').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderTest(doc);
    });
});