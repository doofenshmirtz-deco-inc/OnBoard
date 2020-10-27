import { define } from "@doofenshmirtz-deco-inc/typeorm-seeding";
import { Course, Semesters, CourseLevel } from "../../models/Course";
import { CourseGroup } from "../../models/UserGroup";
import { CourseRole } from "../../models/CourseGroupPair";
import { FolderNode, TextNode } from "../../models/CoursePageNode";

// creating a course accepts these context variables. if not provided, defaults
// will be used.
export type CourseFactoryContext = {
  groups?: {
    [role: string]: CourseGroup;
  };
  code?: string;
  name?: string;
  year?: number;
  semester?: Semesters;
  level?: CourseLevel;
};

define(Course, async (faker, context?: CourseFactoryContext) => {
  const subject = faker.random.arrayElement(["MATH", "CSSE", "COMP", "STAT"]);
  const code = faker.random.number({ min: 1000, max: 4999, precision: 1 });

  // constructs a new course.
  const course = new Course();
  course.code = context && context.code ? context.code : `${subject}${code}`;
  course.name = context && context.name ? context.name : faker.lorem.words(4);

  course.year =
    context && context.year
      ? context.year
      : faker.random.number({ min: 2017, max: 2022, precision: 1 });

  course.semester =
    context && context.semester
      ? context.semester
      : faker.random.number() % 2
      ? Semesters.One
      : Semesters.Two;

  course.courseLevel =
    context && context.level
      ? context.level
      : faker.random.number() % 3
      ? CourseLevel.Postgrad
      : CourseLevel.Undergrad;

  /*
  if (context?.groups) {
    for (const [role, group] of Object.entries(context.groups)) {
      course.addGroup(role as CourseRole, group);
    }
  }
  */

  // create an empty folder for the course's page.
  const page = new FolderNode();
  page.title = `${course.code}`;
  await page.save();
  course.coursePage = page;

  // create a text node within the course page.
  const text = new TextNode();
  text.title = `Welcome to ${subject}${code}`;
  text.text = "This will be a fun course";
  text.parent = Promise.resolve(page);
  await text.save();

  // create week 1 folder inside the course page.
  const folder = new FolderNode();
  folder.title = `Week 1`;
  folder.parent = Promise.resolve(page);
  await folder.save();

  // create a text node inside the course page.
  const text2 = new TextNode();
  text2.title = `Another text node`;
  text2.text = "This will still be a fun course";
  text2.parent = Promise.resolve(page);
  await text2.save();

  // create a subfolder inside the week 1 folder.
  const subfolder = new FolderNode();
  subfolder.title = `Tutorial`;
  subfolder.parent = Promise.resolve(folder);
  await subfolder.save();

  // create a new subfolder inside the week 1 tutorial folder.
  const subfolder2 = new FolderNode();
  subfolder2.title = "Subfolder 1";
  subfolder2.parent = Promise.resolve(subfolder);
  await subfolder2.save();

  // create a subfolder inside the subfolder.
  const subfolder3 = new FolderNode();
  subfolder3.title = "Subfolder 2";
  subfolder3.parent = Promise.resolve(subfolder2);
  await subfolder3.save();

  // create some text inside the week 1 folder.
  const folderText = new TextNode();
  folderText.title = "Week 1 content";
  folderText.text = "Get excited for the first week of summer";
  folderText.parent = Promise.resolve(folder);
  await folderText.save();

  // create assessment page for the course.
  const assessmentPage = new FolderNode();
  assessmentPage.title = `${course.code} Assessment`;
  await assessmentPage.save();
  course.assessmentPage = assessmentPage;

  // create assignment 1 folder inside assessment page.
  const assessmentFolder = new FolderNode();
  assessmentFolder.title = "Assignment 1";
  assessmentFolder.parent = Promise.resolve(assessmentPage);
  await assessmentFolder.save();

  // create some text inside the assignment 1 folder.
  const assessmentText = new TextNode();
  assessmentText.title = "Assignment 1 Details";
  assessmentText.text =
    "Assignment 1 is about figuring out what is the optimal way to spend the summer";
  assessmentText.parent = Promise.resolve(assessmentFolder);
  await assessmentText.save();

  /* 
  if (authors) {
    course.announcements = factory(Announcement)({
      course,
      authors: await authors.users,
    }).createMany(faker.random.number(10));
  }
  */

  return course;
});
