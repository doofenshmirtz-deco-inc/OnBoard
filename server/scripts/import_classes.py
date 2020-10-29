from pytimeparse.timeparse import timeparse
from graphqlclient import GraphQLClient
from datetime import datetime
import dateparser
import datetime
import csv
import os
import json
import time


def parse_file(filename):
    """
    Parses file to generate courses and classes for a single person with single user each.

    Parameter:
        filename (str): The path to the file.

    Returns:
        (tuple<list, list>): A tuple containing a list of courses and a list of classes.
    """
    # Deal with double tabs and newlines in Allocate+ output
    with open(filename, "r+") as file:
        content = file.read()
        file.seek(0)
        file.truncate()
        file.write(content.replace("\t\t", "\t").replace("\n\n", ""))

    # Read the file and parse file
    with open(filename, "r") as csvfile:
        # Deal with extra tab
        courses, classes = [], []

        reader = csv.DictReader(csvfile, delimiter="\t")

        for line in reader:
            code, sem, _, _ = line["Subject Code"].split("_")
            sem = "One" if "S1" else "Two"
            courses.append(
                {
                    "code": code,
                    "name": line["Description"],
                    "semester": sem,
                    # Level 6 is honours but counted as undergraduate for simplicity
                    "courseLevel": "Undergraduate"
                    if int(code[4]) < 7
                    else "Postgraduate",
                    "year": 2020,
                    # Get username from file name
                    "students": [filename.split("_")[2].split(".txt")[0]],
                }
            )

            # Clean up course types
            if "LEC" in line["Group"]:
                course_type = "Lecture"
            elif "TUT" in line["Group"]:
                course_type = "Tutorial"
            elif "PRA" in line["Group"]:
                course_type = "Practical"
            else:
                course_type = "Lecture"

            # Parse dates
            dates = [
                dateparser.parse(j, settings={"DATE_ORDER": "DMY"})
                + datetime.timedelta(minutes=timeparse(line["Time"]))
                for i in line["Dates"].split(", ")
                for j in i.split("-")
            ]

            date_starts, date_ends = [dates[0], dates[2]], [dates[1], dates[3]]
            dates_full = []

            for i in range(len(date_starts)):
                current_date = date_starts[i]
                # Timezone lol
                dates_full.append(current_date - datetime.timedelta(hours=10))
                while current_date < date_ends[i]:
                    current_date += datetime.timedelta(days=7)
                    # UTC+10, dodgy lol
                    dates_full.append(current_date - datetime.timedelta(hours=10))

            classes.append(
                {
                    "name": line["Group"] + "-" + line["Activity"],
                    "type": course_type,
                    "course": code,
                    "users": [filename.split("_")[2].split(".txt")[0]],
                    "duration": timeparse(line["Duration"]) // 60,
                    "dates": dates_full,
                }
            )

        return courses, classes


def merge_courses_classes(all_courses, all_classes):
    """
    Merge a list of multiple people's courses and classes into a list of courses with a list of users.

    Parameters:
        all_courses (list): A list of unmerged courses.
        all_classes (list): A list of unmerged classes.

    Returns:
        (tuple<list, list>): A tuple containing a list of merged courses and classes.
    """
    all_courses = sorted(all_courses, key=lambda i: i["code"])
    all_classes = sorted(all_classes, key=lambda i: i["course"])

    merged_courses = []
    merged_classes = []

    # Construct user list for each course
    for dictionary in all_courses:
        if (
            len(
                list(
                    filter(
                        lambda a: a["name"] == dictionary["name"]
                        and a["code"] == dictionary["code"],
                        merged_courses,
                    )
                )
            )
            == 0
        ):
            merged_courses.append(dictionary)
        else:
            next(
                filter(
                    lambda a: a["name"] == dictionary["name"]
                    and a["code"] == dictionary["code"],
                    merged_courses,
                )
            )["students"].extend(dictionary["students"])

    # Construct user list for each course
    for dictionary in all_classes:
        if (
            len(
                list(
                    filter(
                        lambda a: a["name"] == dictionary["name"]
                        and a["course"] == dictionary["course"],
                        merged_classes,
                    )
                )
            )
            == 0
        ):
            merged_classes.append(dictionary)
        else:
            next(
                filter(
                    lambda a: a["name"] == dictionary["name"]
                    and a["course"] == dictionary["course"],
                    merged_classes,
                )
            )["users"].extend(dictionary["users"])

    # Ensure no duplicates in each student list
    for dictionary in merged_courses:
        dictionary["students"] = list(set(dictionary["students"]))

    return merged_courses, merged_classes


def push_to_db(url, token, merged_courses, merged_classes):
    """
    Connects to database and uses mutations to add courses and classes to database.

    Parameters:
        url (str): The path to the GraphQL endpoint, to send POST requests.
        token (str): An authentication token with required permissions.
        merged_courses (list): A list of merged courses.
        merged_classes (list): A list of merged classes.

    Returns:
        (tuple<list, list>): A tuple containing a list of merged courses and classes.
    """
    client = GraphQLClient(url)
    # Need to retrieve token from web.
    client.inject_token(token)

    MUTATION_ADD_COURSE = """
mutation AddCourse($course: courseInput!) {
    addCourse(course: $course) {
        code
        name
        semester
        courseLevel
        year
        id
    }
}"""
    MUTATION_ADD_CLASS = """
mutation AddClass($classData: ClassGroupInput!) {
  addClassGroup(classData: $classData) {
    users {
      id
    }
    course {
      name
    }
    name
    type
    times
    duration
  }
}"""

    course_to_id = {}

    for course in merged_courses:
        result = client.execute(
            MUTATION_ADD_COURSE,
            variables=f"""
{{
    "course": {{
        "code": "{course['code']}",
        "name": "{course['name']}",
        "semester": "{course['semester']}",
        "courseLevel": "{course['courseLevel']}",
        "year": {course['year']},
        "students": {str(course['students']).replace("'", '"')}
    }}
}}
""",
        )
        json_result = json.loads(result)["data"]["addCourse"]
        # Create mapping between course code and course ID for next section.
        course_to_id[json_result["code"]] = json_result["id"]

    for classs in merged_classes:
        dates = [i.strftime("%Y-%m-%dT%H:%M:%SZ") for i in classs["dates"]]
        result = client.execute(
            MUTATION_ADD_CLASS,
            variables=f"""
{{
    "classData": {{
        "courseID": {course_to_id[classs['course']]},
        "name": "{classs['name']}",
        "type": "{classs['type']}",
        "times": {str(dates).replace("'", '"')},
        "duration": {classs['duration']},
        "uids": {str(classs['users']).replace("'", '"')}
    }}
}}
""",
        )


if __name__ == "__main__":
    files = os.listdir("classes")
    # Remove Mac files
    for file in files:
        if not file.endswith(".txt"):
            files.remove(file)

    # Parse through all files
    all_courses, all_classes = [], []
    for file in files:
        courses, classes = parse_file(os.path.join("classes", file))
        print("Parsed", file)
        all_courses += courses
        all_classes += classes

    merged_courses, merged_classes = merge_courses_classes(all_courses, all_classes)
    token = input("Paste token here: ")
    push_to_db("http://localhost:5000/graphql", token, merged_courses, merged_classes)
    print("Import complete!")
