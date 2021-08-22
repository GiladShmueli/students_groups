//the work of Gilad Shmueli
//an implementation of the K means algorithm - built specifically for students_groups project, thus normalized between 0-100
//currently works in 1 dimension (1 feature)
//if time would allow, would implement multiple features, matrix style.
//
//center objects: {tag: a numeric tag, mean: where the center is located, count: how many items are related to the center}

function init_centers(k) {
    let centers = [];
    for(let i=1 ; i < k+1 ; i++) {
       centers.push({
           tag: i-1,
           mean: 100*i/(k+1),
           count: 0
       })
    }
    return centers;
}

//choosing the closest center
//currently working in 1 dimension
function pick_closest_center(centers, score) {
    let result = 0;
    let means = centers.map(c => c.mean);
    let distance = Math.abs(score-means[0]);

    for(let i=1 ; i<centers.length ; i++) {
        if (Math.abs(score-means[i]) < distance) {
            result = i;
            distance = Math.abs(score-means[i]);
        }
    }
    return result;
}

//add - a new number
//old_mean - [previous mean(to numerator), previous count of numbers(to numerator and denominator)]
function mean(add, old_mean) {
    if(Number.isNaN(old_mean[0])) {
        return add;
    }
    return (add+old_mean[0]*old_mean[1])/(old_mean[1]+1);
}

//calculate the centers again to adjust to current tags (works per iteration, at the end)
function redefine_centers(scores, tags, k) {
    let centers = [];
    let i;
    for(i=0; i<k; i++) {
        centers.push({tag: i, mean: NaN, count: 0});
    }
    let tag;
    
    for (i=0 ; i<scores.length ; i++) {
        tag = tags[i];
        if (centers[tag].count == 0) {
            centers[tag].count = 1;
            centers[tag].mean = scores[i];
        } else {
            if(tag==3) { console.log("before ", centers[tag].mean),
                         console.log("score is " + scores[i])};
            centers[tag] = {tag: tag,
                            mean: mean(scores[i], [centers[tag].mean, centers[tag].count]),
                            count: centers[tag].count + 1 
                        };
            if(tag==3) { console.log("after ", centers[tag].mean)};
        }
    }
    return centers;
}


//K means algorithm main function
function k_means(scores, k=4){
    let centers = init_centers(k);
    console.log(centers);
    let tags = new Array(scores.length);
    let past;
    do {
        past = tags;
        for(var i=0; i< scores.length; i++){
            tags[i] = pick_closest_center(centers, scores[i]);
        }
        centers = redefine_centers(scores, tags, k);
    }while(past!=tags)
    console.log("tags");
    console.log(tags);
    return {groups: tags, centers: centers};
}

//normalizing scores to be between 0-100
//would usually stretch scores
//since it's very likely the scores spread on a smaller range
function normalize_grades(scores) {
    scores = scores.filter(function (value) {
        if(value < 0)
            value = NaN;
        return !Number.isNaN(value);
    }); //eliminates NaN
    
    let max = Math.max.apply(null, scores);
    let min = Math.min.apply(null, scores);
    let n_scores = new Array();
    scores.forEach(element => {
        n_scores.push(100*(element-min)/(max-min))
    });
    return n_scores;
}

function reverse_normalization(centers, min, max) {
    //centers = centers.filter(function (value){
    //    return !Number.isNaN(value);
    //});
    let r_centers = new Array();
    centers.forEach(element => {
        if(Number.isNaN(element)){
            r_centers.push(NaN);
            
        }
        else{
            r_centers.push(100*(element+min)/(max+min));
        }
        
    });
    return r_centers;
}