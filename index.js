// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

// Function Expressions

// check if the ID is of type number
const checkIDType = (id) => {
  if (typeof id === "number") {
    return true;
  } else {
    throw `ID ${id} is not type number. It is of type ${typeof id}.`;
  }
};

// Declarative Functions

function getUniqueLearners(submission) {
  let uniqueIDs = [];
  const learnerIDs = new Set(submission.map((prop) => prop.learner_id));
  learnerIDs.forEach((element) => uniqueIDs.push({ id: element }));
  return uniqueIDs;
}

// get the id that matches
const getIDIndex = (obj, index) => {
  // findIndex() will return -1 if it can't find anything that matches the condition
  if (obj.findIndex((element) => element.id == index) > -1) {
    return obj.findIndex((element) => element.id == index);
  } else {
    throw "Can not find matching IDs.";
  }
};

// check if the date is in the right format
const checkDateType = (date) => {
  if (typeof date === "string") {
    return true;
  } else {
    throw `Date is not of type string. It is of type ${typeof date}.`;
  }
};

// get the current date without the time
const getCurrentDate = () => {
  // store date
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

function getFinalScore(ag, assignmentID, submission) {
  const assignmentIndex = getIDIndex(ag.assignments, assignmentID);
  let finalScore = -1;
  //check if the due date past already
  checkDateType(ag.assignments[assignmentIndex].due_at);
  if (getCurrentDate() > ag.assignments[assignmentIndex].due_at) {
    // store score student got on assignment
    finalScore = submission.score; // 150 = score of learner_id: 125 & assignment_id: 2

    // store max points they can receive
    const points_possible = ag.assignments[assignmentIndex].points_possible;

    // throw error if the points possible is 0
    if (points_possible == 0) {
      throw "Points possible is 0. Something is wrong.";
    }

    // check if the student turn in the assignment late
    checkDateType(submission.submitted_at);
    if (submission.submitted_at > ag.assignments[assignmentIndex].due_at) {
      // deduct 10% of total points from final grade from assignment if it's late
      // Using learner_id: 125 & assignment_id: 2 as an example here.
      finalScore = points_possible * 0.9; // 135 = 150 - 150 * 0.10
    }
  }
  return finalScore;
}

// make list of the id's from the output array
const makeAssignmentList = (obj) => {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    // if id contains number keep it in the array.
    if (keys[i] !== "avg" && keys[i] !== "id") {
      continue;
    }
    checkIDType(parseInt(keys[i]));
    // pop any element that's not a number
    keys.pop();
  }
  return keys;
};

function calculateScore(arr, learner) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += learner[arr[i]];
  }
  return sum;
}

function calculateTotalPoints(arr, ag) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    const index = getIDIndex(ag.assignments, arr[i]);
    sum += ag.assignments[index].points_possible;
  }
  return sum;
}

// Main Function
// Main Function
function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired output.
  let output = [];

  try {
    checkIDType(course.id);
    checkIDType(ag.course_id);

    if (course.id === ag.course_id) {
      output = getUniqueLearners(submissions);

      submissions.forEach((element) => {
        checkIDType(element.assignment_id);
        checkIDType(element.learner_id);

        let finalScore = getFinalScore(
          ag,
          element.assignment_id,
          element.submission
        );

        const outputIndex = getIDIndex(output, element.learner_id);

        if (finalScore > -1) {
          output[outputIndex][element.assignment_id] = finalScore;
        }
      });

      // Move the following code outside of the submissions loop
      for (let i = 0; i < output.length; i++) {
        const assignmentList = makeAssignmentList(output[i]);
        const totalScoreSum = calculateScore(assignmentList, output[i]);
        const totalPoints = calculateTotalPoints(assignmentList, ag);
        output[i].avg = parseFloat((totalScoreSum / totalPoints).toFixed(2));

        for (const key in output[i]) {
          if (key !== "avg" && key !== "id") {
            const index = getIDIndex(ag.assignments, key);
            if (ag.assignments[index].points_possible === 0) {
              throw "Points possible is 0. Something is wrong.";
            }
            output[i][key] /= ag.assignments[index].points_possible;
            output[i][key] = parseFloat(output[i][key].toFixed(2));
          }
        }
      }
    } else {
      throw "Course ID is not matching with course ID in Assignment Group";
    }

    return output;
  } catch (e) {
    return e;
  }
}

// ... (your existing code)

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);

// Expected results:

// const result = [
//   {
// learner's id
//     id: 125,
// Weighted Avg of All Assignments:
//     avg: 0.985, // (47 + 150) / (50 + 150)
//  Assignment Grade:
// <assignment_id>: number
// Where they key represents the <assignment_id>
// Where number in decimal represents the decimal number of the score
//     1: 0.94, // 47 / 50
//     2: 1.0, // 150 / 150
//   },
//   {
//     id: 132,
//     avg: 0.82, // (39 + 125) / (50 + 150)
//     1: 0.78, // 39 / 50
//     2: 0.833, // late: (140 - 15) / 150
//   },
// ];
