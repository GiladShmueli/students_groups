quiz1 = {
    "question1": [3,4,6,8,7],
    "question2": [1,2,3,4,5],
    "question3": [4,34,25,45,6],
    "question4": [1,5,6,4,3],
    "question5": [5,6,4,4,3]
};

//#region FYS splitter 
// keeps versions to have different questions, never intersect
//Fischer Yates shuffle function
//http://bost.ocks.org/mike/shuffle/
//shuffles all of the questions
function shuffle(quiz) {
    var m = quiz.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = quiz[m];
      quiz[m] = quiz[i];
      quiz[i] = t;
    }
  
    return quiz;
}


function shuffle_and_split(quiz, form_length = 30) {
    let forms_number = Math.floor(quiz.length/form_length);
    let versions = new Array(forms_number); //array of versions, each contain different questions
    var questions = shuffle(quiz);
    for(var i=0; i < forms_number ; i++) {
      versions[i] = questions.slice(i*form_length, i*form_length+form_length); 
    }
    return versions;
}
//#endregion

//#region FULL RANDOM
//might contain intersection between different versions
function mix_and_split(quiz, form_length=30) {
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


/*console.log(shuffle_and_split(Object.entries(quiz1), 2));
console.log(mix_and_split(Object.entries(quiz1), 2));*/
