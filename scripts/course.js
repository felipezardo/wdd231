const rawCourses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces students to the World Wide Web and to careers in web site design and development...',
    technology: ['HTML', 'CSS'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'CSE 111 students become more organized, efficient, and powerful computer programmers...',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce the notion of classes and objects...',
    technology: ['C#'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience in Web Fundamentals and programming...',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming...',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false
  }
];

const courseContainer = document.getElementById('courses');
const totalCredits = document.getElementById('totalCredits');

function displayCourses(filteredCourses) {
  courseContainer.innerHTML = '';
  let total = 0;

  filteredCourses.forEach(course => {
    const div = document.createElement('div');
    div.className = course.completed ? 'course completed' : 'course';

    const title = document.createElement('button');
    title.className = 'course-title';
    title.innerHTML = `<strong>${course.subject} ${course.number}</strong>: ${course.title} (${course.credits} credits)`;

    const description = document.createElement('p');
    description.className = 'course-description';
    description.textContent = course.description;
    description.style.display = 'none';

    title.addEventListener('click', () => {
      description.style.display = description.style.display === 'none' ? 'block' : 'none';
    });

    div.appendChild(title);
    div.appendChild(description);
    courseContainer.appendChild(div);

    total += course.credits;
  });

  totalCredits.textContent = total;
}

document.getElementById('all').addEventListener('click', () => displayCourses(rawCourses));
document.getElementById('wdd').addEventListener('click', () =>
  displayCourses(rawCourses.filter(c => c.subject === 'WDD'))
);
document.getElementById('cse').addEventListener('click', () =>
  displayCourses(rawCourses.filter(c => c.subject === 'CSE'))
);

displayCourses(rawCourses);
