import Faker from 'faker'
import { define, factory } from 'typeorm-seeding'
import {Course, Semesters, CourseLevel} from '../../models/Course';
import {UserGroup} from '../../models/UserGroup';

define(Course, (faker: typeof Faker) => { 
  	const subject = faker.random.arrayElement(["MATH", "CSSE", "COMP", "STAT"]);
	const code = faker.random.number({ min: 1000, max: 4999, precision: 1 })

	const course = new Course();
	course.id = `${subject}${code}`;
	course.name = faker.lorem.sentence(4);
	course.year = faker.random.number({ min: 2017, max: 2022, precision: 1 })
	course.semester = faker.random.number() % 2 ? Semesters.One : Semesters.Two;
	course.courseLevel = faker.random.number() % 3 ? CourseLevel.Postgrad : CourseLevel.Undergrad;
	course.coordinators = factory(UserGroup)({ num: faker.random.number({ min: 1, max: 3, precision: 1 })}) as any;  // TODO this doesnt work
	// factory(UserGroup)({ num: faker.random.number({ min: 1, max: 3, precision: 1 })}).create().then(a => console.log(a));

	return course;
})
